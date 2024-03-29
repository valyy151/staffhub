import { z } from "zod"

import { db } from "@/server/db"

import { createTRPCRouter, protectedProcedure } from "../trpc"

export const dashboardRouter = createTRPCRouter({
  find: protectedProcedure
    .input(
      z.object({
        month: z.date(),
        page: z.number(),
      }),
    )
    .query(async ({ input: { page, month }, ctx }) => {
      const startOfWeek = new Date(
        month.getFullYear(),
        month.getMonth(),
        month.getDate() - month.getDay() + page * 7 + 1,
      )

      const workDaysPromise = db.workDay.findMany({
        where: {
          date: { gte: startOfWeek.getTime() / 1000 },
        },
        take: 7,
        orderBy: { date: "asc" },
      })

      const notesPromise = workDaysPromise.then((workDays) => {
        const workDaysIds = workDays.map((workDay) => workDay.id)
        return db.workDayNote.findMany({
          where: {
            userId: ctx.session.user.id,
            workDayId: { in: workDaysIds },
          },
        })
      })

      const shiftsPromise = db.shift.findMany({
        where: {
          userId: ctx.session.user.id,
          date: { gte: startOfWeek.getTime() / 1000 },
        },
        select: {
          employee: {
            select: {
              id: true,
              name: true,
              sickLeaves: true,
            },
          },
          date: true,
          id: true,
          start: true,
          end: true,
          absence: true,
        },
        orderBy: { date: "asc" },
      })

      const [notes, shifts, workDays] = await Promise.all([
        notesPromise,
        shiftsPromise,
        workDaysPromise,
      ])

      return workDays.map((workDay) => {
        const dayNotes = notes.filter((note) => note.workDayId === workDay.id)
        const dayShifts = shifts.filter((shift) => shift.date === workDay.date)
        return { ...workDay, shifts: dayShifts, notes: dayNotes }
      })
    }),

  findFirstAndLastDay: protectedProcedure.query(async () => {
    const firstDay = await db.workDay.findFirst({
      select: { date: true },
      orderBy: { date: "asc" },
    })

    const lastDay = await db.workDay.findFirst({
      select: { date: true },
      orderBy: { date: "desc" },
    })

    return [firstDay, lastDay]
  }),
})
