import nextConnect from 'next-connect'
import middleware from '../../../../../../middlewares/middleware'
import { updateMatchups, getSchedule } from '../../../../../../lib/db'

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
  const { sport, yr, week } = req.query
  if (!sport && !yr) return res.json([null])

  return res.json(await getSchedule(req, sport, Number(yr), Number(week)))
})

handler.patch(async (req, res) => {
  const { user, body, db } = req
  // if no Admin user
  if (!user.isAdmin) {
    return res.status(401).send('unauthenticated')
  }
  // check to confirm body is array
  // ...

  const matchups = await updateMatchups(db, body)

  return res.json({ matchups })
})

export default handler
