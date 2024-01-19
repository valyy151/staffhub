import Paragraph from "@/app/_components/ui/paragraph"
import type { Note } from "@/lib/types"
import Link from "next/link"

export default function DashboardNote({ note }: { note: Note }) {
  return (
    <div
      key={note.id}
      className="flex min-h-[6rem] w-full flex-col rounded-lg border bg-card py-1"
    >
      <Link
        href={`/days/${note.workDayId}/notes`}
        className="w-fit px-2 text-sm font-medium underline-offset-2 hover:underline"
      >
        {new Date(note.date * 1000).toLocaleString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </Link>

      <Paragraph size={"sm"} className="px-2 pb-2 text-justify font-light">
        {note.content}
      </Paragraph>
    </div>
  )
}
