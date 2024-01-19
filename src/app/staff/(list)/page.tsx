import { UserPlus } from "lucide-react"
import Link from "next/link"

import Heading from "@/app/_components/ui/heading"
import Pagination from "@/app/_components/ui/pagination"
import { api } from "@/trpc/server"

import { StaffTable } from "./_components/staff-table"
import SearchComponent from "./_components/search"

export const metadata = {
  title: "Your Staff | StaffHub",
  description: "Manage your staff and their shifts.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default async function Staff({
  searchParams,
}: {
  searchParams?: { query?: string; page?: string }
}) {
  const query = searchParams?.query || ""
  const currentPage = Number(searchParams?.page) || 1

  const staff = await api.staff.get.query({
    query,
    page: currentPage,
  })

  const numberOfStaff = await api.staff.getNumberOfStaff.query()

  const totalPages = Math.ceil(numberOfStaff / 10)

  return (
    <>
      {numberOfStaff > 0 ? (
        <main className="px-1 pb-4 md:px-36 md:py-8">
          <div className="flex w-full flex-col justify-between pb-2 pt-8 md:flex-row">
            <div className="flex items-baseline space-x-4">
              <Heading size={"sm"}>Your Staff</Heading>

              <Heading size={"xs"}>
                has {numberOfStaff} {numberOfStaff > 1 ? "members" : "member"}
              </Heading>
            </div>
            <div className="flex items-center space-x-2">
              <SearchComponent />
              <Link
                href={"/staff/create"}
                className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                <UserPlus className="mr-2" /> New Employee
              </Link>
            </div>
          </div>

          <StaffTable staff={staff} />
          <Pagination totalPages={totalPages} />
        </main>
      ) : (
        <main className="flex flex-col items-center py-4">
          <Heading size={"sm"}>
            It seems like you don't have any staff members yet.
          </Heading>
          <Link
            href={"/staff/create"}
            className="mt-2 rounded-md bg-primary px-4 py-2 text-secondary"
          >
            Add one
          </Link>
        </main>
      )}
    </>
  )
}
