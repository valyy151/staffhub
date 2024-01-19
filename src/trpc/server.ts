import { headers } from "next/headers"

import { AppRouter } from "@/server/api/root"
import {
  createTRPCProxyClient,
  loggerLink,
  unstable_httpBatchStreamLink,
} from "@trpc/client"

import { getUrl, transformer } from "./shared"

export const api = createTRPCProxyClient<AppRouter>({
  transformer,
  links: [
    loggerLink({
      enabled: (op) =>
        process.env.NODE_ENV === "development" ||
        (op.direction === "down" && op.result instanceof Error),
    }),
    unstable_httpBatchStreamLink({
      url: getUrl(),
      headers() {
        // Forward headers from the browser to the API
        return {
          ...Object.fromEntries(headers()),
          "x-trpc-source": "rsc",
        }
      },
    }),
  ],
})
