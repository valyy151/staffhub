import { api } from '@/trpc/server'
import SchedulePlanner from '../_components/schedule/schedule-planner'

export default async function SchedulePage() {
	const shiftModels = await api.shiftModel.get.query()

	return <SchedulePlanner shiftModels={shiftModels} />
}
