import { Download } from "lucide-react";

import { Button } from "@/app/_components/ui/button";
import { StaffScheduleOutput } from "@/trpc/shared";
import { PDFDownloadLink } from "@react-pdf/renderer";

import { SchedulePDF } from "./SchedulePDF";

type Shift = {
	end: number
	date: number
	start: number
	workDayId: string
	vacation?: boolean
	sickLeave?: boolean
}

type PDFButtonProps = {
	month: string
	shifts: Shift[]
	employee: StaffScheduleOutput
}

export default function PDFButton({ employee, month, shifts }: PDFButtonProps) {
	return (
		<Button className='mt-2'>
			<Download className='mr-2' />
			<PDFDownloadLink
				document={
					<SchedulePDF
						month={month}
						shifts={shifts}
						employee={employee}
					/>
				}
				fileName={`${employee?.name} - ${month}`}>
				Save as PDF
			</PDFDownloadLink>
		</Button>
	)
}
