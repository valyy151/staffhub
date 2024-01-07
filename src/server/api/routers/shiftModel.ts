import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { db } from '@/server/db'
import { formatTime } from '@/lib/utils'

export const shiftModelRouter = createTRPCRouter({
	get: protectedProcedure.query(async ({ ctx }) => {
		const models = await db.shiftModel.findMany({
			where: {
				userId: ctx.session.user.id,
			},
			select: {
				id: true,
				end: true,
				start: true,
			},
		})

		const date = new Date()

		return models
			.map((model) => {
				const formattedStart = formatTime(model.start)
				const formattedEnd = formatTime(model.end)

				const [startHour, startMinute] = formattedStart.split(':')
				const [endHour, endMinute] = formattedEnd.split(':')

				date.setHours(parseInt(startHour!))
				date.setMinutes(parseInt(startMinute!))

				model.start = date.getTime() / 1000

				date.setHours(parseInt(endHour!))
				date.setMinutes(parseInt(endMinute!))

				model.end = date.getTime() / 1000

				return model
			})
			.sort((a, b) => a.start - b.start)
	}),

	create: protectedProcedure
		.input(
			z.object({
				end: z.number(),
				start: z.number(),
			})
		)
		.mutation(async ({ input: { end, start }, ctx }) => {
			return await db.shiftModel.create({
				data: {
					end,
					start,
					userId: ctx.session.user.id,
				},
			})
		}),

	update: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				end: z.number(),
				start: z.number(),
			})
		)
		.mutation(async ({ input: { id, end, start }, ctx }) => {
			return await db.shiftModel.update({
				where: { id, userId: ctx.session.user.id },
				data: { end, start },
			})
		}),

	delete: protectedProcedure
		.input(
			z.object({
				id: z.string(),
			})
		)
		.mutation(async ({ input: { id }, ctx }) => {
			return await db.shiftModel.delete({
				where: { id, userId: ctx.session.user.id },
			})
		}),
})
