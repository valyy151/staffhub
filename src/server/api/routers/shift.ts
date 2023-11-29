import { z } from 'zod'

import { getMonth } from '@/app/lib/utils'
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { db } from '@/server/db'

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

	updateAbsences: protectedProcedure
		.input(
			z.array(
				z.object({
					id: z.string(),
					approved: z.boolean(),
				})
			)
		)
		.mutation(async ({ input }) => {
			input.map(async (absence) => {
				await Promise.all([
					db.absence.update({
						where: { shiftId: absence.id },
						data: { approved: absence.approved },
					}),
				])
			})
		}),

	createMany: protectedProcedure
		.input(
			z.object({
				employeeId: z.string(),
				schedule: z.array(
					z.object({
						date: z.number(),
						end: z.string(),
						start: z.string(),
					})
				),
			})
		)
		.mutation(async ({ input: { schedule, employeeId }, ctx }) => {
			return await db.shift.createMany({
				data: schedule.map((shift) => {
					const date = new Date(shift.date * 1000)
					date.setHours(0, 0, 0, 0)

					const midnightUnixCode = Math.floor(date.getTime() / 1000)

					const startDate = new Date(shift.date * 1000)
					const endDate = new Date(shift.date * 1000)

					const [startHour, startMinute] = shift.start.split(':')
					const [endHour, endMinute] = shift.end.split(':')

					startDate.setHours(Number(startHour))
					startDate.setMinutes(Number(startMinute))

					endDate.setHours(Number(endHour))
					endDate.setMinutes(Number(endMinute))

					return {
						employeeId,
						date: midnightUnixCode,
						userId: ctx.session.user.id,
						end: Math.floor(endDate.getTime() / 1000),
						start: Math.floor(startDate.getTime() / 1000),
					}
				}),
			})
		}),

	createOrUpdateAbsence: protectedProcedure
		.input(
			z.object({
				reason: z.string(),
				absent: z.boolean(),
				shiftId: z.string(),
				approved: z.boolean(),
			})
		)
		.mutation(async ({ input: { reason, approved, absent, shiftId }, ctx }) => {
			const absence = await db.absence.findUnique({
				where: { shiftId: shiftId, userId: ctx.session.user.id },
			})

			if (!absence) {
				return await db.absence.create({
					data: {
						absent,
						reason,
						shiftId,
						userId: ctx.session.user.id,
					},
				})
			}
			return await db.shift.update({
				where: { id: shiftId, userId: ctx.session.user.id },
				data: {
					absence: {
						update: {
							absent,
							reason,
							approved,
						},
					},
				},
			})
		}),
})
