import { api } from "@/trpc/server"
import StaffRole from "./_components/staff-role"
import Heading from "@/app/_components/ui/heading"
import CreateRole from "./_components/create-role"

export const metadata = {
  title: "Settings | StaffHub",
  description: "Manage your account settings.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default async function RolesSettings() {
  const roles = await api.role.get.query()
  return (
    <section className="p-4">
      <Heading size={"xs"} className="mb-2">
        Add and manage Staff Roles
      </Heading>
      <CreateRole />
      <Heading size={"xxs"} className="mb-2 mt-8">
        My Staff Roles
      </Heading>
      {roles.length > 0 && (
        <div className="flex max-w-4xl flex-wrap gap-4">
          {roles.map((role) => (
            <StaffRole role={role} key={role.id} />
          ))}
        </div>
      )}
    </section>
  )
}
