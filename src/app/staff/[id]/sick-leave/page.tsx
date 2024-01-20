import { HeartPulseIcon } from "lucide-react"

import Heading from "@/app/_components/ui/heading"
import { checkAbsences } from "@/lib/utils"
import { api } from "@/trpc/server"

import type { Absence as AbsenceType } from "@/lib/types"
import type { Metadata } from "next/types"
import CreateAbsence from "@/app/_components/create-absence"
import CurrentAbsence from "@/app/_components/current-absence"
import Absence from "@/app/_components/absence"

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const id = params.id
  const employee = await api.staff.getName.query({ id })

  return {
    title: employee?.name,
    description: `Profile for ${employee?.name}`,
    icons: [{ rel: "icon", url: "/favicon.ico" }],
  }
}

export default async function StaffSickLeave({
  params,
}: {
  params: { id: string }
}) {
  const employee = await api.staff.getSickLeaves.query({ id: params.id })
  const [pastSickLeaves, currentSickLeave] = checkAbsences(
    employee?.sickLeaves as AbsenceType[],
  )
  return (
    <>
      <div className="flex flex-col items-baseline justify-between md:flex-row md:items-center">
        <Heading size={"xs"}>Sick Leaves for {employee?.name}</Heading>
        <CreateAbsence type="sick" employee={employee} />
      </div>
      {currentSickLeave ? (
        <CurrentAbsence type="sick" absence={currentSickLeave} />
      ) : (
        <div className="mt-4 rounded-md border bg-green-500 p-2 text-white md:min-w-[46rem]">
          <Heading size={"xxs"} className="flex items-center">
            <HeartPulseIcon size={32} className="ml-1 mr-2 text-white" />
            Currently not on sick leave
          </Heading>
        </div>
      )}

      {pastSickLeaves && pastSickLeaves.length > 0 ? (
        <>
          <Heading
            size={"xxs"}
            className="mb-3 mt-6 flex items-center md:mt-12"
          >
            <HeartPulseIcon size={32} className="ml-1 mr-2 text-gray-400" />
            Previous Sick Leaves
          </Heading>

          {pastSickLeaves?.map((sickLeave) => (
            <Absence type="sick" key={sickLeave.id} absence={sickLeave} />
          ))}
        </>
      ) : (
        <>
          <Heading
            size={"xxs"}
            className="mb-3 mt-6 flex items-center md:mt-12"
          >
            <HeartPulseIcon size={32} className="ml-1 mr-2 text-gray-400" />
            Past Sick Leaves
          </Heading>
          <p className="ml-8 mt-4 text-sm md:ml-14">No past sick leaves</p>
        </>
      )}
    </>
  )
}
