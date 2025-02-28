import dotenvSafe from 'dotenv-safe'
import path from 'path'

const cwd = process.cwd()

const root = path.join.bind(cwd)

dotenvSafe.config({
  path: root('.env'),
  sample: root('.env.example'),
})

export const config = {
  PORT: process.env.PORT || 5666,
  NODE_ENV: process.env.NODE_ENV,
  AWS_KEY: process.env.AWS_KEY,
  AWS_SECRET: process.env.AWS_SECRET,
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
  X_BEARER_TOKEN: process.env.X_BEARER_TOKEN,
  IFRAMELY_API_KEY: process.env.IFRAMELY_API_KEY,
  TWITCH_CLIENT_ID: process.env.TWITCH_CLIENT_ID,
  TWITCH_CLIENT_SECRET: process.env.TWITCH_CLIENT_SECRET,
};
