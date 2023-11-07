import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'

type Props = {
	staff: {
		id: string
		name: string
		email: string
		address: string
		phoneNumber: string
	}[]
}

export function StaffTable({ staff }: Props) {
	return (
		<div className='max-h-[76.5vh] overflow-y-scroll border'>
			<Table>
				<TableHeader className='sticky top-0 bg-background shadow shadow-border dark:shadow-md dark:shadow-border'>
					<TableRow className='hover:bg-inherit'>
						<TableHead>Name</TableHead>
						<TableHead>Phone</TableHead>
						<TableHead>Email</TableHead>
						<TableHead className='text-right'>Address</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{staff.map((employee) => (
						<TableRow key={employee.id} className='cursor-pointer duration-75 hover:bg-gray-50 dark:hover:bg-gray-800'>
							<TableCell className='cursor-pointer whitespace-nowrap font-medium'>{employee.name}</TableCell>

							<TableCell className='cursor-pointer whitespace-nowrap'>{employee.phoneNumber}</TableCell>

							<TableCell className='cursor-pointer whitespace-nowrap'>{employee.email}</TableCell>

							<TableCell className='cursor-pointer whitespace-nowrap text-right'>{employee.address}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
