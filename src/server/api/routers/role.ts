import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { db } from '@/server/db'
import { z } from 'zod'

export const roleRouter = createTRPCRouter({
	get: protectedProcedure.query(async ({ ctx }) => {
		return await db.staffRole.findMany({
			where: {
				userId: ctx.session.user.id,
			},
			select: {
				id: true,
				name: true,
			},
		})
	}),

	update: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				roleIds: z.array(z.string()),
			})
		)
		.mutation(async ({ input: { id, roleIds }, ctx }) => {
			return await db.employee.update({
				where: {
					id,
					userId: ctx.session.user.id,
				},
				data: {
					roles: {
						set: roleIds.map((id) => ({
							id,
						})),
					},
				},
			})
		}),
})
