import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";

export const staffRouter = createTRPCRouter({
  getStaffMembers: protectedProcedure
    .input(
      z.object({
        page: z.number().optional(),
        query: z.string().optional().default(""),
      }),
    )
    .query(({ input, ctx }) => {
      return db.employee.findMany({
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
        skip: input.page ? (input.page - 1) * 10 : 0,
        take: 10,
        orderBy: {
          name: "asc",
        },
      });
    }),

  getNumberOfStaff: protectedProcedure.query(({ ctx }) => {
    return db.employee.count({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
});
