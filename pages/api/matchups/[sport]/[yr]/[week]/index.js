import nextConnect from 'next-connect'
// import { getSession } from 'next-auth/client'
import middleware from '../../../../../../middlewares/middleware'
import { getSchedule } from '../../../../../../lib/db'

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
  const { sport, yr, week } = req.query
  if (!sport && !yr) return res.json([null])

  return res.json(await getSchedule(req, sport, Number(yr), Number(week)))
})

export default handler
