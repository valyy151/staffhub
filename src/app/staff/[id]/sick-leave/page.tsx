import { HeartPulseIcon } from 'lucide-react'

import SickLeave from '@/app/_components/staff/absence'
import CreateAbsence from '@/app/_components/staff/create-absence'
import CurrentAbsence from '@/app/_components/staff/current-absence'
import Heading from '@/app/_components/ui/heading'
import { checkAbsences } from '@/app/lib/utils'
import { api } from '@/trpc/server'

import type { Absence } from '@/app/lib/types'
import type { Metadata } from 'next/types'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
	const id = params.id
	const employee = await api.staff.getName.query({ id })

	return {
		title: employee?.name,
		description: `Profile for ${employee?.name}`,
		icons: [{ rel: 'icon', url: '/favicon.ico' }],
	}
}

export default async function StaffSickLeave({ params }: { params: { id: string } }) {
	const employee = await api.staff.getSickLeaves.query({ id: params.id })
	const [pastSickLeaves, currentSickLeave] = checkAbsences(employee?.sickLeaves as Absence[])
	return (
		<>
			<div className='flex justify-between items-center'>
				<Heading size={'xs'}>Sick Leaves for {employee?.name}</Heading>
				<CreateAbsence
					type='sick'
					employee={employee}
				/>
			</div>
			{currentSickLeave ? (
				<CurrentAbsence
					type='sick'
					absence={currentSickLeave}
				/>
			) : (
				<div className='bg-green-500 rounded-md border text-white mt-4 p-2 min-w-[46rem]'>
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
							type='sick'
							key={sickLeave.id}
							absence={sickLeave}
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
