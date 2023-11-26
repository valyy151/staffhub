import { db } from "@/server/db";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
	delete: protectedProcedure.mutation(async ({ ctx }) => {
		return await db.user.delete({ where: { id: ctx.session.user.id } })
	}),

	get: protectedProcedure.query(async ({ ctx }) => {
		const [staff, user] = await Promise.all([
			db.employee.count({ where: { userId: ctx.session.user.id } }),
			db.user.findUnique({
				where: { id: ctx.session.user.id },
				select: { name: true, email: true, image: true },
			}),
		])

		return {
			...user,
			staff,
		}
	}),
})
