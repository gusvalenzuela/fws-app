import nextConnect from 'next-connect'
import middleware from '../../../middlewares/middleware'
import { updateUserPicks } from '../../../lib/db'

const handler = nextConnect()

handler.use(middleware)

handler.patch(async (req, res) => {
  const { user, body, dbClient, db } = req
  // if no user
  if (!user) {
    return res.status(401).send('unauthenticated')
  }
  const updatedResults = await updateUserPicks(dbClient, db, user, body)

  return res.status(200).json({ updatedResults })
})

export default handler
