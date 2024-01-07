import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './select'
import { formatTime } from '@/lib/utils'

export default function SelectShiftModel({
	shiftModel,
	shiftModels,
	setShiftModel,
}: {
	shiftModel: string
	setShiftModel: (shiftModel: string) => void
	shiftModels: { id: string; end: number; start: number }[]
	handleTimeChange?: (newTime: string, field: 'start' | 'end') => void
}) {
	return (
		<>
			<Select
				value={shiftModel}
				onValueChange={setShiftModel}>
				<SelectTrigger className='w-[300px] focus:ring-0 focus:ring-offset-0'>
					<SelectValue placeholder='Select a shift model' />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>Shift Models</SelectLabel>
						{shiftModels?.map((model) => (
							<SelectItem
								key={model.id}
								value={`${formatTime(model.start)} - ${formatTime(model.end) == '00:00' ? '24:00' : formatTime(model.end)}`}>
								{`${formatTime(model.start)} - ${formatTime(model.end) == '00:00' ? '24:00' : formatTime(model.end)}`}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</>
	)
}
