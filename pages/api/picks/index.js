import nextConnect from 'next-connect'
import { getSession } from 'next-auth/react'
import middleware from '../../../middlewares/middleware'
import { updateUserPicks } from '../../../lib/db'

const handler = nextConnect()

handler.use(middleware)

handler.patch(async (req, res) => {
  const session = await getSession({ req })
  const { body, db } = req
  // if no user
  if (!session.user) {
    return res.status(401).send('unauthenticated')
  }
  const updatedResults = await updateUserPicks(db, session.user.id, body)

  return res.status(200).json({ updatedResults })
})

export default handler
