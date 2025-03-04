import { CommuteConfig } from "@/types/schedule"

export const commuteConfig: CommuteConfig = {
  morning: {
    journeys: [
      {
        from: "München-Langwied",
        to: "München-Laim",
        line: "S3"
      },
      {
        from: "München-Leienfelsstraße",
        to: "München-Laim",
        line: "S4"
      }
    ]
  },
  evening: {
    journeys: [
      {
        from: "München-Laim",
        to: "München-Langwied",
        line: "S3"
      },
      {
        from: "München-Laim",
        to: "München-Leienfelsstraße",
        line: "S4"
      }
    ]
  },
  walkingTimeMinutes: 10
}