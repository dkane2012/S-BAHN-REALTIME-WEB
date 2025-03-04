"use client"

import { useEffect, useState } from "react"
import { Schedule, Direction } from "@/types/schedule"
import { commuteConfig } from "@/config/commute"

type ScheduleDisplayProps = {
  direction: Direction
  schedules: Schedule[]
  lastUpdated: string
}

export function ScheduleDisplay({ direction, schedules, lastUpdated }: ScheduleDisplayProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const getRecommendedLeaveTime = (departureTime: string) => {
    const departure = new Date(departureTime)
    const leaveTime = new Date(departure.getTime() - commuteConfig.walkingTimeMinutes * 60 * 1000)
    return leaveTime
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Show a loading state or skeleton during server-side rendering and initial mount
  if (!mounted) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-gray-200 rounded"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 rounded-lg border">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                  <div className="mt-1 h-4 w-32 bg-gray-200 rounded"></div>
                </div>
                <div className="text-right">
                  <div className="h-6 w-24 bg-gray-200 rounded"></div>
                  <div className="mt-1 h-4 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {direction === "morning" ? "Morning Commute" : "Evening Commute"}
        </h2>
        <p className="text-sm text-muted-foreground">
          Last updated: {formatTime(new Date(lastUpdated))}
        </p>
      </div>

      <div className="grid gap-4">
        {schedules.map((schedule, index) => {
          const leaveTime = getRecommendedLeaveTime(schedule.departureTime)
          const isNextTrain = index === 0

          return (
            <div
              key={`${schedule.line}-${schedule.departureTime}`}
              className={`p-4 rounded-lg border ${isNextTrain ? "bg-primary/10 border-primary" : ""}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="inline-flex items-center justify-center rounded-md bg-primary px-2.5 py-0.5 text-sm font-semibold text-primary-foreground">
                    {schedule.line}
                  </span>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {schedule.from} → {schedule.to}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    {formatTime(new Date(schedule.departureTime))}
                    {schedule.delay > 0 && (
                      <span className="text-destructive ml-1">
                        +{schedule.delay}m
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Platform {schedule.platform}
                  </p>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t">
                <p className="text-sm">
                  Leave by: <span className="font-medium">{formatTime(leaveTime)}</span>
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}