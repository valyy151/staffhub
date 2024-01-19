import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import type { Absence, Shift } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages]
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages]
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ]
}

// Checks the absence status of an employee based on their sick leaves and vacations.
export const checkAbsence = (sickLeaves: Absence[], vacations: Absence[]) => {
  const currentDate = Date.now()

  for (const sickLeave of sickLeaves) {
    const startDate: Date = new Date(Number(sickLeave.start))
    const endDate: Date = new Date(Number(sickLeave.end))

    if (
      Number(currentDate) >= Number(startDate) &&
      Number(currentDate) <= Number(endDate)
    ) {
      const remainingDays = Math.ceil(
        (Number(endDate) - currentDate) / (1000 * 60 * 60 * 24),
      )
      return "Currently on sick leave for " + remainingDays + " more days"
    }
  }

  for (const vacation of vacations) {
    const startDate: Date = new Date(Number(vacation.start))
    const endDate: Date = new Date(Number(vacation.end))

    if (
      Number(currentDate) >= Number(startDate) &&
      Number(currentDate) <= Number(endDate)
    ) {
      const remainingDays = Math.ceil(
        (Number(endDate) - currentDate) / (1000 * 60 * 60 * 24),
      )
      return "Currently on vacation for " + remainingDays + " more days"
    }
  }

  return "Currently working"
}

export const getNumberOfSickDays = (sickLeaves: Absence[]): number => {
  let days = 0

  const startOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1,
  ).getTime()
  const endOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0,
  ).getTime()

  for (const sickLeave of sickLeaves) {
    const startDate: Date = new Date(Number(sickLeave.start))
    const endDate: Date = new Date(Number(sickLeave.end))

    if (Number(startDate) >= startOfMonth && Number(endDate) <= endOfMonth) {
      days += Math.ceil(
        (Number(endDate) - Number(startDate)) / (1000 * 60 * 60 * 24),
      )
    }
  }

  return days
}

//calculates the total hours worked in a month, used in the staff profile overview
export const calculateStaffHours = (shifts: Shift[]): string => {
  let hours = 0
  let minutes = 0

  for (const shift of shifts) {
    if (shift.start && shift.end) {
      const diff = Number(shift.end) - Number(shift.start)

      const diffHours = Math.floor(diff / 3600)

      const diffMinutes = Math.floor((diff % 3600) / 60)

      hours += diffHours
      minutes += diffMinutes
    }
  }

  hours += Math.floor(minutes / 60)

  if (minutes === 0) {
    return hours + "h"
  }

  return hours + "h " + (minutes % 60) + "m"
}

// calculates the total hours worked in a month, used when creating schedule
export const calculateHours = (
  shifts: { date: number; start?: string; end?: string }[],
): string => {
  let hours = 0
  let minutes = 0

  for (const shift of shifts) {
    const startDate = new Date()
    const endDate = new Date()

    if (shift.start && shift.end) {
      const [startHour, startMinute] = shift.start.split(":")

      startDate.setHours(Number(startHour))
      startDate.setMinutes(Number(startMinute))

      const [endHour, endMinute] = shift.end.split(":")

      endDate.setHours(Number(endHour))
      endDate.setMinutes(Number(endMinute))

      const diff = Math.floor((endDate.getTime() - startDate.getTime()) / 1000)

      const diffHours = Math.floor(diff / 3600)

      const diffMinutes = Math.floor((diff % 3600) / 60)

      hours += diffHours
      minutes += diffMinutes
    }
  }

  hours += Math.floor(minutes / 60)

  if (minutes === 0) {
    return hours + "h"
  }

  return hours + "h " + (minutes % 60) + "m"
}

// returns the first and last day of the month
export const getMonth = (date: Date): [number, number] => {
  date.setDate(1)
  date.setHours(0, 0, 0, 0)
  const startOfMonth = Math.floor(date.getTime() / 1000)

  date.setMonth(date.getMonth() + 1)
  date.setDate(date.getDate() - 1)
  date.setHours(23, 59, 59, 999)
  const endOfMonth = Math.floor(date.getTime() / 1000)

  return [startOfMonth, endOfMonth]
}

// returns the vacations or sick leaves based if they are in the past, present or future
export const checkAbsences = (
  absences: Absence[],
): [Absence[], Absence | undefined, Absence[]] => {
  const today = new Date().getTime()

  const currentAbsence = absences.find((absence) => {
    return absence.start < BigInt(today) && absence.end > BigInt(today)
  })

  const pastAbsences = absences.filter((absence) => {
    return absence.end < BigInt(today)
  })

  const upcomingAbsences = absences.filter((absence) => {
    return absence.start > BigInt(today)
  })

  return [pastAbsences, currentAbsence, upcomingAbsences]
}

export const howManyDays = (sickLeave: Absence) => {
  const days = (sickLeave.end - sickLeave.start) / BigInt(86400000)
  return Number(days)
}

// converts the unix timestamp to a time string in the format HH:MM
export const formatTime = (unix: number) => {
  if (!unix) return ""
  return new Date(unix * 1000).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

// returns the name of the weekday
export const formatDay = (date: number, length: "long" | "short") => {
  return new Date(date * 1000).toLocaleDateString("en-GB", { weekday: length })
}

// converts date into a string in the format DD/MM/YYYY
export const formatDate = (date: number, length: "long" | "short") => {
  return new Date(date * 1000).toLocaleDateString("en-GB", {
    dateStyle: length,
  })
}

// returns the total number of hours worked in a shift as a string in the format HHh MMmin
export const formatTotal = (start: number, end: number) => {
  if (start && end) {
    const totalSeconds = end - start
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)

    let result = ""

    if (hours > 0) {
      result += `${hours}h `
    }

    if (minutes > 0) {
      result += `${minutes}min`
    }

    return result
  } else return `${0}h ${0}min`
}
// formatTotal but for creating shifts
export const renderTotal = (start: string, end: string) => {
  const date = new Date()

  const [startHour, startMinute] = start.split(":")
  const [endHour, endMinute] = end.split(":")

  date.setHours(Number(startHour))
  date.setMinutes(Number(startMinute))

  const startUnixTime = Math.floor(date.getTime() / 1000)

  if (endHour === "00") {
    date.setDate(date.getDate() + 1)
  }

  date.setHours(Number(endHour))
  date.setMinutes(Number(endMinute))

  const endUnixTime = Math.floor(date.getTime() / 1000)

  return formatTotal(startUnixTime, endUnixTime)
}

// function that is used by the calendar when creating a monthly schedule
// returns an array of objects with the date in unix timestamp format
export const changeMonth = (date: Date) => {
  const year = date.getFullYear()

  const monthIndex = date.getMonth()
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()

  const data: { start?: string; end?: string; date: number }[] = new Array(
    daysInMonth,
  )
    .fill(null)
    .map((_, index) => {
      const day = index + 1
      const dateUnixTimestamp = new Date(year, monthIndex, day).getTime() / 1000

      return {
        date: dateUnixTimestamp,
      }
    })
  return data
}

// function that is used when changeMonth is called
// returns an array of objects with the date in unix timestamp format for the whole year
export const generateYearArray = (year: number) => {
  const daysInYear = 365 + (isLeapYear(year) ? 1 : 0)
  const startOfYear = new Date(year, 0, 1)
  const yearArray = []

  for (let i = 0; i < daysInYear; i++) {
    const currentDate = new Date(
      startOfYear.getTime() + i * 24 * 60 * 60 * 1000,
    )
    yearArray.push({ date: currentDate.getTime() / 1000 })
  }

  return yearArray
}

const isLeapYear = (year: number) => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

// checks the absences of an employee and returns an array of the days when they are absent
export const findAbsenceDays = (
  absences: { id: string; end: bigint; start: bigint }[] | undefined,
  schedule: {
    start?: string | undefined
    end?: string | undefined
    date: number
  }[],
) => {
  const vacationDays: number[] = []
  const sickDays: number[] = []
  absences?.forEach((absence) => {
    schedule?.forEach((day) => {
      if (day.date * 1000 >= absence.start && day.date * 1000 <= absence.end) {
        if (absence.id.startsWith("vacation")) {
          vacationDays.push(day.date)
        } else if (absence.id.startsWith("sickLeave")) {
          sickDays.push(day.date)
        }
      }
    })
  })

  return { vacationDays, sickDays }
}

// function that is used when creating a shift
// converts the time string into a unix timestamp
export const handleTimeChange = (
  newTime: string,
  field: "start" | "end",
  setStart: (start: string) => void,
  setEnd: (end: string) => void,
) => {
  if (newTime.length > 5) {
    return
  }

  field === "start" ? setStart(newTime) : setEnd(newTime)

  if (newTime.length === 2) {
    if (Number(newTime) > 23) {
      field === "start" ? setStart("00:") : setEnd("00:")
    } else {
      field === "start" ? setStart(`${newTime}:`) : setEnd(`${newTime}:`)
    }
  }

  if (Number(newTime.split(":")[1]) > 59) {
    field === "start"
      ? setStart(`${newTime.split(":")[0]}:00`)
      : setEnd(`${newTime.split(":")[0]}:00`)
  }

  const date = new Date()

  const [hour, minute] = newTime.split(":")

  date.setHours(Number(hour))
  date.setMinutes(Number(minute))

  const newUnixTime = Math.floor(date.getTime() / 1000)

  if (minute?.length === 5) {
    field === "start"
      ? setStart(formatTime(newUnixTime))
      : setEnd(formatTime(newUnixTime))
  }
}
