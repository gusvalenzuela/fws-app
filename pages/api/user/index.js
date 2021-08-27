import nextConnect from 'next-connect'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import middleware from '../../../middlewares/middleware'
import { extractUser } from '../../../lib/api-helpers'

const upload = multer({ dest: '/tmp' })
const handler = nextConnect()

/* eslint-disable camelcase */
const {
  hostname: cloud_name,
  username: api_key,
  password: api_secret,
} = new URL(process.env.CLOUDINARY_URL)

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
})

handler.use(middleware)

handler.get(async (req, res) => {
  res.json({ user: extractUser(req) })
})

handler.patch(upload.single('profilePicture'), async (req, res) => {
  if (!req.user) {
    req.status(401).end()
    return
  }
  let profilePicture =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-user'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E"

  if (req.file) {
    const image = await cloudinary.uploader.upload(req.file.path, {
      width: 512,
      height: 512,
      crop: 'fill',
    })
    profilePicture = image.secure_url
  }
  const { name, bio } = req.body
  await req.db.collection('users').updateOne(
    { _id: req.user._id },
    {
      $set: {
        ...(name && { name }),
        bio: bio || '',
        ...(profilePicture && { profilePicture }),
      },
    }
  )
  res.json({ user: { name, bio } })
})

export const config = {
  api: {
    bodyParser: false,
  },
}

export default handler
