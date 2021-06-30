import nextConnect from 'next-connect'
import middleware from '../../../../middlewares/middleware'
import { getUserPicks } from '../../../../lib/db'

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
  const { user } = req
  if (!user) return res.status(401).send('Please log in')
  if (!req.query.userId) res.send(null)

  const userPicks = await getUserPicks(req, req.query.userId)

  return res.status(200).json({ picks: userPicks })
})

export default handler
