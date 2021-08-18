import nextConnect from 'next-connect'
import type { NextApiResponse } from 'next'
import type { CustomNextApiRequest } from '../../../../../../additional'
import middleware from '../../../../../../middlewares/middleware'
import { getUserStandings } from '../../../../../../lib/db'

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req: CustomNextApiRequest, res: NextApiResponse) => {
  const { user, db } = req
  const { userId, seasonYear } = req.query

  if (!user || !userId) {
    res.status(401).json(null)
    return
  }

  if (!seasonYear) return res.json(null)

  return res.json(await getUserStandings(db, userId, seasonYear))
})

export default handler
