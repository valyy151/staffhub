import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { db } from '@/server/db'

export const vacationRouter = createTRPCRouter({
	create: protectedProcedure
		.input(
			z.object({
				employeeId: z.string(),
				end: z.number(),
				start: z.number(),
			})
		)
		.mutation(async ({ input: { start, end, employeeId }, ctx }) => {
			return await db.vacation.create({
				data: {
					end,
					start,
					employeeId,
					userId: ctx.session.user.id,
				},
			})
		}),

	delete: protectedProcedure
		.input(
			z.object({
				id: z.string(),
			})
		)
		.mutation(async ({ input: { id }, ctx }) => {
			return await db.vacation.delete({ where: { id, userId: ctx.session.user.id } })
		}),
})
