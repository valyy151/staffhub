'use client'
import type { StaffOutput } from '@/trpc/shared'
import { useRouter } from 'next-nprogress-bar'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../_components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/_components/ui/card'

export function StaffTable({ staff }: { staff: StaffOutput[] }) {
	const router = useRouter()

	return (
		<>
			<Table className='border hidden md:block'>
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
			<div className='md:hidden grid grid-cols-1 gap-4'>
				{staff.map((employee) => (
					<Card onClick={() => router.push(`/staff/${employee.id}`)}>
						<CardHeader>
							<CardTitle className='text-sm'>{employee.name}</CardTitle>
						</CardHeader>
						<CardContent>
							<CardDescription>
								<span className='font-medium'>Phone:</span> {employee.phoneNumber}
							</CardDescription>
							<CardDescription>
								<span className='font-medium'>Email:</span> {employee.email}
							</CardDescription>
							<CardDescription>
								<span className='font-medium'>Address:</span> {employee.address}
							</CardDescription>
						</CardContent>
					</Card>
				))}
			</div>
		</>
	)
}
