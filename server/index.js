import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import { config } from 'dotenv'
import routers from './routers.js'
// import { Telegraf } from 'telegraf'
config()

const app = express()

app
  .use(cors({ origin: process.env.ORIGIN }))
  .use(express.json({ limit: '40mb' }))
  .use(express.urlencoded({ limit: '40mb', extended: true }))
  .use('/api', routers)


app.listen(process.env.PORT, async () => {
  console.log('server start...')
  await mongoose.connect(process.env.MONGOURI)
    .then(() => console.log('db connect...'))
    .catch((err) => console.log('db error', err))
})