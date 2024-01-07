import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react'
import { useState } from 'react'

import { cn } from '@/lib/utils'

import { Button } from './ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from './ui/command'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

export default function RolesDropdown({
	role,
	roles,
	setRole,
}: {
	role: { id: string; name: string }
	roles: { id: string; name: string }[] | undefined
	setRole: (role: { id: string; name: string }) => void
}) {
	const [open, setOpen] = useState(false)
	const [value, setValue] = useState(role?.name)

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					role='combobox'
					aria-expanded={open}
					className='w-[200px] justify-between'>
					{role?.name ? role.name : 'Select a role...'}
					<ChevronsUpDownIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-[200px] p-0'>
				<Command>
					<CommandInput placeholder='Search roles...' />
					<CommandEmpty>No employees found.</CommandEmpty>
					<CommandGroup>
						{roles
							?.sort((a, b) => a.name.localeCompare(b.name))
							.map((role) => (
								<CommandItem
									key={role?.id}
									onSelect={(value) => {
										setValue(value)
										setRole && setRole(role)
										setOpen(false)
									}}>
									<CheckIcon
										className={cn('mr-2 h-4 w-4', value === role.name.toLowerCase() ? 'opacity-100' : 'opacity-0')}
									/>
									{role?.name}
								</CommandItem>
							))}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
