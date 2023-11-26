import { z } from "zod";

import { db } from "@/server/db";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const workDayNoteRouter = createTRPCRouter({
	delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ input: { id }, ctx }) => {
		return await db.workDayNote.delete({
			where: { id, userId: ctx.session.user.id },
		})
	}),

	create: protectedProcedure.input(z.object({ content: z.string(), id: z.string() })).mutation(async ({ input: { content, id }, ctx }) => {
		return await db.workDayNote.create({
			data: {
				workDayId: id,
				content: content,
				userId: ctx.session.user.id,
			},
		})
	}),
})
