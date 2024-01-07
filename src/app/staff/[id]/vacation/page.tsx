import { PalmtreeIcon } from 'lucide-react'

import Absence from '@/app/_components/absence'
import CreateAbsence from '@/app/_components/create-absence'
import CurrentAbsence from '@/app/_components/current-absence'
import Heading from '@/app/_components/ui/heading'
import type { Absence as AbsenceType } from '@/lib/types'
import { checkAbsences } from '@/lib/utils'
import { api } from '@/trpc/server'

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

export default async function StaffVacation({ params }: { params: { id: string } }) {
	const employee = await api.staff.getVacations.query({ id: params.id })
	const [pastVacations, currentVacation, upcomingVacations] = checkAbsences(employee?.vacations as AbsenceType[])
	return (
		<>
			<div className='flex justify-between items-center'>
				<Heading size={'xs'}>Vacations for {employee?.name}</Heading>
				<CreateAbsence
					type='vacation'
					employee={employee}
				/>
			</div>
			{currentVacation ? (
				<CurrentAbsence
					type='vacation'
					absence={currentVacation}
				/>
			) : (
				<div className='bg-green-500 rounded-md border text-white mt-4 p-2 min-w-[46rem]'>
					<Heading
						size={'xxs'}
						className='flex items-center'>
						<PalmtreeIcon
							size={42}
							className='ml-1 mr-2 text-white'
						/>
						Currently not on vacation
					</Heading>
				</div>
			)}

			{upcomingVacations.length > 0 ? (
				<>
					<Heading
						size={'xxs'}
						className='mb-3 mt-12 flex items-center'>
						<PalmtreeIcon
							size={42}
							className='ml-1 mr-2 text-green-400'
						/>
						Upcoming Vacations
					</Heading>

					{upcomingVacations?.map((vacation) => (
						<Absence
							type='vacation'
							key={vacation.id}
							absence={vacation}
						/>
					))}
				</>
			) : (
				<>
					<Heading
						size={'xxs'}
						className='mb-3 mt-12 flex items-center'>
						<PalmtreeIcon
							size={42}
							className='ml-1 mr-2 text-green-400'
						/>
						Upcoming Vacations
					</Heading>
					<p className='ml-14 mt-4'>No upcoming vacations</p>
				</>
			)}

			{pastVacations.length > 0 ? (
				<>
					<Heading
						size={'xxs'}
						className='mb-3 mt-12 flex items-center'>
						<PalmtreeIcon
							size={42}
							className='ml-1 mr-2 text-gray-400'
						/>
						Previous Vacations
					</Heading>

					{pastVacations?.map((vacation) => (
						<Absence
							type='vacation'
							key={vacation.id}
							absence={vacation}
						/>
					))}
				</>
			) : (
				<>
					<Heading
						size={'xxs'}
						className='mb-3 mt-12 flex items-center'>
						<PalmtreeIcon
							size={42}
							className='ml-1 mr-2 text-gray-400'
						/>
						Past Vacations
					</Heading>
					<p className='ml-14 mt-4'>No past vacations</p>
				</>
			)}
		</>
	)
}
