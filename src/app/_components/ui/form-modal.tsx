import { MouseEventHandler } from "react";

import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/app/_components/ui/alert-dialog";

type ModalProps = {
	text: string
	pending: boolean
	heading?: string
	showModal: boolean
	cancel: MouseEventHandler<HTMLButtonElement>
	submit: MouseEventHandler<HTMLButtonElement>
}

export default function FormModal({ text, pending, submit, cancel }: ModalProps) {
	return (
		<AlertDialog open>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>{text}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={cancel}>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={submit}
						disabled={pending}
						aria-disabled={pending}>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
