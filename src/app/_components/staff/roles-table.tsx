'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/_components/ui/table'

export default function RolesTable({ roles }: { roles: { id: string; name: string }[] | undefined }) {
	return (
		<Table className='border mt-4'>
			<TableHeader className='border-b text-xl'>
				<TableRow className='hover:bg-inherit'>
					<TableHead>Role</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody className='text-lg'>
				{roles?.map((role) => (
					<TableRow
						key={role.id}
						className='hover:bg-inherit'>
						<TableCell>{role.name}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}
