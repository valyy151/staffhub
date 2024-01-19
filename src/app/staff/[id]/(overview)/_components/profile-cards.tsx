import type { Absence, Shift } from "@/lib/types"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card"
import {
  calculateStaffHours,
  checkAbsence,
  getNumberOfSickDays,
} from "@/lib/utils"

import type { StaffIdOutput } from "@/trpc/shared"
import PersonalInfoCard from "./personal-info-card"

export default function ProfileCards({
  employee,
}: {
  employee: StaffIdOutput
}) {
  const hours = calculateStaffHours(employee?.shifts as Shift[])
  const currentMonth = new Date().toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  })

  const sickDays = getNumberOfSickDays(employee?.sickLeaves as Absence[])
  const absence = checkAbsence(
    employee?.sickLeaves as Absence[],
    employee?.vacations as Absence[],
  )

  return (
    <>
      <section className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <PersonalInfoCard employee={employee} />

        <Card>
          <CardHeader>
            <CardTitle>Absence Status</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>{absence}</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="flex flex-col space-y-1">
              {employee?.notes.length! > 0 ? (
                employee?.notes.map((note) => (
                  <span
                    key={note.id}
                    className="flex items-center justify-between"
                  >
                    <span className="max-w-xs truncate">{note.content}</span>
                    <span className="ml-2 text-xs">
                      {note.createdAt.toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })}
                    </span>
                  </span>
                ))
              ) : (
                <span> No notes</span>
              )}
            </CardDescription>
          </CardContent>
        </Card>
      </section>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Statistics for {currentMonth}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="flex flex-col space-y-1">
            <span>Sick Days: {sickDays}</span>
            <span>Total Work Hours: {hours}</span>
          </CardDescription>
        </CardContent>
      </Card>
    </>
  )
}
