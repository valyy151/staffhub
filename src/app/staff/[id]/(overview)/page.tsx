import { api } from "@/trpc/server"

import type { Metadata } from "next/types"
import ProfileCards from "./_components/profile-cards"
import DeleteStaff from "./_components/delete-staff"
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

export default async function StaffProfile({
  params,
}: {
  params: { id: string }
}) {
  const employee = await api.staff.getId.query({ id: params.id })

  return (
    <div>
      <h1 className="px-1 text-3xl font-bold">{employee?.name}</h1>
      <ProfileCards employee={employee} />
      <DeleteStaff id={params.id} />
    </div>
  )
}
