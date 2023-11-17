import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { db } from '@/server/db'
import { getMonth } from '@/app/lib/utils'

export const staffRouter = createTRPCRouter({
	get: protectedProcedure
		.input(
			z.object({
				page: z.number().optional(),
				query: z.string().optional().default(''),
			})
		)
		.query(async ({ input, ctx }) => {
			return await db.employee.findMany({
				where: {
					userId: ctx.session.user.id,
					OR: [
						{
							name: {
								contains: input.query,
							},
						},
						{
							email: {
								contains: input.query,
							},
						},
					],
				},
				select: {
					id: true,
					name: true,
					email: true,
					address: true,
					phoneNumber: true,
				},
				skip: input.page ? (input.page - 1) * 10 : 0,
				take: 10,
				orderBy: {
					name: 'asc',
				},
			})
		}),

	getDropdown: protectedProcedure.query(async ({ ctx }) => {
		return await db.employee.findMany({
			where: {
				userId: ctx.session.user.id,
			},
			select: {
				id: true,
				name: true,
				schedulePreference: { select: { hoursPerMonth: true, shiftModels: { select: { id: true, start: true, end: true } } } },
				roles: { select: { id: true, name: true } },
				vacations: { orderBy: { start: 'desc' }, select: { id: true, start: true, end: true } },
				sickLeaves: { orderBy: { start: 'desc' }, select: { id: true, start: true, end: true } },
			},
			orderBy: {
				name: 'asc',
			},
		})
	}),

	getNumberOfStaff: protectedProcedure.query(async ({ ctx }) => {
		return await db.employee.count({
			where: {
				userId: ctx.session.user.id,
			},
		})
	}),

	createOrUpdate: protectedProcedure
		.input(
			z.object({
				id: z.string().optional(),
				address: z.string().optional().default(''),
				phone: z.string().optional().default(''),
				email: z.string().email('Invalid email address'),
				lastName: z.string().min(2, 'Last name must be at least 2 characters'),
				firstName: z.string().min(2, 'First name must be at least 2 characters'),
			})
		)
		.mutation(async ({ input: { id, firstName, lastName, email, address, phone }, ctx }) => {
			if (id) {
				return await db.employee.update({
					where: { id, userId: ctx.session.user.id },
					data: {
						email,
						address: address,
						phoneNumber: phone,
						name: `${firstName} ${lastName}`,
					},
				})
			}

			return await db.employee.create({
				data: {
					email,
					address: address,
					phoneNumber: phone,
					userId: ctx.session.user.id,
					name: `${firstName} ${lastName}`,
				},
			})
		}),

	getId: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input: { id }, ctx }) => {
		const [startOfMonth, endOfMonth] = getMonth(new Date())

		return await db.employee.findUnique({
			where: { id, userId: ctx.session.user.id },
			select: {
				id: true,
				name: true,
				email: true,
				address: true,
				phoneNumber: true,
				notes: {
					take: 3,
					orderBy: { createdAt: 'desc' },
					select: { id: true, content: true, createdAt: true },
				},
				vacations: { orderBy: { start: 'desc' }, select: { id: true, start: true, end: true } },
				sickLeaves: { orderBy: { start: 'desc' }, select: { id: true, start: true, end: true } },
				shifts: {
					orderBy: { start: 'desc' },
					select: { start: true, end: true },
					where: { start: { gte: startOfMonth, lte: endOfMonth } },
				},
			},
		})
	}),

	getNotes: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input: { id }, ctx }) => {
		return await db.employee.findUnique({
			where: { id, userId: ctx.session.user.id },
			select: {
				id: true,
				name: true,
				notes: {
					orderBy: { createdAt: 'desc' },
					select: { id: true, content: true, createdAt: true },
				},
			},
		})
	}),

	getRoles: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input: { id }, ctx }) => {
		return await db.employee.findUnique({
			where: { id, userId: ctx.session.user.id },
			select: {
				id: true,
				name: true,
				roles: { select: { id: true, name: true }, orderBy: { name: 'asc' } },
			},
		})
	}),

	getSickLeaves: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input: { id }, ctx }) => {
		return await db.employee.findUnique({
			where: { id, userId: ctx.session.user.id },
			select: {
				id: true,
				name: true,
				sickLeaves: { orderBy: { start: 'desc' }, select: { id: true, start: true, end: true } },
			},
		})
	}),

	getVacations: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input: { id }, ctx }) => {
		return await db.employee.findUnique({
			where: { id, userId: ctx.session.user.id },
			select: {
				id: true,
				name: true,
				vacations: { orderBy: { start: 'desc' }, select: { id: true, start: true, end: true } },
			},
		})
	}),

	getSchedule: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input: { id }, ctx }) => {
		const [startOfMonth, endOfMonth] = getMonth(new Date())

		const [employee, workDays, vacations, sickLeaves] = await Promise.all([
			db.employee.findUnique({
				where: { id, userId: ctx.session.user.id },
				select: {
					id: true,
					name: true,
					shifts: {
						orderBy: { start: 'desc' },
						select: { id: true, date: true, start: true, end: true, role: { select: { id: true, name: true } } },
						where: { start: { gte: startOfMonth, lte: endOfMonth } },
					},
					roles: { select: { id: true, name: true } },
				},
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

		const newShifts = workDays.map((workDay) => {
			const shift = employee?.shifts.find((shift) => shift.date === workDay.date)

			if (shift) {
				return { ...shift, workDayId: workDay.id }
			}

			return { date: workDay.date, workDayId: workDay.id, start: 0, end: 0 }
		})

		const schedule = newShifts.map((shift) => {
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

		return {
			...employee,
			shifts: schedule,
		}
	}),

	getPreference: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input: { id }, ctx }) => {
		return await db.employee.findUnique({
			where: { id, userId: ctx.session.user.id },
			select: {
				id: true,
				name: true,
				schedulePreference: { select: { id: true, hoursPerMonth: true, createdAt: true, shiftModels: { select: { id: true, start: true, end: true } } } },
			},
		})
	}),

	editPreference: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				hoursPerMonth: z.number(),
				shiftModelIds: z.array(z.string()),
			})
		)
		.mutation(async ({ input: { id, hoursPerMonth, shiftModelIds }, ctx }) => {
			return await db.employee.update({
				where: { id, userId: ctx.session.user.id },
				data: {
					schedulePreference: {
						update: {
							hoursPerMonth,
							shiftModels: {
								set: shiftModelIds.map((id) => ({ id })),
							},
						},
					},
				},
			})
		}),

	delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ input: { id }, ctx }) => {
		return await db.employee.delete({ where: { id, userId: ctx.session.user.id } })
	}),
})
