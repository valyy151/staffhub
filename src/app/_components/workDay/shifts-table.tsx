'use client'
import { Table, TableBody, TableHeader, TableHead, TableRow } from '@/app/_components/ui/table'
import Shift from './shift'
import { api } from '@/trpc/react'

export default function ShiftsTable({ shifts }: { shifts: any }) {
	const { data: shiftModels } = api.shiftModel.get.useQuery()

	return (
		<Table className='min-w-full border'>
			<TableHeader>
				<TableRow className='hover:bg-inherit'>
					<TableHead>Employee</TableHead>
					<TableHead>Time</TableHead>
					<TableHead>Role</TableHead>
					<TableHead>Hours</TableHead>
					<TableHead className='text-right'>Absence</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{shifts.map((shift: any) => (
					<Shift
						shift={shift}
						key={shift.id}
						shiftModels={shiftModels}
					/>
				))}
			</TableBody>
		</Table>
	)
}
