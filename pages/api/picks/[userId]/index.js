import nextConnect from 'next-connect'
import middleware from '../../../../middlewares/middleware'

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
  const { user, SanityClient } = req
  if (!user) return res.status(401).send('Please log in')
  if (!req.query.userId) res.send(null)
  const pickQuery = `*[_type == "pick" && userId == $reqUserId] {...,matchup->, selectedTeam->{ "team_id": _id, name, mascot, abbreviation }}`
  const pickParams = { reqUserId: req.query.userId }
  const dbData = await SanityClient.fetch(pickQuery, pickParams)
  return res.status(200).json({ picks: dbData })
})

export default handler
