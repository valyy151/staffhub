import { z } from "zod"

import { db } from "@/server/db"

import { createTRPCRouter, protectedProcedure } from "../trpc"

export const workDayRouter = createTRPCRouter({
  yearExists: protectedProcedure
    .input(z.object({ date: z.number() }))
    .query(async ({ input: { date } }) => {
      const exists = await db.workDay.findUnique({
        where: { date },
      })

      if (!exists) {
        return false
      }

      return true
    }),

  createMany: protectedProcedure
    .input(z.array(z.object({ date: z.number() })))
    .mutation(async ({ input: yearArray }) => {
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

  get: protectedProcedure.query(async () => {
    return await db.workDay.findMany()
  }),

  getShifts: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id }, ctx }) => {
      const workDay = await db.workDay.findUnique({
        where: { id },
        select: { id: true, date: true },
      })

      if (!workDay) {
        throw new Error("Workday not found")
      }

      const shifts = await db.shift.findMany({
        where: { date: workDay?.date, userId: ctx.session.user.id },
        select: {
          id: true,
          end: true,
          date: true,
          start: true,
          role: { select: { id: true, name: true } },
          absence: {
            select: { id: true, absent: true, approved: true, reason: true },
          },
          employee: {
            select: {
              id: true,
              name: true,
              roles: { select: { id: true, name: true } },
            },
          },
        },
        orderBy: { start: "asc" },
      })

      return { ...workDay, shifts }
    }),

  getNotes: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id }, ctx }) => {
      const workDay = await db.workDay.findUnique({
        where: { id },
        select: { id: true, date: true },
      })

      if (!workDay) {
        throw new Error("Workday not found")
      }

      const notes = await db.workDayNote.findMany({
        where: { workDayId: workDay.id, userId: ctx.session.user.id },
        select: { id: true, content: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      })

      return { ...workDay, notes }
    }),

  getDate: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id } }) => {
      const workDay = await db.workDay.findUnique({
        where: { id },
        select: { date: true },
      })

      return {
        date: new Date(workDay?.date! * 1000).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      }
    }),
})
