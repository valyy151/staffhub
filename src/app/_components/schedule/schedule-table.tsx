import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/app/_components/ui/table";

import ShiftRow from "./table-shift-row";

type Data = {
	date: number
	end?: number
	start?: number
}[]

type ScheduleTableProps = {
	data: Data
	shift: string
	sickDays: number[]
	vacationDays: number[]
	setData: (data: Data) => void
}

export default function ScheduleTable({ data, shift, setData, sickDays, vacationDays }: ScheduleTableProps) {
	return (
		<div className='max-h-[81vh] overflow-y-scroll border'>
			<Table className='min-w-[50vw]'>
				<TableHeader className='sticky top-0 bg-background shadow shadow-border dark:shadow-md dark:shadow-border'>
					<TableRow className='hover:bg-inherit'>
						<TableHead>Date</TableHead>
						<TableHead>Start</TableHead>
						<TableHead>End</TableHead>
						<TableHead className='text-right'>Total</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((item, index) => (
						<ShiftRow
							data={data}
							item={item}
							shift={shift}
							index={index}
							setData={setData}
							sickDays={sickDays}
							vacationDays={vacationDays}
						/>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
