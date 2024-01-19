import { staffRouter } from "@/server/api/routers/staff"
import { staffNoteRouter } from "@/server/api/routers/staffNote"
import { createTRPCRouter } from "@/server/api/trpc"

import { dashboardRouter } from "./routers/dashboard"
import { roleRouter } from "./routers/role"
import { shiftRouter } from "./routers/shift"
import { shiftModelRouter } from "./routers/shiftModel"
import { sickLeaveRouter } from "./routers/sickLeave"
import { userRouter } from "./routers/user"
import { vacationRouter } from "./routers/vacation"
import { workDayRouter } from "./routers/workDay"
import { workDayNoteRouter } from "./routers/workDayNote"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  role: roleRouter,
  shift: shiftRouter,
  staff: staffRouter,
  workDay: workDayRouter,
  vacation: vacationRouter,
  sickLeave: sickLeaveRouter,
  dashboard: dashboardRouter,
  staffNote: staffNoteRouter,
  shiftModel: shiftModelRouter,
  workDayNote: workDayNoteRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
