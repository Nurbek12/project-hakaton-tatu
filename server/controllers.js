import jwt from 'jsonwebtoken'
import * as cheerio from 'cheerio'
import { Post, User } from './models.js'
import Telegram from 'node-telegram-bot-api'
import { config } from 'dotenv'
import { IgApiClient } from 'instagram-private-api'
// import { get } from 'request-promise'

const postToInsta = async (images, content) => {
    const ig = new IgApiClient()
    ig.state.generateDevice(process.env.IG_USERNAME)
    await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD)

    await ig.publish.album({
        items: images.map(img => ({ file: img.media })),
        caption: content,
    })
}

config()

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
    const allowedTags = ['b', 'i', 'u', 's', 'span', 'strong', 'em', 'ins', 'strike','del', 'a', 'code', 'pre>']
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
            const page = req.query?.page || 1
            const limit = req.query?.limit || 20

            const count = await Post.countDocuments()
            const result = await Post.find()
                .populate('creator', 'name')
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
            const result = await Post.countDocuments()
            res.json(result)
        } catch (error) {
            console.log(error)
        }
    },
    
    create_post: async (req, res) => {
        try {
            const result = await Post.create(req.body)
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
            await Post.findByIdAndUpdate(req.params.id, { $set: { public: req.body.public } })
            res.json(true)
        } catch (error) {
            console.log(error)
        }
    },
    
    delete_post: async (req, res) => {
        try {
            await Post.findByIdAndDelete(req.params.id)
            res.json(true)
        } catch (error) {
            console.log(error)
        }
    },

    send_telegram: async (req, res) => {
        try {
            const photos = imgParser(req.body.text).map(image => ({ type:"photo", media: Buffer.from(image, 'base64') }))
            if(photos.length === 0) {
                await bot.sendMessage('@'+process.env.CHANEL, convertQuillToTelegram(req.body.text, req.body.title), { parse_mode: 'HTML' })
            } else {
                photos[photos.length-1].caption = convertQuillToTelegram(req.body.text, req.body.title)
                photos[photos.length-1].parse_mode = "HTML" //Markdown MarkdownV2
                await bot.sendMediaGroup('@'+process.env.CHANEL, photos)
                // await postToInsta(photos, removeTags(convertQuillToTelegram(req.body.text, req.body.title)))
                // console.log(photos)
                // var turndownService = new TurndownService()
                // turndownService.addRule('')
                // var markdown = turndownService.turndown(req.body.text)
                // photos[photos.length-1].caption = markdown
                // console.log(convertQuillToTelegram(req.body.text, req.body.title))
                // console.log(req.body.text);
                // console.log(downshow.downshow(new jsDom.JSDOM(req.body.text)));
                // console.log(markdown);
                
                // await bot.sendMessage('@'+process.env.CHANEL, convertQuillToTelegram(req.body.text, req.body.title), { parse_mode: 'HTML' })
            }
            res.json(true)
        } catch (error) {
            console.log(error)
        }
    },
}