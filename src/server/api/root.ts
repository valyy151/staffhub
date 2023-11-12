import { createTRPCRouter } from '@/server/api/trpc'
import { staffRouter } from '@/server/api/routers/staff'
import { staffNoteRouter } from '@/server/api/routers/staffNote'
import { sickLeaveRouter } from './routers/sickLeave'
import { rolesRouter } from './routers/roles'
import { vacationRouter } from './routers/vacation'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	staff: staffRouter,
	roles: rolesRouter,
	vacation: vacationRouter,
	sickLeave: sickLeaveRouter,
	staffNote: staffNoteRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
