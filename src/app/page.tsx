"use client"

import { useEffect, useState } from "react"
import { Direction, Schedule } from "@/types/schedule"
import { ScheduleDisplay } from "@/components/schedule-display"
import { ModeToggle } from "@/components/mode-toggle"

export default function Home() {
  const [direction, setDirection] = useState<Direction>("morning")
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString())

  useEffect(() => {
    // Determine direction based on time of day
    const hour = new Date().getHours()
    setDirection(hour >= 12 ? "evening" : "morning")

    // TODO: Implement real API integration
    // For now, using mock data
    const mockSchedules: Schedule[] = [
      {
        line: "S3",
        from: direction === "morning" ? "München-Langwied" : "München-Laim",
        to: direction === "morning" ? "München-Laim" : "München-Langwied",
        departureTime: new Date(Date.now() + 15 * 60000).toISOString(),
        delay: 0,
        platform: "1"
      },
      {
        line: "S4",
        from: direction === "morning" ? "München-Leienfelsstraße" : "München-Laim",
        to: direction === "morning" ? "München-Laim" : "München-Leienfelsstraße",
        departureTime: new Date(Date.now() + 25 * 60000).toISOString(),
        delay: 5,
        platform: "2"
      }
    ]

    setSchedules(mockSchedules)
    setLastUpdated(new Date().toISOString())
  }, [direction])

  return (
    <main className="container mx-auto p-4 max-w-2xl">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">S-Bahn Schedule</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setDirection(direction === "morning" ? "evening" : "morning")}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Toggle Direction
            </button>
            <ModeToggle />
          </div>
        </div>

        <ScheduleDisplay
          direction={direction}
          schedules={schedules}
          lastUpdated={lastUpdated}
        />
      </div>
    </main>
  )
}
