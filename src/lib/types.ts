import type {
  StaffScheduleOutput,
  StaffScheduleShift,
  WorkDayShiftsOutput,
} from "@/trpc/shared"

export type Absence = { id: string; start: bigint; end: bigint }

export type Shift = {
  id?: string
  date?: number
  start?: number
  end?: number
  workDayId?: string
  vacation?: boolean
  sickLeave?: boolean
  role?: { id: string; name: string } | null
}

export type ShiftModel = { id: string; start: number; end: number }

export type Note = {
  id: string
  date: number
  userId: string
  content: string
  createdAt: Date
  workDayId: string
}

export type DashboardAbsence = {
  amount: number
  reason: string
  absent: boolean
  approved: boolean
  employee: { name: string; id: string }
  shifts: { id: string; approved: boolean; date: number }[]
}

export type ShiftEmployee = StaffScheduleOutput &
  Pick<WorkDayShiftsOutput["shifts"][number], "employee">

export type ShiftRow = WorkDayShiftsOutput["shifts"][number] &
  StaffScheduleShift

export type ScheduleData = {
  date: number
  end?: string
  start?: string
}[]

export type ScheduleTableProps = {
  data: ScheduleData
  shiftModel: string
  sickDays: number[]
  vacationDays: number[]
  setData: (data: ScheduleData) => void
}
