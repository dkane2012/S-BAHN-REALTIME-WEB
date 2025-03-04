export type Station = "München-Langwied" | "München-Laim" | "München-Leienfelsstraße"

export type Line = "S3" | "S4"

export type Direction = "morning" | "evening"

export type Journey = {
  from: Station
  to: Station
  line: Line
}

export type Schedule = {
  departureTime: string
  delay: number
  platform: string
  line: Line
  from: Station
  to: Station
}

export type ScheduleResponse = {
  schedules: Schedule[]
  lastUpdated: string
}

export type CommuteConfig = {
  morning: {
    journeys: Journey[]
  }
  evening: {
    journeys: Journey[]
  }
  walkingTimeMinutes: number
}