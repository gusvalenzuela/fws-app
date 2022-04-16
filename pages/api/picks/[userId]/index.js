import nextConnect from 'next-connect'
import { getSession } from 'next-auth/react'
import middleware from '../../../../middlewares/middleware'
import { getUserPicks } from '../../../../lib/db'

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
  const session = await getSession({ req })
  if (!session.user) return res.status(401).send('Please log in')

  const { userId, week, yr } = req.query

  if (!userId && !week && !yr) return res.json({ picks: null })

  const userPicks = await getUserPicks(req, userId, week, yr)

  return res.status(200).json({ picks: userPicks })
})

export default handler
