import jwt from 'jsonwebtoken'
import * as cheerio from 'cheerio'
import { Post, User } from './models.js'
import Telegram from 'node-telegram-bot-api'
import { config } from 'dotenv'
import path from 'path'
import * as uuid from 'uuid'
import { IgApiClient } from 'instagram-private-api'
import url from 'url'
import fs from 'fs'
import ImageKit from 'imagekit'
// import { get } from 'request-promise'

config()

const dirname = url.fileURLToPath(new URL('.', import.meta.url))

const postToInsta = async (images, content) => {
    const ig = new IgApiClient()
    ig.state.generateDevice(process.env.IG_USERNAME)
    await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD)

    await ig.publish.album({
        items: images.map(img => ({ file: img.media })),
        caption: content,
    })
}

// function saveImageAndReplace(htmlString) {
//     const imageRegex = /<img[^>]+src="data:image\/[^;]+;base64,([^"]+)"/g;
//     let match;
  
//     while ((match = imageRegex.exec(htmlString)) !== null) {
//       const base64Data = match[1];
//       const buffer = Buffer.from(base64Data, 'base64');
//       const fileName = uuid.v4() + '.png'; // Assuming the images are PNGs
//       const filePath = path.join(dirname, 'upload', fileName);
  
//       fs.writeFile(filePath, buffer, (err) => {
//         if (err) {
//           console.error(err);
//           return;
//         }
//         console.log(`Saved image to ${filePath}`);
//       });
  
//       htmlString = htmlString.replace(match[0], `<img src="/${fileName}"`);
//     }
  
//     return htmlString;
// }

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUB_KEY,
    privateKey: process.env.IMAGEKIT_PPV_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_END
});
  
async function saveImageAndReplace(htmlString) {
    const imageRegex = /<img[^>]+src="data:image\/[^;]+;base64,([^"]+)"/g;
    let match;
  
    while ((match = imageRegex.exec(htmlString)) !== null) {
      const base64Data = match[1];
      const buffer = Buffer.from(base64Data, 'base64');
      const fileName = uuid.v4() + '.jpg';
  
      try {
        const response = await imagekit.upload({
          file: buffer,
          fileName: fileName
        });
        const imageUrl = response.url;
  
        // Replace the image data in the src with the imagekit.io URL
        htmlString = htmlString.replace(match[0], `<img src="${imageUrl}"`);
      } catch (error) {
        console.error(error);
      }
    }
  
    return htmlString;
}


function getPostsCountByDay(dbResult) {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  
    // Create an array of all the days in the current month
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
    // Create an empty result array
    const result = [];
  
    // Iterate over the array of days
    for (const day of days) {
      // Count the number of posts created on that day using the result from the database
      const count = dbResult.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate.getDate() === day && itemDate.getMonth() + 1 === currentMonth && itemDate.getFullYear() === currentYear;
      }).reduce((acc, item) => acc + item.count, 0);
  
      // If the count is zero, add an object with the day and a count of zero to the result array
      if (count === 0) {
        result.push({ day, count: 0 });
      }
      // If the count is greater than zero, add an object with the day and the count to the result array
      else {
        result.push({ day, count });
      }
    }
  
    // Return the result array
    return result;
}

const bot = new Telegram(process.env.TOKEN)

function imgParser(htmlText) {
    const $ = cheerio.load(htmlText);
    const imageSources = [];

    $('img').each((index, element) => {
        const src = $(element).attr('src');
        if (src) {
        if (src.startsWith('data:image')) {
            // Handle data URI sources
            const base64Data = src.split(',')[1];
            imageSources.push(base64Data);
        } else {
            // Handle regular URL sources
            imageSources.push(src);
        }
        }
    });

    return imageSources;
    // return htmlText
    //     .replace(/<img\s+[^>]*src="data:image\/\w+;base64,([^"]*)"[^>]*>/i, '$1')
    //     .replace(/<[^>]+?>/g, '')
}

function convertQuillToTelegram(html, title) {  
    const allowedTags = ['b', 'i', 'u', 's', 'strong', 'em', 'ins', 'strike','del', 'a', 'code', 'pre>']
    const $ = cheerio.load(`<b>${title}</b><br><br>${html}`);

    $('p, br').after('\n');

  $('*').not(allowedTags.join(',')).each((index, element) => {
    const parent = $(element).parent();
    const nextSibling = $(element).next();

    $(element).replaceWith($(element).contents());

    if (nextSibling.length) {
      parent.append(nextSibling);
    }
  });

  return $.html();
}

function removeTags(htmlString) {
    const $ = cheerio.load(htmlString)
    // $('p, br').after('\n');
    return $('body').text()
}

export const UserControllers = {
    get_users: async (req, res) => {
        try {
            const page = req.query?.page || 1
            const limit = req.query?.limit || 20

            const count = await User.countDocuments()
            const result = await User.find()
                .skip((page-1)*limit)
                .limit(limit)

            res.json({count,result})
        } catch (error) {
            console.log(error)
        }
    },

    login: async (req, res) => {
        try {
            const user = await User.findOne({ login: req.body.login })
            if(!user) return res.json(false)

            const { password, ...userdata } = user._doc
            
            if(req.body.password !== password) return res.json(false)
            const token = jwt.sign(userdata, "secret_token", { expiresIn: "2h" })
        return res.status(200).json({token, user: userdata })
        } catch (error) {
            console.log(error)
        }
    },

    get_users_counts: async (req, res) => {
        try {
            const result = await User.countDocuments()
            res.json(result)
        } catch (error) {
            console.log(error)
        }
    },

    create_user: async (req, res) => {
        try {
            const result = await User.create(req.body)
            
            res.json(result)
        } catch (error) {
            console.log(error)
        }
    },
    

    edit_user: async (req, res) => {
        try {
            const result = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })

            res.json(result)
        } catch (error) {
            console.log(error)
        }
    },

    delete_user: async (req, res) => {
        try {
            await User.findByIdAndDelete(req.params.id)

            res.json(true)
        } catch (error) {
            console.log(error)
        }
    },
}

export const PostControllers = {
    get_posts: async (req, res) => {
        try {
            let w = { public: true }
            if(req.user) delete w.public 
            const page = req.query?.page || 1
            const limit = req.query?.limit || 20

            const count = await Post.countDocuments()
            const result = await Post.find()
                .populate('creator', 'name')
                .select('-content_ru -content_en -content_uz')
                .skip((page-1)*limit)
                .limit(limit)

            res.json({count,result})
        } catch (error) {
            console.log(error)
        }
    },

    get_posts_by_id: async (req, res) => {
        try {
            const result = await Post.findById(req.params.id)
                .populate('creator', 'name')
            res.json(result)
        } catch (error) {
            console.log(error)
        }
    },
    
    get_posts_count: async (req, res) => {
        try {
            const result = await Post.countDocuments()
            res.json(result)
        } catch (error) {
            console.log(error)
        }
    },
    
    get_posts_pub_count: async (req, res) => {
        try {
            const result = await Post.countDocuments({ public: true })

            res.json(result)
        } catch (error) {
            console.log(error)
        }
    },
    
    get_posts_month_count: async (req, res) => {
        try {
            const currentMonth = new Date().getMonth() + 1;
            const currentYear = new Date().getFullYear();
            const result = await Post.aggregate([
                {
                    $match: {
                      createdAt: {
                        $gte: new Date(currentYear, currentMonth - 1, 1),
                        $lt: new Date(currentYear, currentMonth, 1)
                      }
                    }
                },
                {
                    $group: {
                      _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                      count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                      date: "$_id",
                      count: 1,
                      _id: 0
                    }
                }
            ])
            return res.json(getPostsCountByDay(result))
        } catch (error) {
            console.log(error)
        }
    },
    
    create_post: async (req, res) => {
        try {
            // console.log(await saveImageAndReplace(req.body.content_uz));
            const result = await Post.create({...req.body, content_uz: await saveImageAndReplace(req.body.content_uz)})
            res.json(result)
        } catch (error) {
            console.log(error)
        }
    },
    
    edit_post: async (req, res) => {
        try {
            const result = await Post.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })

            res.json(result)
        } catch (error) {
            console.log(error)
        }
    },
    
    toggle_post: async (req, res) => {
        try {
            const post = Post.findById(req.params.id)
            await Post.findByIdAndUpdate(req.params.id, { $set: { public: !post.public } })
            res.json(true)
        } catch (error) {
            console.log(error)
        }
    },
    
    delete_post: async (req, res) => {
        try {
            await Post.findByIdAndDelete(req.params.id)
            // console.log(d);
            res.json(true)
        } catch (error) {
            console.log(error)
        }
    },

    send_telegram: async (req, res) => {
        try {
            // console.log(convertQuillToTelegram(req.body.text, req.body.title));
            const photos = imgParser(req.body.text).map(image => ({ type:"photo", media: Buffer.from(image, 'base64') }))
            if(photos.length === 0) {
                await bot.sendMessage('@'+process.env.CHANEL, convertQuillToTelegram(req.body.text, req.body.title), { parse_mode: 'HTML' })
            } else {
                photos[photos.length-1].caption = convertQuillToTelegram(req.body.text, req.body.title)
                photos[photos.length-1].parse_mode = "HTML" //Markdown MarkdownV2
                await bot.sendMediaGroup('@'+process.env.CHANEL, photos)
          }
            res.json(true)
        } catch (error) {
            console.log(error)
        }
    },
}