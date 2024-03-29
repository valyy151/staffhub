import { Check, ChevronsUpDown } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import * as React from "react"

import { Button } from "@/app/_components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/app/_components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover"
import { cn } from "@/lib/utils"
import type { StaffDropdownOutput } from "@/trpc/shared"

type Props = {
  links?: boolean
  name?: string
  staff?: StaffDropdownOutput[]
  employee?: StaffDropdownOutput
  setEmployee?: (employee: StaffDropdownOutput) => void
}

export default function SelectStaff({
  links,
  name,
  employee,
  staff,
  setEmployee,
}: Props) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(employee?.name)

  const router = useRouter()

  const params = useParams()

  const employeeId = params?.employeeId

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          {employee?.name || name
            ? employee?.name || name
            : "Select an employee..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="h-96 w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search staff..." />
          <CommandEmpty>No staff found.</CommandEmpty>
          <CommandGroup className="overflow-y-scroll ">
            {staff
              ?.sort((a, b) => a.name.localeCompare(b.name))
              .map((employee) => (
                <CommandItem
                  key={employee?.id}
                  onSelect={(value) => {
                    setValue(value)
                    setEmployee && setEmployee(employee)
                    links && router.push(`/staff/${employee?.id}`)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === employee.name.toLowerCase() ||
                        employeeId === employee.id
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {employee?.name}
                </CommandItem>
              ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
