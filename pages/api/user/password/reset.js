import SibApiV3Sdk from 'sib-api-v3-sdk'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import nextConnect from 'next-connect'
import database from '../../../../middlewares/database'

const { SIB_API_KEY } = process.env
let emailClient = SibApiV3Sdk.ApiClient.instance

// Configure API key authorization: api-key
let apiKey = emailClient.authentications['api-key']
apiKey.apiKey = SIB_API_KEY
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//apiKey.apiKeyPrefix['api-key'] = "Token"

const handler = nextConnect()

handler.use(database)

handler.post(async (req, res) => {
  const user = await req.db
    .collection('users')
    .findOne({ email: req.body.email })
  if (!user) {
    res.status(401).send('The email is not found')
    return
  }
  const token = crypto.randomBytes(32).toString('hex')
  await req.db.collection('tokens').insertOne({
    token,
    userId: user._id,
    type: 'passwordReset',
    expireAt: new Date(Date.now() + 1000 * 60 * 20),
  })

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()

  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail() // SendSmtpEmail | Values to send a transactional email

  sendSmtpEmail = {
    subject: '[FWS] Reset your password.',
    htmlContent: `
    <div>
      <p>Hello, ${user.name}</p>
      <p>Please follow <a href="${process.env.WEB_URI}/forget-password/${token}">this link</a> to reset your password.</p>
    </div>
    `,
    sender: { name: 'Gus Valenzuela', email: process.env.EMAIL_FROM },
    to: [
      {
        email: user.email,
        name: user.name,
      },
    ],
    headers: {
      'api-key': SIB_API_KEY,
      'content-type': 'application/json',
      accept: 'application/json',
    },
  }

  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data) {
      console.log(
        'API called successfully. Returned data: ' + JSON.stringify(data)
      )
    },
    function (error) {
      console.error(error)
    },
    res.end('ok')
  )
})

handler.put(async (req, res) => {
  // password reset
  if (!req.body.password) {
    res.status(400).send('Password not provided')
    return
  }
  const { value: tokenDoc } = await req.db
    .collection('tokens')
    .findOneAndDelete({ token: req.body.token, type: 'passwordReset' })
  if (!tokenDoc) {
    res.status(403).send('This link may have been expired.')
    return
  }
  const password = await bcrypt.hash(req.body.password, 10)
  await req.db
    .collection('users')
    .updateOne({ _id: tokenDoc.userId }, { $set: { password } })
  res.end('ok')
})

export default handler
