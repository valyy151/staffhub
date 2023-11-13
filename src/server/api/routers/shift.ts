import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { db } from '@/server/db'
import { getMonth } from '@/app/lib/utils'

export const shiftRouter = createTRPCRouter({
	schedule: protectedProcedure.input(z.object({ id: z.string(), month: z.date() })).query(async ({ input: { id, month }, ctx }) => {
		const [startOfMonth, endOfMonth] = getMonth(month)

		const [shifts, workDays, vacations, sickLeaves] = await Promise.all([
			db.shift.findMany({
				where: { date: { gte: startOfMonth, lte: endOfMonth }, employeeId: id, userId: ctx.session.user.id },
				select: { id: true, date: true, start: true, end: true },
			}),
			db.workDay.findMany({
				where: { date: { gte: startOfMonth, lte: endOfMonth } },
				select: { id: true, date: true },
			}),
			db.vacation.findMany({
				where: { employeeId: id, start: { gte: startOfMonth * 1000, lte: endOfMonth * 1000 }, userId: ctx.session.user.id },
				select: { id: true, start: true, end: true },
			}),
			db.sickLeave.findMany({
				where: { employeeId: id, start: { gte: startOfMonth * 1000, lte: endOfMonth * 1000 }, userId: ctx.session.user.id },
				select: { id: true, start: true, end: true },
			}),
		])

		const schedule = workDays.map((workDay) => {
			const shift = shifts.find((shift) => shift.date === workDay.date)

			if (shift) {
				return { ...shift, workDayId: workDay.id }
			}

			return { date: workDay.date, workDayId: workDay.id, start: 0, end: 0 }
		})

		return schedule.map((shift) => {
			const sickLeave = sickLeaves.find((sickLeave) => {
				return shift.date * 1000 >= sickLeave.start && shift.date * 1000 <= sickLeave.end
			})

			const vacation = vacations.find((vacation) => {
				return shift.date * 1000 >= vacation.start && shift.date * 1000 <= vacation.end
			})

			if (sickLeave) {
				return { ...shift, sickLeave: true }
			}

			if (vacation) {
				return { ...shift, vacation: true }
			}

			return { ...shift }
		})
	}),
})
