import crypto from 'crypto'
import SibApiV3Sdk from 'sib-api-v3-sdk'
import nextConnect from 'next-connect'
import middleware from '../../../../middlewares/middleware'

const { SIB_API_KEY } = process.env
const emailClient = SibApiV3Sdk.ApiClient.instance

//  Configure API key authorization: api-key
const apiKey = emailClient.authentications['api-key']
apiKey.apiKey = SIB_API_KEY
//  Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//  apiKey.apiKeyPrefix['api-key'] = "Token"

const handler = nextConnect()

handler.use(middleware)

handler.post(async (req, res) => {
  if (!req.user) {
    res.json(401).send('you need to be authenticated')
    return
  }
  const token = crypto.randomBytes(32).toString('hex')
  await req.db.collection('tokens').insertOne({
    token,
    userId: req.user._id,
    type: 'emailVerify',
    expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
  })
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()

  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail() // SendSmtpEmail | Values to send a transactional email

  sendSmtpEmail = {
    subject: '[FWS] Verify your email address',
    htmlContent: `
    <div>
      <p>Hello, ${req.user.name}</p>
      <p>Please follow <a href="${process.env.WEB_URI}/verify-email/${token}">this link</a> to confirm your email.</p>
    </div>
    `,
    sender: { name: 'Gus Valenzuela', email: process.env.EMAIL_FROM },
    to: [
      {
        email: req.user.email,
        name: req.user.name,
      },
    ],
    headers: {
      'api-key': SIB_API_KEY,
      'content-type': 'application/json',
      accept: 'application/json',
    },
  }

  apiInstance.sendTransacEmail(sendSmtpEmail).then((data, err) => {
    console.log(
      `API called successfully. Returned data: ${JSON.stringify(data)}`
    )
    if (err) console.log(err)
    res.end('ok')
  })
})

export default handler
