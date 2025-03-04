"use client"

import { useEffect, useState } from "react"
import { Schedule, Direction } from "@/types/schedule"
import { commuteConfig } from "@/config/commute"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

type ScheduleDisplayProps = {
  direction: Direction
  schedules: Schedule[]
  lastUpdated: string
}

export function ScheduleDisplay({ direction, schedules, lastUpdated }: ScheduleDisplayProps) {
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    setMounted(true)
    // Update current time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
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

  const getTimeFromNow = (date: Date) => {
    const diffInMilliseconds = date.getTime() - currentTime.getTime()
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60))
    
    // For future times
    if (diffInMinutes > 0) {
      return `in ${diffInMinutes} min`
    }
    
    // For past times
    if (diffInMinutes < 0) {
      return `${Math.abs(diffInMinutes)} min ago`
    }
    
    // For current minute
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000)
    if (diffInSeconds > 0) return "in less than a minute"
    if (diffInSeconds < 0) return "less than a minute ago"
    return "now"
  }

  const getDelayedTime = (departureTime: string, delay: number) => {
    const date = new Date(departureTime)
    return new Date(date.getTime() + delay * 60000) // delay in minutes to milliseconds
  }

  const getActualDepartureTime = (schedule: Schedule) => {
    return schedule.delay > 0 
      ? getDelayedTime(schedule.departureTime, schedule.delay)
      : new Date(schedule.departureTime)
  }

  // Sort schedules by actual departure time and find the next train
  const sortedSchedules = [...schedules].sort((a, b) => {
    const timeA = getActualDepartureTime(a).getTime()
    const timeB = getActualDepartureTime(b).getTime()
    return timeA - timeB
  })

  const nextTrainIndex = sortedSchedules.findIndex(schedule => 
    getActualDepartureTime(schedule).getTime() > currentTime.getTime()
  )

  const getTrainLineColors = (line: string, isNextTrain: boolean) => {
    switch (line) {
      case "S3":
        return "bg-purple-600 text-purple-50"
      case "S4":
        return "bg-red-600 text-red-50"
      default:
        return isNextTrain
          ? "bg-primary-foreground text-primary"
          : "bg-secondary text-secondary-foreground"
    }
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
        {nextTrainIndex >= 0 && (
          <span className="text-sm font-medium text-muted-foreground animate-pulse">
            Next Train
          </span>
        )}
        <p className="text-sm text-muted-foreground">
          Updated {getTimeFromNow(new Date(lastUpdated))}
        </p>
      </div>

      <div className="grid gap-4">
        {sortedSchedules.map((schedule, index) => {
          const actualDepartureTime = getActualDepartureTime(schedule)
          const leaveTime = getRecommendedLeaveTime(actualDepartureTime.toISOString())
          const isNextTrain = index === nextTrainIndex

          return (
            <div
              key={`${schedule.line}-${schedule.departureTime}`}
              className={cn(
                "p-4 rounded-lg border transition-all duration-200",
                isNextTrain 
                  ? "bg-primary text-primary-foreground border-primary shadow-lg scale-102" 
                  : "hover:border-primary/50"
              )}
            >
              <div className="flex justify-between items-center">
                {/* Left side - Important info */}
                <div className="flex items-center gap-4">
                  <span className={cn(
                    "inline-flex items-center justify-center rounded-md px-2.5 py-0.5 text-lg font-semibold",
                    getTrainLineColors(schedule.line, isNextTrain)
                  )}>
                    {schedule.line}
                  </span>

                  <div>
                    <p className={cn(
                      "text-lg font-semibold",
                      isNextTrain ? "text-primary-foreground" : ""
                    )}>
                      {schedule.delay > 0 ? (
                        <>
                          <span className={cn(
                            "font-bold",
                            isNextTrain 
                              ? "text-red-500" 
                              : "text-red-600 dark:text-red-500"
                          )}>
                            {formatTime(getDelayedTime(schedule.departureTime, schedule.delay))}
                          </span>
                          <span className={cn(
                            "ml-2",
                            isNextTrain 
                              ? "text-primary-foreground/50" 
                              : "text-foreground/50"
                          )}>
                            {formatTime(new Date(schedule.departureTime))}
                          </span>
                        </>
                      ) : (
                        formatTime(new Date(schedule.departureTime))
                      )}
                    </p>
                    <div className={cn(
                      "flex items-center gap-1 mt-0.5",
                      isNextTrain ? "text-primary-foreground/80" : "text-muted-foreground"
                    )}>
                      <span className="font-medium">
                        {getTimeFromNow(actualDepartureTime)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side - Less important info */}
                <div className="text-right">
                  <p className={cn(
                    "text-sm mt-0.5",
                    isNextTrain ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}>
                    {direction === "morning" ? (
                      <>{schedule.from} → {schedule.to}</>
                    ) : (
                      <>{schedule.to} → {schedule.from}</>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}