import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import { config } from 'dotenv'
import routers from './routers.js'
import url from 'url'
import { join } from 'path'
// import { Telegraf } from 'telegraf'
config()

const app = express()
const dirname = url.fileURLToPath(new URL('.', import.meta.url))

app
  .use(cors({ origin: process.env.ORIGIN }))
  .use(express.json({ limit: '40mb' }))
  .use(express.urlencoded({ limit: '40mb', extended: true }))
  .use(express.static(join(dirname, '../', 'dist')))
  .use('/api', routers)
  .use('*', (req, res) => res.sendFile(join(dirname,'../','dist','index.html')))

app.listen(process.env.PORT, async () => {
  console.log('server start...')
  await mongoose.connect(process.env.MONGOURI)
    .then(() => console.log('db connect...'))
    .catch((err) => console.log('db error', err))
})