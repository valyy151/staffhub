'use client'
import { useRouter } from "next-nprogress-bar";
import { useState } from "react";

import { api } from "@/trpc/react";

import { Button } from "./ui/button";
import FormModal from "./ui/form-modal";
import { useToast } from "./ui/use-toast";

export default function DeleteAccount() {
	const [showModal, setShowModal] = useState(false)

	const { toast } = useToast()

	const router = useRouter()

	const deleteUser = api.user.delete.useMutation({
		onSuccess: () => {
			setShowModal(false)
			toast({
				title: 'Account deleted successfully.',
			})

			setTimeout(() => {
				router.push('/')
			}, 2000)
		},

		onError: () => {
			toast({
				title: 'There was a problem deleting your account.',
				variant: 'destructive',
			})
		},
	})
	return (
		<>
			<Button
				variant={'destructive'}
				onClick={() => setShowModal(true)}>
				Delete my Account
			</Button>
			{showModal && (
				<FormModal
					showModal={showModal}
					pending={deleteUser.isLoading}
					cancel={() => setShowModal(false)}
					submit={() => deleteUser.mutate()}
					heading='Are you sure you want to delete your account?'
					text='You will also lose all the data that you have. This change is not reversible.'
				/>
			)}
		</>
	)
}
