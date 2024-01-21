import { useState } from "react"

import { formatDay, formatTime, formatTotal } from "@/lib/utils"
import { api } from "@/trpc/react"

import EditShift from "@/app/_components/edit-shift"
import { TableCell } from "@/app/_components/ui/table"
import type { ShiftEmployee, ShiftRow } from "@/lib/types"

export default function ShiftRow({
  shift,
  employee,
}: {
  employee: ShiftEmployee
  shift: ShiftRow
}) {
  const [edit, setEdit] = useState(false)

  const { data: shiftModels } = api.shiftModel.get.useQuery()

  const renderShift = () => {
    if (shift.sickLeave) {
      return (
        <span className="py-3 pl-2 italic group-hover:text-gray-800 dark:group-hover:text-gray-300">
          Sick
        </span>
      )
    }
    if (shift.vacation) {
      return (
        <span className="py-3 pl-2 italic group-hover:text-gray-800 dark:group-hover:text-gray-300">
          Vacation
        </span>
      )
    }
    if (shift.start) {
      return (
        <span className="py-3 pl-2">
          {formatTime(shift?.start!)} - {formatTime(shift?.end!)}{" "}
          <span className="font-medium">
            [{formatTotal(shift?.start, shift?.end!)}]
          </span>
        </span>
      )
    }
    return (
      <span className="py-3 pl-2 italic group-hover:text-gray-800 dark:group-hover:text-gray-300"></span>
    )
  }

  return (
    <>
      <TableCell
        title="Click to edit shift"
        onClick={() => setEdit(!edit)}
        className={`min-w-[6rem] cursor-pointer text-right hover:bg-accent ${
          (formatDay(shift.date!, "short") === "Sat" &&
            "font-bold text-rose-500") ||
          (formatDay(shift.date!, "short") === "Sun" &&
            "font-bold text-rose-500")
        }`}
      >
        {renderShift()}
      </TableCell>
      {edit && (
        <EditShift
          shift={shift}
          setEdit={setEdit}
          employee={employee}
          shiftModels={shiftModels}
        />
      )}
    </>
  )
}
