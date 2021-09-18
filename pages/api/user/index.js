import nextConnect from 'next-connect'
import { ObjectID as ObjectId } from 'mongodb'
import { getSession } from 'next-auth/client'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import middleware from '../../../middlewares/middleware'
import { getUser } from '../../../lib/db'

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
  const session = await getSession({ req })
  if (!session.user || !session.user.email) {
    res.json(null)
    return
  }
  res.json({ user: await getUser(req, session.user.id, true) })
})

handler.patch(upload.single('profilePicture'), async (req, res) => {
  const session = await getSession({ req })
  if (!session.user) {
    req.status(401).end()
    return
  }
  const objId = new ObjectId(session.user.id)
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
  const { name, bio, layout } = req.body
  const updatedUser = await req.db.collection('users').updateOne(
    { _id: objId },
    {
      $set: {
        ...(name && { name }),
        bio: bio || '',
        ...(profilePicture && { profilePicture }),
        ...(layout && { prefersModernLayout: layout === 'modern' }),
      },
    }
  )

  if (updatedUser.matchedCount < 1 || updatedUser.modifiedCount < 1) {
    res.status(400).json({ msg: 'No user found or modified.' })
    return
  }
  res.status(200).json({
    user: {
      name,
      bio,
      prefersModernLayout: layout === 'modern',
      profilePicture,
    },
  })
})

export const config = {
  api: {
    bodyParser: false,
  },
}

export default handler
