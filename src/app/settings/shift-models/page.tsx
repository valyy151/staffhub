import CreateModel from "@/app/settings/shift-models/_components/create-model"
import ShiftModel from "@/app/settings/shift-models/_components/shift-model"
import Heading from "@/app/_components/ui/heading"
import Paragraph from "@/app/_components/ui/paragraph"
import { api } from "@/trpc/server"

export const metadata = {
  title: "Settings | StaffHub",
  description: "Manage your account settings.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default async function ShiftModelsSettings() {
  const shiftModels = await api.shiftModel.get.query()
  return (
    <section className="p-4">
      <Heading size={"xs"} className="mb-2">
        Add and manage Shift Models
      </Heading>
      <CreateModel />
      <Heading size={"xxs"} className="mb-2 mt-8">
        My Shift Models
      </Heading>
      {shiftModels.length > 0 ? (
        <div className="flex max-w-4xl flex-wrap gap-4">
          {shiftModels.map((shiftModel) => (
            <ShiftModel key={shiftModel.id} shiftModel={shiftModel} />
          ))}
        </div>
      ) : (
        <Paragraph className="mt-4">
          You don't have any shift models yet.
        </Paragraph>
      )}
    </section>
  )
}
