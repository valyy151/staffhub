import CreateSickLeave from '@/app/_components/staff/create-sick-leave'
import SickLeave from '@/app/_components/staff/sick-leave'
import Heading from '@/app/_components/ui/heading'
import type { Absence } from '@/app/lib/types'
import { checkSickLeaves } from '@/app/lib/utils'
import { api } from '@/trpc/server'
import { HeartPulseIcon } from 'lucide-react'
import CurrentSickLeave from '@/app/_components/staff/current-sick-leave'

export default async function StaffSickLeave({ params }: { params: { id: string } }) {
	const employee = await api.staff.getId.query({ id: params.id })
	const [pastSickLeaves, currentSickLeave] = checkSickLeaves(employee?.sickLeaves as Absence[])
	return (
		<>
			<div className='flex justify-between items-center'>
				<Heading size={'xs'}>Sick Leaves for {employee?.name}</Heading>
				<CreateSickLeave employee={employee} />
			</div>
			{currentSickLeave ? (
				<CurrentSickLeave sickLeave={currentSickLeave} />
			) : (
				<div className='bg-green-500 rounded-md border text-white mt-4 p-2'>
					<Heading
						size={'xxs'}
						className='flex items-center'>
						<HeartPulseIcon
							size={42}
							className='ml-1 mr-2 text-white'
						/>
						Currently not on sick leave
					</Heading>
				</div>
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
