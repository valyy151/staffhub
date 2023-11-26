'use client'
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/app/_components/ui/table";
import { api } from "@/trpc/react";
import { WorkDayShiftsOutput } from "@/trpc/shared";

import Shift from "./shift";

export default function ShiftsTable({ shifts }: WorkDayShiftsOutput) {
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
				{shifts.map((shift) => (
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
