import { createTRPCRouter } from '@/server/api/trpc'
import { staffRouter } from '@/server/api/routers/staff'
import { staffNoteRouter } from '@/server/api/routers/staffNote'
import { sickLeaveRouter } from './routers/sickLeave'
import { roleRouter } from './routers/role'
import { vacationRouter } from './routers/vacation'
import { shiftModelRouter } from './routers/shiftModel'
import { shiftRouter } from './routers/shift'
import { dashboardRouter } from './routers/dashboard'
import { workDayRouter } from './routers/workDay'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	role: roleRouter,
	shift: shiftRouter,
	staff: staffRouter,
	workDay: workDayRouter,
	vacation: vacationRouter,
	sickLeave: sickLeaveRouter,
	dashboard: dashboardRouter,
	staffNote: staffNoteRouter,
	shiftModel: shiftModelRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
