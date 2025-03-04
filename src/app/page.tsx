"use client"

import { useEffect, useState } from "react"
import { Direction, Schedule } from "@/types/schedule"
import { ScheduleDisplay } from "@/components/schedule-display"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export default function Home() {
  const [direction, setDirection] = useState<Direction>("morning")
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString())
  const { theme } = useTheme()

  // Function to determine direction based on time
  const getTimeBasedDirection = (): Direction => {
    const hour = new Date().getHours()
    // Morning: 12 AM to 12 PM, Evening: 12 PM to 12 AM
    return hour >= 0 && hour < 12 ? "morning" : "evening"
  }

  const handleSync = () => {
    setSchedules(generateMockSchedules(direction))
    setLastUpdated(new Date().toISOString())
  }

  // Auto-switch direction based on time
  useEffect(() => {
    const updateDirection = () => {
      setDirection(getTimeBasedDirection())
    }

    // Initial update
    updateDirection()

    // Update every minute
    const interval = setInterval(updateDirection, 60000)
    return () => clearInterval(interval)
  }, [])

  // Function to generate mock schedules with current timestamps
  const generateMockSchedules = (currentDirection: Direction): Schedule[] => {
    const now = new Date()
    const currentMinutes = now.getMinutes()
    const currentHours = now.getHours()
    
    // Create base date with current hours/minutes
    const baseDate = new Date()
    baseDate.setSeconds(0)
    baseDate.setMilliseconds(0)

    return [
      {
        line: "S3",
        from: currentDirection === "morning" ? "München-Langwied" : "München-Laim",
        to: currentDirection === "morning" ? "München-Laim" : "München-Langwied",
        departureTime: new Date(baseDate.getTime() + 15 * 60000).toISOString(),
        delay: Math.random() > 0.7 ? Math.floor(Math.random() * 10) : 0,
        platform: "1"
      },
      {
        line: "S4",
        from: currentDirection === "morning" ? "München-Leienfelsstraße" : "München-Laim",
        to: currentDirection === "morning" ? "München-Laim" : "München-Leienfelsstraße",
        departureTime: new Date(baseDate.getTime() + 25 * 60000).toISOString(),
        delay: Math.random() > 0.7 ? Math.floor(Math.random() * 10) : 0,
        platform: "2"
      },
      {
        line: "S3",
        from: currentDirection === "morning" ? "München-Langwied" : "München-Laim",
        to: currentDirection === "morning" ? "München-Laim" : "München-Langwied",
        departureTime: new Date(baseDate.getTime() + 35 * 60000).toISOString(),
        delay: Math.random() > 0.7 ? Math.floor(Math.random() * 10) : 0,
        platform: "1"
      },
      {
        line: "S4",
        from: currentDirection === "morning" ? "München-Leienfelsstraße" : "München-Laim",
        to: currentDirection === "morning" ? "München-Laim" : "München-Leienfelsstraße",
        departureTime: new Date(baseDate.getTime() + 45 * 60000).toISOString(),
        delay: Math.random() > 0.7 ? Math.floor(Math.random() * 10) : 0,
        platform: "2"
      }
    ]
  }

  // Update schedules when direction changes
  useEffect(() => {
    const updateSchedules = () => {
      setSchedules(generateMockSchedules(direction))
      setLastUpdated(new Date().toISOString())
    }

    // Initial update
    updateSchedules()

    // Update every 15 seconds
    const interval = setInterval(updateSchedules, 15000)

    return () => clearInterval(interval)
  }, [direction])

  return (
    <main className="container mx-auto p-4 max-w-2xl">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setDirection(direction === "morning" ? "evening" : "morning")}
            className="inline-flex items-center rounded-full border-2 border-input bg-background shadow-sm hover:bg-primary/5 transition-all duration-300 ease-in-out"
          >
            <div className="relative w-full overflow-hidden">
              <div className={cn(
                "flex items-center justify-center transition-all duration-500 transform",
                direction === "morning" ? "translate-x-0" : "-translate-x-full opacity-0"
              )}>
                <div className="flex items-center px-6 py-4 whitespace-nowrap">
                  <Icons.home className="h-6 w-6" />
                  <span className="ml-2 text-xl font-semibold leading-none">Home</span>
                </div>
                <div className="flex items-center px-1">
                  <Icons.arrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex items-center px-6 py-4 whitespace-nowrap">
                  <Icons.work className="h-6 w-6" />
                  <span className="ml-2 text-xl font-semibold leading-none">Work</span>
                </div>
              </div>
              <div className={cn(
                "flex items-center justify-center transition-all duration-500 transform absolute top-0 left-0 w-full",
                direction === "morning" ? "translate-x-full opacity-0" : "translate-x-0"
              )}>
                <div className="flex items-center px-6 py-4 whitespace-nowrap">
                  <Icons.work className="h-6 w-6" />
                  <span className="ml-2 text-xl font-semibold leading-none">Work</span>
                </div>
                <div className="flex items-center px-1">
                  <Icons.arrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex items-center px-6 py-4 whitespace-nowrap">
                  <Icons.home className="h-6 w-6" />
                  <span className="ml-2 text-xl font-semibold leading-none">Home</span>
                </div>
              </div>
            </div>
          </button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="transition-colors hover:bg-primary/10"
              onClick={handleSync}
            >
              <Icons.refresh className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Sync schedules</span>
            </Button>
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
