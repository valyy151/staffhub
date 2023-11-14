import EditPreferences from '@/app/_components/staff/edit-preferences'
import Heading from '@/app/_components/ui/heading'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/_components/ui/table'
import { formatTime } from '@/app/lib/utils'
import { api } from '@/trpc/server'

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
							<TableCell>{employee?.schedulePreference?.hoursPerMonth! > 0 ? <span>{employee?.schedulePreference?.hoursPerMonth} hours</span> : <span>Not assigned</span>}</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div>
		</div>
	)
}
