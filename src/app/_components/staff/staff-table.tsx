'use client'
import type { StaffOutput } from '@/trpc/shared'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { useRouter } from 'next/navigation'

export function StaffTable({ staff }: { staff: StaffOutput }) {
	const router = useRouter()
	return (
		<Table className='border'>
			<TableHeader>
				<TableRow className='hover:bg-inherit'>
					<TableHead>Name</TableHead>
					<TableHead>Phone</TableHead>
					<TableHead>Email</TableHead>
					<TableHead className='text-right'>Address</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{staff.map((employee) => (
					<TableRow
						key={employee.id}
						onClick={() => router.push(`/staff/${employee.id}`)}
						onMouseOver={() => router.prefetch(`/staff/${employee.id}`)}
						className='cursor-pointer'>
						<TableCell className='cursor-pointer whitespace-nowrap font-medium'>{employee.name}</TableCell>

						<TableCell className='cursor-pointer whitespace-nowrap'>{employee.phoneNumber}</TableCell>

						<TableCell className='cursor-pointer whitespace-nowrap'>{employee.email}</TableCell>

						<TableCell className='cursor-pointer whitespace-nowrap text-right'>{employee.address}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}
