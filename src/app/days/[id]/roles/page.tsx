import { api } from "@/trpc/server"

import type { Metadata } from "next/types"

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const id = params.id
  const data = await api.workDay.getDate.query({ id })

  return {
    title: `Roles | ${data?.date}`,

    description: `Roles for ${data?.date}`,
  }
}

export default async function WorkDayRoles() {
  return <></>
}
