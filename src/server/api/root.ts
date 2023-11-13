import { createTRPCRouter } from '@/server/api/trpc'
import { staffRouter } from '@/server/api/routers/staff'
import { staffNoteRouter } from '@/server/api/routers/staffNote'
import { sickLeaveRouter } from './routers/sickLeave'
import { roleRouter } from './routers/role'
import { vacationRouter } from './routers/vacation'
import { shiftModelRouter } from './routers/shiftModel'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	staff: staffRouter,
	role: roleRouter,
	vacation: vacationRouter,
	sickLeave: sickLeaveRouter,
	staffNote: staffNoteRouter,
	shiftModel: shiftModelRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
