import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/_components/ui/alert-dialog"

type ModalProps = {
  text: string
  open: boolean
  pending: boolean
  heading?: string
  submit: () => void
  cancel: (open: boolean) => void
}

export default function FormModal({
  open,
  text,
  pending,
  submit,
  cancel,
}: ModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={cancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>{text}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={submit}
            disabled={pending}
            aria-disabled={pending}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
