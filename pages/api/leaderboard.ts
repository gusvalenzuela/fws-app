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
  if (!sport && !yr) return res.json(null)

  // if no week is given, whole season's standings are retrieved
  // by using getUserStandings with no userId all users returned
  if (week === (null || 'null')) {
    return res.json(await getLeaderboard(db, sport, yr, null))
  }

  return res.json(await getLeaderboard(db, sport, yr, week))
})

export default handler
