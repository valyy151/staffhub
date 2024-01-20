import type { Note } from "@/lib/types"
import Link from "next/link"

export default function DashboardNote({ note }: { note: Note }) {
  return (
    <div key={note.id} className="rounded-lg border bg-card py-2">
      <p className="border-b px-2 pb-1">
        <Link
          href={`/days/${note.workDayId}/notes`}
          className="underline-offset-4 hover:underline"
        >
          {new Date(note.date * 1000).toLocaleString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </Link>
      </p>
      <p className="px-2 py-2 text-justify text-sm">{note.content}</p>
    </div>
  )
}
