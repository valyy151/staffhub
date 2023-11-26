import { createTw } from "react-pdf-tailwind";

import { StaffScheduleOutput } from "@/trpc/shared";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

import { calculateHours, formatDate, formatTime, formatTotal } from "../lib/utils";

type Shift = {
	end: number
	date: number
	start: number
	workDayId: string
	vacation?: boolean
	sickLeave?: boolean
}

const tw = createTw({
	theme: {
		fontFamily: {
			sans: ['General Sans'],
		},
		extend: {
			colors: {
				custom: '#bada55',
			},
		},
	},
})

const styles = StyleSheet.create({
	title: {
		margin: 0,
		paddingLeft: 12,
		paddingTop: 16,
		paddingBottom: 16,
		display: 'flex',
		backgroundColor: 'black',
		color: 'white',
		fontSize: 26,
	},
})

export function SchedulePDF({ month, shifts, employee }: { month: string; shifts: Shift[]; employee: StaffScheduleOutput }) {
	const renderDay = (shift: Shift) => {
		if (shift.vacation) {
			return (
				<>
					<Text style={tw('px-4 py-[0.3572rem] flex flex-row border-b border-r w-1/4')}></Text>

					<Text style={tw('px-4 py-[0.3572rem] flex flex-row border-b border-r w-1/4')}></Text>
					<Text style={tw('px-4 py-[0.3572rem] border-b border-r w-1/4')}>Vacation</Text>
				</>
			)
		}

		if (shift.sickLeave) {
			return (
				<>
					<Text style={tw('px-4 py-[0.3572rem] flex flex-row border-b border-r w-1/4')}></Text>

					<Text style={tw('px-4 py-[0.3572rem] flex flex-row border-b border-r w-1/4')}></Text>
					<Text style={tw('px-4 py-[0.3572rem] border-b border-r w-1/4')}>Sick</Text>
				</>
			)
		}

		if (shift.start && shift.end) {
			return (
				<>
					<Text style={tw(`px-4 py-[0.3572rem] flex flex-row border-b border-r w-1/4`)}>
						{formatTime(shift.start)} - {formatTime(shift.end)}
					</Text>

					<Text style={tw('px-4 py-[0.3572rem] flex flex-row border-b border-r w-1/4')}>{formatTotal(shift.start, shift.end)}</Text>
					<Text style={tw('px-4 py-[0.3572rem] border-b border-r w-1/4')}>
						{shift.sickLeave && 'Sick'} {shift.vacation && 'Vacation'}
					</Text>
				</>
			)
		}

		return (
			<>
				<Text style={tw('px-4 py-[0.3572rem] flex flex-row border-b border-r w-1/4')}></Text>
				<Text style={tw('px-4 py-[0.3572rem] flex flex-row border-b border-r w-1/4')}></Text>
				<Text style={tw('px-4 py-[0.3572rem] border-b border-r w-1/4')}></Text>
			</>
		)
	}

	return (
		<Document pageLayout='singlePage'>
			<Page
				size='B4'
				orientation='portrait'
				style={tw('bg-white')}>
				<Text style={styles.title}>
					{employee?.name} - {month} [{calculateHours(employee?.shifts)} hours]
				</Text>
				<View style={tw('flex flex-row')}>
					<Text style={tw('px-4 py-[0.3572rem] border-b border-r w-1/4 bg-gray-200')}>Date</Text>

					<Text style={tw('px-4 py-[0.3572rem] border-b border-r w-1/4 bg-gray-200')}>Time</Text>

					<Text style={tw('px-4 py-[0.3572rem] border-b border-r w-1/4 bg-gray-200')}>Total</Text>

					<Text style={tw('px-4 py-[0.3572rem] border-b border-r w-1/4 bg-gray-200')}>Note</Text>
				</View>
				{shifts.map((shift) => (
					<View
						key={shift.workDayId}
						style={tw('m-0 flex flex-row')}>
						<Text style={tw('px-4 py-[0.3572rem] border-b border-r w-1/4')}>{formatDate(shift.date, 'long')}</Text>
						{renderDay(shift)}
					</View>
				))}
			</Page>
		</Document>
	)
}
