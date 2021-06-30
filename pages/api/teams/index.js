import nextConnect from 'next-connect'
import middleware from '../../../middlewares/middleware'
import { getTeams } from '../../../lib/db'

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
  const { sport } = req.query
  if (!sport) return res.json(null)

  return res.json(await getTeams(req, sport))
})

export default handler
