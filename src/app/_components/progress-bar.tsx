'use client'
import { AppProgressBar } from "next-nprogress-bar";

export default function ProgressBar() {
	return (
		<AppProgressBar
			color='#29D'
			shallowRouting
			options={{ showSpinner: false }}
		/>
	)
}
