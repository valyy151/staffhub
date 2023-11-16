import { db } from '@/server/db'
import { protectedProcedure, createTRPCRouter } from './../trpc'
import { z } from 'zod'

export const workDayRouter = createTRPCRouter({
	yearExists: protectedProcedure.input(z.object({ date: z.number() })).query(async ({ input: { date } }) => {
		const exists = await db.workDay.findUnique({
			where: { date },
		})

		if (!exists) {
			return false
		}

		return true
	}),

	createMany: protectedProcedure.input(z.array(z.object({ date: z.number() }))).mutation(async ({ input: yearArray }) => {
		return await db.workDay.createMany({
			data: yearArray.map((day) => {
				const modifiedDate = new Date(day.date * 1000)

				modifiedDate.setHours(0, 0, 0, 0)

				const midnightUnixCode = Math.floor(modifiedDate.getTime() / 1000)
				return {
					date: midnightUnixCode,
				}
			}),
		})
	}),

	find: protectedProcedure.query(async () => {
		return await db.workDay.findMany()
	}),

	findOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input: { id }, ctx }) => {
		const hasEmployees = await db.employee.findFirst({
			where: { userId: ctx.session.user.id },
		})

		const workDayPromise = db.workDay.findUnique({
			where: { id },
		})

		const shiftsPromise = workDayPromise.then((workDay) => {
			return db.shift.findMany({
				where: { date: workDay?.date, userId: ctx.session.user.id },
				include: {
					employee: {
						select: {
							id: true,
							name: true,
							roles: {
								select: { id: true, name: true },
							},
							schedulePreference: {
								select: {
									shiftModels: { select: { start: true, end: true } },
								},
							},
						},
					},
					role: {
						select: { id: true, name: true },
					},
					absence: true,
				},
			})
		})

		const notesPromise = db.workDayNote.findMany({
			where: { workDayId: id, userId: ctx.session.user.id },
			select: { id: true, content: true, createdAt: true },
			orderBy: { createdAt: 'desc' },
		})

		const rolesPromise = db.staffRole.findMany({
			where: { userId: ctx.session.user.id },
			select: { id: true, name: true, numberPerDay: true },
		})

		const shiftModelsPromise = db.shiftModel.findMany({
			where: { userId: ctx.session.user.id },
			select: {
				id: true,
				end: true,
				start: true,
			},
		})

		const [notes, roles, shifts, workDay, shiftModels] = await Promise.all([notesPromise, rolesPromise, shiftsPromise, workDayPromise, shiftModelsPromise])

		return { ...workDay, roles, notes, shifts, shiftModels, hasEmployees }
	}),
})
