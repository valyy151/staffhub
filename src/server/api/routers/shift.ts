import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { db } from '@/server/db'
import { getMonth } from '@/app/lib/utils'

export const shiftRouter = createTRPCRouter({
	schedule: protectedProcedure.input(z.object({ id: z.string(), month: z.date() })).query(async ({ input: { id, month }, ctx }) => {
		const [startOfMonth, endOfMonth] = getMonth(month)

		const [shifts, workDays] = await Promise.all([
			db.shift.findMany({
				where: { date: { gte: startOfMonth, lte: endOfMonth }, employeeId: id, userId: ctx.session.user.id },
				select: { id: true, date: true, start: true, end: true },
			}),
			db.workDay.findMany({
				where: { date: { gte: startOfMonth, lte: endOfMonth } },
				select: { id: true, date: true },
			}),
		])

		return workDays.map((workDay) => {
			const shift = shifts.find((shift) => shift.date === workDay.date)

			if (shift) {
				return { ...shift, workDayId: workDay.id }
			}

			return { date: workDay.date, workDayId: workDay.id, start: 0, end: 0 }
		})
	}),
})
