/* eslint-disable no-underscore-dangle */
import nextConnect from 'next-connect'
import { nanoid } from 'nanoid'
import middleware from '../../../middlewares/middleware'

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
  if (!req.user) res.send(null)
  const query =
    '*[_type == "pick"] {...,matchup->, selectedTeam->{ "team_id": _id, name, mascot, abbreviation }}'
  const dbData = await req.SanityClient.fetch(query)
  return res.status(200).json({ picks: dbData })
})

handler.patch(async (req, res) => {
  const { user, body, SanityClient } = req
  // if no user
  if (!user) {
    return res.status(401).send('unauthenticated')
  }
  // See if a document already exists for a given user + matchupId
  const existingDocQuery =
    '*[ _type == "pick" && userId == $userId && matchup._ref in *[_type=="matchup" && _id==$matchupId]._id ] { _id, selectedTeam->{ "team_id": _id, name, mascot, abbreviation } }'
  const existingDocParams = {
    matchupId: body.matchup._ref,
    userId: user._id,
  }
  const existingDoc = await SanityClient.fetch(
    existingDocQuery,
    existingDocParams
  )
  let newDoc
  // if one is found, patch it by the found Id
  if (existingDoc.length) {
    await SanityClient.patch(existingDoc[0]._id)
      .set({
        selectedTeam: body.selectedTeam,
      })
      .commit()
      .catch((err) => {
        throw err
      })
  } else {
    // if no document found, create it appropriately
    newDoc = {
      ...body,
      _type: 'pick',
      _id: nanoid(),
      userId: user._id,
    }
    await SanityClient.createOrReplace(newDoc)
  }

  // finally, retrieve the newly patched/created doc to return in res
  const docQuery =
    '*[ _type == "pick" && _id == $pickId ] { selectedTeam->{ "team_id": _id, name, mascot, abbreviation } }'
  const docParams = { pickId: newDoc ? newDoc?._id : existingDoc[0]?._id }
  const fetchedDoc = await SanityClient.fetch(docQuery, docParams).then(
    (updatedDoc) => updatedDoc[0]
  )
  return res.send({ pick: fetchedDoc })
})

export default handler
