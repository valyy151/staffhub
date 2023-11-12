import { createTRPCRouter } from '@/server/api/trpc'
import { staffRouter } from '@/server/api/routers/staff'
import { staffNoteRouter } from '@/server/api/routers/staffNote'
import { sickLeaveRouter } from './routers/sickLeave'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	staff: staffRouter,
	sickLeave: sickLeaveRouter,
	staffNote: staffNoteRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
