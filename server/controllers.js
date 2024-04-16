// import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import * as cheerio from 'cheerio'
import { Post, User } from './models.js'
import Telegram from 'node-telegram-bot-api'
import { config } from 'dotenv'

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

function convertQuillToTelegram(htmlText, title) {
  const $ = cheerio.load(String(`<p><b>${title}</b></p><br>`+htmlText));
  // $.root().html();
  // console.log(1, $.root().text());

  $('b').each((index, element) => $(element).replaceWith(`<b>${$(element).text()}</b>`) );
  $('p').each((index, element) => $(element).replaceWith(`${$(element).text()}\n`) );
  $('strong').each((index, element) => $(element).replaceWith(`**${$(element).text()}**`) );
  $('i').each((index, element) => $(element).replaceWith(`__${$(element).text()}__`) );
  $('br').each((index, element) => $(element).replaceWith(`\n`) );
  $('em').each((index, element) => $(element).replaceWith(`__${$(element).text()}__`) );

  // Underline
  // $('u').each((index, element) => {
  //   $(element).replaceWith(`<u>${$(element).text()}</u>`);
  // });

  // Strikethrough
  $('s').each((index, element) => $(element).replaceWith(`~~${$(element).text()}~~`) );

  // Code block
  $('code').each((index, element) => $(element).replaceWith(`\`${$(element).text()}\``) );
  $('a').each((index, element) => {
    const href = $(element).attr('href');
    const text = $(element).text();
    $(element).replaceWith(`[${text}](${href})`);
    // $(element).replaceWith(`<a href="${href}" target="_blank">${text}</a>`);
  });

  return $.root().text();
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
            photos[photos.length-1].caption = convertQuillToTelegram(req.body.text, req.body.title)
            photos[photos.length-1].parse_mode = "MarkdownV2" //Markdown MarkdownV2
            // console.log(convertQuillToTelegram(req.body.text, req.body.title));
            await bot.sendMediaGroup('@'+process.env.CHANEL, photos)
            res.json(true)
        } catch (error) {
            console.log(error)
        }
    },
}