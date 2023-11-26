import { useState } from 'react'

import { Shift } from '@/app/lib/types'
import { formatDay, formatTime, formatTotal } from '@/app/lib/utils'
import { api } from '@/trpc/react'
import { StaffScheduleOutput } from '@/trpc/shared'

import EditShift from '../ui/edit-shift'
import { TableCell } from '../ui/table'

export default function ShiftRow({ shift, employee, setValue }: { employee: StaffScheduleOutput | any; shift: Shift | any; setValue: ({ date, refetch }: { date: Date; refetch: boolean }) => void }) {
	const [edit, setEdit] = useState(false)

	const { data: shiftModels } = api.shiftModel.get.useQuery()

	const renderShift = () => {
		if (shift.sickLeave) {
			return <span className='py-3 pl-2 italic group-hover:text-gray-800 dark:group-hover:text-gray-300'>Sick</span>
		}
		if (shift.vacation) {
			return <span className='py-3 pl-2 italic group-hover:text-gray-800 dark:group-hover:text-gray-300'>Vacation</span>
		}
		if (shift.start) {
			return (
				<span className='py-3 pl-2'>
					{formatTime(shift?.start!)} - {formatTime(shift?.end!)} <span className='font-medium'>[{formatTotal(shift?.start, shift?.end!)}]</span>
				</span>
			)
		}
	}

	return (
		<>
			<TableCell
				title='Click to edit shift'
				onClick={() => setEdit(!edit)}
				className={`cursor-pointer text-right hover:bg-accent min-w-[6rem] ${(formatDay(shift.date!, 'short') === 'Sat' && 'font-bold text-rose-500') || (formatDay(shift.date!, 'short') === 'Sun' && 'font-bold text-rose-500')}`}>
				{renderShift()}
			</TableCell>
			{edit && (
				<EditShift
					shift={shift}
					setEdit={setEdit}
					setValue={setValue}
					employee={employee}
					shiftModels={shiftModels}
				/>
			)}
		</>
	)
}
