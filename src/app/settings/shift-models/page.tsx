import CreateModel from '@/app/_components/settings/create-model'
import ShiftModel from '@/app/_components/settings/shift-model'
import Heading from '@/app/_components/ui/heading'
import Paragraph from '@/app/_components/ui/paragraph'
import { api } from '@/trpc/server'

export default async function ShiftModelsSettings() {
	const shiftModels = await api.shiftModel.get.query()
	return (
		<section className='p-4'>
			<Heading
				size={'xs'}
				className='mb-2'>
				Add and manage Shift Models
			</Heading>
			<CreateModel />
			<Heading
				size={'xxs'}
				className='mt-8 mb-2'>
				My Shift Models
			</Heading>
			{shiftModels.length > 0 ? (
				<div className='flex gap-4 flex-wrap max-w-4xl'>
					{shiftModels.map((shiftModel) => (
						<ShiftModel
							key={shiftModel.id}
							shiftModel={shiftModel}
						/>
					))}
				</div>
			) : (
				<Paragraph className='mt-4'>You don't have any shift models yet.</Paragraph>
			)}
		</section>
	)
}
