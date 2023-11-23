import { createTRPCProxyClient, loggerLink, unstable_httpBatchStreamLink } from '@trpc/client'
import { headers } from 'next/headers'

import { type AppRouter } from '@/server/api/root'
import { getUrl, transformer } from './shared'

export const api = createTRPCProxyClient<AppRouter>({
	transformer,
	links: [
		loggerLink({
			enabled: (op) => process.env.NODE_ENV === 'development' || (op.direction === 'down' && op.result instanceof Error),
		}),
		unstable_httpBatchStreamLink({
			url: getUrl(),
			headers() {
				const newHeaders = new Map(headers())

				// If you're using Node 18 before 18.15.0, omit the "connection" header
				newHeaders.delete('connection')

				// `x-trpc-source` is not required, but can be useful for debugging
				newHeaders.set('x-trpc-source', 'rsc')

				// Forward headers from the browser to the API
				return Object.fromEntries(newHeaders)
			},
		}),
	],
})
