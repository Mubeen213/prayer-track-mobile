export interface Ayah {
  ayah_number: number
  arabic: string
  urdu: string
  english: string
}

export interface Chapter {
  surah_number: number
  surah_name: string
  ayahs: Ayah[]
}

export type FontSize = 'small' | 'medium' | 'large'
export type TranslationType = 'none' | 'english' | 'urdu' | 'both'
export type ThemeType = 'light' | 'dark'
