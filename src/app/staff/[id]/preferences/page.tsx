import Heading from '@/app/_components/ui/heading'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/_components/ui/table'
import { formatTime } from '@/lib/utils'
import { api } from '@/trpc/server'

import type { Metadata } from 'next/types'
import EditPreferences from './_components/edit-preferences'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
	const id = params.id
	const employee = await api.staff.getName.query({ id })

	return {
		title: employee?.name,
		description: `Profile for ${employee?.name}`,
		icons: [{ rel: 'icon', url: '/favicon.ico' }],
	}
}

export default async function StaffPreferences({ params }: { params: { id: string } }) {
	const employee = await api.staff.getPreference.query({ id: params.id })
	return (
		<div className='flex flex-col'>
			<div className='flex items-center'>
				<Heading size={'xs'}>Schedule preferences for {employee?.name}</Heading>
				<EditPreferences employee={employee} />
			</div>
			<div className='flex space-x-8 mt-4'>
				<Table className='border'>
					<TableHeader>
						<TableRow className='hover:bg-inherit'>
							<TableHead>Shift Preferences</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{employee?.schedulePreference?.shiftModels.map((shiftModel) => (
							<TableRow
								key={shiftModel.id}
								className='hover:bg-inherit'>
								<TableCell>
									{formatTime(shiftModel.start)} - {formatTime(shiftModel.end)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>

				<Table className='border h-fit'>
					<TableHeader>
						<TableRow className='hover:bg-inherit'>
							<TableHead>Monthly Hours Preferences</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						<TableRow className='hover:bg-inherit'>
							<TableCell>
								{employee?.schedulePreference?.hoursPerMonth! > 0 ? (
									<span>{employee?.schedulePreference?.hoursPerMonth} hours</span>
								) : (
									<span>Not assigned</span>
								)}
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div>
		</div>
	)
}
