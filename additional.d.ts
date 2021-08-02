import { NextApiRequest } from 'next'
import type { MongoClient, Db } from 'mongodb'

declare namespace JSX {
  interface IntrinsicElements {
    jsx: boolean
  }
}
export interface CustomNextApiRequest extends NextApiRequest {
  dbClient: MongoClient
  db: Db
}
export interface LeaderboardPlayer {
  seasonYear: number
  userId: string
  week: number
  sportId: number
  wins?: Array<string>
  losses?: Array<string>
  user: { name: string; isAdmin?: boolean }
  winPercent?: number
}
