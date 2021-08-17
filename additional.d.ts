import type { NextApiRequest, GetServerSidePropsContext } from 'next'
import type { MongoClient, Db } from 'mongodb'

declare namespace JSX {
  interface IntrinsicElements {
    jsx: boolean
  }
}
export interface CustomNextApiRequest extends NextApiRequest {
  dbClient: MongoClient
  db: Db
  user?: { _id: string | number }
}
export interface CustomGetServerSidePropsContext
  extends GetServerSidePropsContext {
  user?: { _id: string }
  req: CustomNextApiRequest
}
export type LeaderboardPlayer = {
  seasonYear: number
  userId: string
  week: number
  sportId: number
  wins?: Array<string>
  losses?: Array<string>
  user: { name: string; isAdmin?: boolean }
  winPercent?: number
}
export type SportsTeam = {
  sportId: number
  team_id: number
  name: string
  mascot: string
  abbreviation: string
  record?: string | [string]
}
export type SportsMatchup = {
  sport_id: number
  matchupId: string
  event_id?: string
  away_team_id: number
  away_score?: number
  broadcast?: string | Array<string>
  date_event?: string | Date
  event_date: string | Date
  event_location: string
  event_name?: string
  event_status?: string // 'STATUS_SCHEDULED' | 'STATUS_FINAL'
  event_status_detail?: string
  home_team_id: number
  home_score?: number
  line_?: { point_spread: number; favorite: number }
  season_type: 'Regular Season' | 'Postseason'
  season_year: number
  updatedAt: number | Date
  week: number
  week_detail?: string
  week_name?: string
  winner?: number
}
