import { z } from 'zod'
import { db } from '@/server/db'
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'

export const sickLeaveRouter = createTRPCRouter({
	delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
		return await db.sickLeave.delete({
			where: { id: input.id, userId: ctx.session.user.id },
		})
	}),
})
