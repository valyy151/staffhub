import { z } from "zod"

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { db } from "@/server/db"

export const sickLeaveRouter = createTRPCRouter({
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await db.sickLeave.delete({
        where: { id: input.id, userId: ctx.session.user.id },
      })
    }),

  create: protectedProcedure
    .input(
      z.object({
        end: z.number(),
        start: z.number(),
        employeeId: z.string(),
      }),
    )
    .mutation(async ({ input: { start, end, employeeId }, ctx }) => {
      const shifts = await db.shift.findMany({
        where: {
          date: {
            lte: end / 1000,
            gte: start / 1000,
          },
          employeeId,
          userId: ctx.session.user.id,
        },
      })

      const shiftIds = shifts.map((shift) => shift.id)

      await db.absence.createMany({
        data: shiftIds.map((shiftId) => ({
          shiftId,
          reason: "Sick Leave",
          userId: ctx.session.user.id,
        })),
      })

      return await db.sickLeave.create({
        data: {
          end,
          start,
          employeeId,
          userId: ctx.session.user.id,
        },
      })
    }),
})
