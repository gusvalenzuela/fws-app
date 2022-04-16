import nextConnect from 'next-connect'
import { getSession } from 'next-auth/react'
import middleware from '../../../middlewares/middleware'
import { updateMatchups } from '../../../lib/db'

const handler = nextConnect()

handler.use(middleware)

handler.patch(async (req, res) => {
  const session = await getSession({ req })
  // if no Admin user
  if (!session.user || session.user.email !== process.env.ADMIN_USER) {
    return res.status(401).send('unauthenticated')
  }
  const { body, db } = req
  // check to confirm body is array
  const matchesToUpdate = Array.isArray(body) ? body : [body]
  // ...

  const matchups = await updateMatchups(db, matchesToUpdate)

  return res.json({ matchups })
})

export default handler
