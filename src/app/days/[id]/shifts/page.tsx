import { formatDate, formatDay } from '@/app/lib/utils'

import { api } from '@/trpc/server'
import ShiftsTable from '@/app/_components/workDay/shifts-table'
import CreateShift from '@/app/_components/workDay/create-shift'

export default async function WorkDayShifts({ params }: { params: { id: string } }) {
	const workDay = await api.workDay.getShifts.query({ id: params.id })
	return (
		<>
			<h1 className='pb-1 pl-4 text-xl font-semibold'>
				{formatDay(workDay.date, 'long')}, {formatDate(workDay.date, 'long')}
			</h1>
			<div className='mb-4 px-4 flex items-center justify-between'>
				{workDay.shifts.length > 0 ? <h2 className='text-lg font-medium'>Shifts</h2> : <h2 className='text-lg font-medium'>No shifts</h2>}
				<CreateShift date={workDay.date} />
			</div>

			{workDay.shifts.length > 0 && <ShiftsTable shifts={workDay.shifts} />}
		</>
	)
}
