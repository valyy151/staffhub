import NewSickLeave from '@/app/_components/staff/new-sick-leave'
import SickLeave from '@/app/_components/staff/sick-leave'
import Heading from '@/app/_components/ui/heading'
import type { Absence } from '@/app/lib/types'
import { checkSickLeaves, howManyDays } from '@/app/lib/utils'
import { api } from '@/trpc/server'
import { HeartPulseIcon } from 'lucide-react'

export default async function StaffSickLeave({ params }: { params: { id: string } }) {
	const employee = await api.staff.getId.query({ id: params.id })
	const [pastSickLeaves, currentSickLeave] = checkSickLeaves(employee?.sickLeaves as Absence[])
	return (
		<>
			<NewSickLeave employee={employee} />
			{currentSickLeave ? (
				<>
					<Heading
						size={'xxs'}
						className='mb-3 mt-16 flex items-center'>
						<HeartPulseIcon
							size={42}
							className='ml-1 mr-2 text-rose-400'
						/>
						Currently on sick leave -
						<span className='ml-2'>
							Ends in: {howManyDays(currentSickLeave)} {howManyDays(currentSickLeave) === 1 ? 'day' : 'days'}
						</span>
					</Heading>
					<SickLeave sickLeave={currentSickLeave} />
				</>
			) : (
				<Heading
					size={'xxs'}
					className='mb-3 mt-16 flex items-center'>
					<HeartPulseIcon
						size={42}
						className='ml-1 mr-2 text-green-400'
					/>
					Currently not on sick leave
				</Heading>
			)}

			{pastSickLeaves && pastSickLeaves.length > 0 ? (
				<>
					<Heading
						size={'xxs'}
						className='mb-3 mt-12 flex items-center'>
						<HeartPulseIcon
							size={42}
							className='ml-1 mr-2 text-gray-400'
						/>
						Previous Sick Leaves
					</Heading>

					{pastSickLeaves?.map((sickLeave) => (
						<SickLeave
							key={sickLeave.id}
							sickLeave={sickLeave}
						/>
					))}
				</>
			) : (
				<>
					<Heading
						size={'xxs'}
						className='mb-3 mt-12 flex items-center'>
						<HeartPulseIcon
							size={42}
							className='ml-1 mr-2 text-gray-400'
						/>
						Past Sick Leaves
					</Heading>
					<p className='ml-14 mt-4'>No past sick leaves</p>
				</>
			)}
		</>
	)
}
