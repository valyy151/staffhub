import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { db } from '@/server/db'

export const staffNoteRouter = createTRPCRouter({
	create: protectedProcedure
		.input(
			z.object({
				content: z.string(),
				employeeId: z.string(),
			})
		)
		.mutation(async ({ input, ctx }) => {
			return await db.employeeNote.create({
				data: {
					content: input.content,
					userId: ctx.session.user.id,
					employeeId: input.employeeId,
				},
			})
		}),

	delete: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				employeeId: z.string(),
			})
		)
		.mutation(async ({ input, ctx }) => {
			return await db.employeeNote.delete({
				where: {
					id: input.id,
					userId: ctx.session.user.id,
					employeeId: input.employeeId,
				},
			})
		}),
})
