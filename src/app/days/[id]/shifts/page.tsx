import type { ShiftRow } from "@/lib/types"
import { formatDate, formatDay } from "@/lib/utils"
import { api } from "@/trpc/server"
import type { WorkDayOutput } from "@/trpc/shared"

import type { Metadata } from "next/types"
import CreateShift from "../_components/create-shift"
import ShiftsTable from "../_components/shifts-table"
export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const id = params.id
  const data = await api.workDay.getDate.query({ id })

  return {
    title: `Shifts | ${data?.date}`,

    description: `Shifts for ${data?.date}`,
  }
}

export default async function WorkDayShifts({
  params,
}: {
  params: { id: string }
}) {
  const workDay: WorkDayOutput = await api.workDay.getShifts.query({
    id: params.id,
  })

  return (
    <main className="px-4">
      <h1 className="pb-1 text-xl font-semibold">
        {formatDay(workDay.date, "long")}, {formatDate(workDay.date, "long")}
      </h1>
      <div className="mb-4 flex items-end justify-between">
        {workDay.shifts.length > 0 ? (
          <h2 className="text-lg font-medium">Shifts</h2>
        ) : (
          <h2 className="text-lg font-medium">No Shifts</h2>
        )}
        <CreateShift date={workDay.date} />
      </div>

      {workDay.shifts.length > 0 && (
        <ShiftsTable shifts={workDay.shifts as ShiftRow[]} />
      )}
    </main>
  )
}
