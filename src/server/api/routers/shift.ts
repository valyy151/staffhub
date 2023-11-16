import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { db } from '@/server/db'
import { getMonth } from '@/app/lib/utils'

export const shiftRouter = createTRPCRouter({
	create: protectedProcedure
		.input(
			z.object({
				end: z.number(),
				date: z.number(),
				start: z.number(),
				employeeId: z.string(),
				roleId: z.string().optional(),
			})
		)
		.mutation(async ({ input: { end, date, roleId, start, employeeId }, ctx }) => {
			const modifiedDate = new Date(date * 1000)

			modifiedDate.setHours(0, 0, 0, 0)
			const midnightUnixCode = Math.floor(modifiedDate.getTime() / 1000)

			return await db.shift.create({
				data: {
					end,
					start,
					employeeId,
					roleId: roleId || '',
					date: midnightUnixCode,
					userId: ctx.session.user.id,
				},
			})
		}),

	update: protectedProcedure
		.input(
			z.object({
				shiftId: z.string(),
				shift: z.object({
					end: z.number(),
					start: z.number(),
					roleId: z.string().optional(),
				}),
			})
		)
		.mutation(async ({ input: { shift, shiftId }, ctx }) => {
			return await db.shift.update({
				where: { id: shiftId, userId: ctx.session.user.id },
				data: { ...shift },
			})
		}),

	delete: protectedProcedure
		.input(
			z.object({
				shiftId: z.string(),
			})
		)
		.mutation(async ({ input: { shiftId }, ctx }) => {
			return await db.shift.delete({
				where: { id: shiftId, userId: ctx.session.user.id },
			})
		}),

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