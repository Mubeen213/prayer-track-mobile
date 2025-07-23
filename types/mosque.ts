export type PrayerName = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'juma'

export interface PrayerTime {
  prayer_name: PrayerName
  adhan_time: string
  jamaat_time: string
}

export interface Mosque {
  id: string
  name: string
  address: string
  landmark?: string
  city: string
  state: string
  latitude: number
  longitude: number
  status: 'active' | 'unverified' | 'inactive' | 'verified'
  last_timings_update: string
  source?: 'google' | 'manual' | 'admin'
  place_id?: string
  prayer_timings: PrayerTime[]
}

export interface MosquesResponse {
  mosques: Mosque[]
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}
