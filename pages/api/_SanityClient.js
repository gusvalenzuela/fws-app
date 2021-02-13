import SanityClient from '@sanity/client'

const client = SanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_TEAMS_TOKEN, // we need this to get write access
  useCdn: false, // We can't use the CDN for writing
})

export default client
