import { PrayerTime } from './mosque'
export interface FavoriteMosque {
  id: string
  user_id: string
  mosque_id: string
  notifications_enabled: boolean
  mosque_name: string
  address: string
  status: string
  prayer_timings: PrayerTime[]
}
