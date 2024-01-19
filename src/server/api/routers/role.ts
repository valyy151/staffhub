import { z } from "zod"

import { db } from "@/server/db"

import { createTRPCRouter, protectedProcedure } from "../trpc"

export const roleRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string(), numberPerDay: z.number().optional() }))
    .mutation(async ({ input: { name, numberPerDay }, ctx }) => {
      return await db.staffRole.create({
        data: {
          name,
          numberPerDay,
          userId: ctx.session.user.id,
        },
      })
    }),

  get: protectedProcedure.query(async ({ ctx }) => {
    return await db.staffRole.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        name: "asc",
      },
    })
  }),

  update: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        staffRoleId: z.string(),
        numberPerDay: z.number().optional(),
      }),
    )
    .mutation(async ({ input: { staffRoleId, name, numberPerDay }, ctx }) => {
      return await db.staffRole.update({
        where: {
          id: staffRoleId,
          userId: ctx.session.user.id,
        },
        data: {
          name,
          numberPerDay,
        },
      })
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input: { id }, ctx }) => {
      return await db.staffRole.delete({
        where: { id, userId: ctx.session.user.id },
      })
    }),

  assignToEmployee: protectedProcedure
    .input(
      z.object({
        employeeId: z.string(),
        roleIds: z.array(z.string()),
      }),
    )
    .mutation(async ({ input: { employeeId, roleIds }, ctx }) => {
      return await db.employee.update({
        where: {
          id: employeeId,
          userId: ctx.session.user.id,
        },
        data: {
          roles: {
            set: roleIds.map((id) => ({ id })),
          },
        },
      })
    }),
})
