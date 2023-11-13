import { Shift } from '@/app/lib/types'
import { StaffScheduleOutput } from '@/trpc/shared'
import { TableCell } from '../ui/table'
import { useState } from 'react'
import { formatTime, formatTotal } from '@/app/lib/utils'

export default function ShiftRow({ shift, employee }: { shift: Shift; employee: StaffScheduleOutput }) {
	const [edit, setEdit] = useState(false)

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
					{formatTime(shift?.start! * 1000)} - {formatTime(shift?.end! * 1000)} <span className='font-medium'>[{formatTotal(shift?.start!, shift?.end!)}]</span>
				</span>
			)
		}
	}

	return (
		<>
			<TableCell
				title='Click to edit shift'
				onClick={() => setEdit(!edit)}
				className={`cursor-pointer text-right hover:bg-accent min-w-[6rem] ${
					(new Date(shift.date).toLocaleDateString('en-GB', {
						weekday: 'short',
					}) === 'Sat' &&
						'font-bold text-rose-500') ||
					(new Date(shift.date * 1000).toLocaleDateString('en-GB', {
						weekday: 'short',
					}) === 'Sun' &&
						'font-bold text-rose-500')
				}`}>
				{renderShift()}
			</TableCell>
			{/* {edit && (
				<EditShift
					date={day.date}
					shift={day.shift}
					setEdit={setEdit}
					employee={employee}
					shiftModels={day.shiftModels}
				/>
			)} */}
		</>
	)
}
