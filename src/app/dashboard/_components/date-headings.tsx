import Heading from "@/app/_components/ui/heading"
import type { DashboardOutput } from "@/trpc/shared"

export default function DateHeadings({
  workDays,
}: {
  workDays: DashboardOutput[]
}) {
  if (!workDays) {
    return null
  }

  return (
    <Heading size={"sm"} className="ml-2">
      {workDays[0] &&
        new Date(workDays[0].date * 1000).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}{" "}
      -{" "}
      {workDays[6] &&
        new Date(workDays[6].date * 1000).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
    </Heading>
  )
}
