import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { db } from '@/server/db'

export const staffRouter = createTRPCRouter({
	getStaffMembers: protectedProcedure
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

	getNumberOfStaff: protectedProcedure.query(async ({ ctx }) => {
		return await db.employee.count({
			where: {
				userId: ctx.session.user.id,
			},
		})
	}),

	create: protectedProcedure
		.input(
			z.object({
				address: z.string().optional().default(''),
				phoneNumber: z.string().optional().default(''),
				email: z.string().email('Invalid email address'),
				lastName: z.string().min(2, 'Last name must be at least 2 characters'),
				firstName: z.string().min(2, 'First name must be at least 2 characters'),
			})
		)
		.mutation(async ({ input: { firstName, lastName, email, address, phoneNumber }, ctx }) => {
			await ctx.db.employee.create({
				data: {
					email,
					address: address,
					phoneNumber: phoneNumber,
					userId: ctx.session.user.id,
					name: `${firstName} ${lastName}`,
				},
			})
		}),

	getStaffMember: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input: { id }, ctx }) => {
		return await ctx.db.employee.findUnique({
			where: { id, userId: ctx.session.user.id },
			select: {
				id: true,
				name: true,
				email: true,
				address: true,
				phoneNumber: true,
			},
		})
	}),
})
