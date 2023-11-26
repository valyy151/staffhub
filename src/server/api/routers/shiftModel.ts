import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";

export const shiftModelRouter = createTRPCRouter({
	get: protectedProcedure.query(async ({ ctx }) => {
		return await db.shiftModel.findMany({
			where: {
				userId: ctx.session.user.id,
			},
			select: {
				id: true,
				end: true,
				start: true,
			},
			orderBy: { start: 'asc' },
		})
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
