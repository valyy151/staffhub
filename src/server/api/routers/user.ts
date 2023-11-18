import { db } from '@/server/db'
import { createTRPCRouter, protectedProcedure } from './../trpc'

export const userRouter = createTRPCRouter({
	delete: protectedProcedure.mutation(async ({ ctx }) => {
		return await db.user.delete({ where: { id: ctx.session.user.id } })
	}),
})
