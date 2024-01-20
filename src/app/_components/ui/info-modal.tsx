import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog"

type ModalProps = {
  heading: string
  text: string[]
  open: boolean
  close: (showModal: boolean) => void
}

export default function InfoModal({ text, open, close, heading }: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl">{heading}</DialogTitle>
          {text.map((sentence, index) => (
            <DialogDescription key={index} className="md:text-md pb-2 text-sm">
              {sentence}
            </DialogDescription>
          ))}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
