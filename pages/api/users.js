import nextConnect from 'next-connect'
import { getSession } from 'next-auth/react'
import isEmail from 'validator/lib/isEmail'
import normalizeEmail from 'validator/lib/normalizeEmail'
import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'
import middleware from '../../middlewares/middleware'
import { getAllUsers } from '../../lib/db'
import { extractUser } from '../../lib/api-helpers'

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
  const session = await getSession({ req })

  if (!session && !session?.user) return res.status(401).json(null)
  return res.status(200).json(await getAllUsers(req))
})

handler.post(async (req, res) => {
  const { name, password } = req.body
  const email = normalizeEmail(req.body.email)
  if (!isEmail(email)) {
    res.status(400).send('The email you entered is invalid.')
    return
  }
  if (!password || !name) {
    res.status(400).send('Missing field(s)')
    return
  }
  if ((await req.db.collection('users').countDocuments({ email })) > 0) {
    res.status(403).send('The email has already been used.')
    return
  }
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await req.db
    .collection('users')
    .insertOne({
      _id: nanoid(12),
      email,
      password: hashedPassword,
      name,
      emailVerified: false,
      bio: '',
      profilePicture: null,
    })
    .then(({ ops }) => ops[0])
  req.logIn(user, (err) => {
    if (err) throw err
    res.status(201).json({
      user: extractUser(req),
    })
  })
})

export default handler
