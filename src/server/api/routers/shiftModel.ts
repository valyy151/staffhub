import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { db } from '@/server/db'

export const shiftModelRouter = createTRPCRouter({
	get: protectedProcedure.query(async ({ ctx }) => {
		await new Promise((resolve) => setTimeout(resolve, 2000))

		return await db.shiftModel.findMany({
			where: {
				userId: ctx.session.user.id,
			},
			select: {
				id: true,
				end: true,
				start: true,
			},
			orderBy: { start: 'asc' },
		})
	}),
})
