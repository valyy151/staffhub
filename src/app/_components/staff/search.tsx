'use client'

import { useDebouncedCallback } from 'use-debounce'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { Input } from '@/app/_components/ui/input'
import { SearchIcon } from 'lucide-react'

export default function Search() {
	const searchParams = useSearchParams()
	const pathname = usePathname()
	const { replace } = useRouter()

	const handleSearch = useDebouncedCallback((term) => {
		const params = new URLSearchParams(searchParams)
		params.set('page', '1')
		if (term) {
			params.set('query', term)
		} else {
			params.delete('query')
		}
		replace(`${pathname}?${params.toString()}`)
	}, 300)

	return (
		<div className='relative flex flex-1 flex-shrink-0 items-center rounded-md border px-2 ring-primary focus-within:border-primary focus-within:ring-1'>
			<label
				htmlFor='search'
				className='sr-only'>
				Search
			</label>
			<SearchIcon />
			<Input
				placeholder='Search staff...'
				className='border-none focus-visible:ring-0'
				onChange={(e) => handleSearch(e.target.value)}
			/>
		</div>
	)
}
