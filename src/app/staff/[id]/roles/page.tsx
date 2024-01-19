import Heading from "@/app/_components/ui/heading"
import { api } from "@/trpc/server"

import type { Metadata } from "next/types"
import EditRoles from "./_components/edit-roles"
import RolesTable from "./_components/roles-table"

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

export default async function StaffRoles({
  params,
}: {
  params: { id: string }
}) {
  const employee = await api.staff.getRoles.query({ id: params.id })
  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading size={"xs"}>Roles for {employee?.name}</Heading>
        <EditRoles employee={employee} />
      </div>

      {employee?.roles?.length! > 0 ? (
        <RolesTable roles={employee?.roles} />
      ) : (
        <p className="mr-auto mt-8">There are no roles for {employee?.name}.</p>
      )}
    </div>
  )
}
