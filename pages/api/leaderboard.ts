import nextConnect from 'next-connect'
import type { NextApiResponse } from 'next'
import type { CustomNextApiRequest } from '../../additional'
import middleware from '../../middlewares/middleware'
import { getLeaderboard } from '../../lib/db'

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req: CustomNextApiRequest, res: NextApiResponse) => {
  const { sport, yr, week } = req.query
  const { db } = req
  if (!sport && !yr && !week) return res.json(null)

  return res.json(await getLeaderboard(db, sport, yr, week))
})

export default handler
