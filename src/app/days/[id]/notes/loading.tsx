export default function NotesLoading() {
  return (
    <div className="px-4">
      <div className="h-8 w-64 animate-pulse rounded bg-muted" />

      <div className="mb-4 flex w-full justify-end">
        <div className="h-10 w-32 animate-pulse rounded bg-muted" />
      </div>
      <div className="space-y-1">
        <div className="h-24 w-full animate-pulse rounded bg-muted" />
        <div className="h-24 w-full animate-pulse rounded bg-muted" />
      </div>
    </div>
  )
}
