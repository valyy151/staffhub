import { UserPlus } from "lucide-react";
import Link from "next/link";
import Search from "@/app/_components/staff/search";
import Heading from "@/app/_components/ui/heading";
import Pagination from "@/app/_components/ui/pagination";
import { api } from "@/trpc/server";
import { StaffTable } from "../_components/staff/staff-table";

export default async function Staff({
  searchParams,
}: {
  searchParams?: { query?: string; page?: string };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  const staff = await api.staff.getStaffMembers.query({
    query,
    page: currentPage,
  });
  const numberOfStaff = await api.staff.getNumberOfStaff.query();

  const totalPages = Math.ceil(numberOfStaff / 10);

  return (
    <main className="p-4 pb-8">
      <div className="flex w-full justify-between pb-2 pt-8">
        <div className="flex items-baseline space-x-4">
          <Heading>Your Staff</Heading>

          <Heading size={"sm"}>
            has {numberOfStaff} {numberOfStaff > 1 ? "members" : "member"}
          </Heading>
        </div>
        <div className="flex items-center space-x-2">
          <Search />
          <Link
            href={"/staff/new"}
            className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            <UserPlus className="mr-2" /> New Employee
          </Link>
        </div>
      </div>

      <StaffTable staff={staff} />
      <Pagination totalPages={totalPages} />
    </main>
  );
}
