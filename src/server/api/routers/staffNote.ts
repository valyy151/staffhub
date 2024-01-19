import { z } from "zod"

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { db } from "@/server/db"

export const staffNoteRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        content: z.string(),
      }),
    )
    .mutation(async ({ input: { content, id }, ctx }) => {
      return await db.employeeNote.create({
        data: {
          employeeId: id,
          content: content,
          userId: ctx.session.user.id,
        },
      })
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input: { id }, ctx }) => {
      return await db.employeeNote.delete({
        where: { id, userId: ctx.session.user.id },
      })
    }),
})
