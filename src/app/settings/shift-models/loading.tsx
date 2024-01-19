export default function ShiftModelsSettingsLoading() {
  return (
    <div className="p-4">
      <div className="h-8 w-80 animate-pulse rounded bg-muted" />
      <div className="mt-2 flex space-x-2">
        <div className="h-10 w-[10.5rem] animate-pulse rounded bg-muted" />
        <div className="h-10 w-48 animate-pulse rounded bg-muted" />
      </div>

      <div className="mt-8 h-8 w-32 animate-pulse rounded bg-muted" />
      <div className="my-2 flex gap-4">
        <div className="h-48 w-64 animate-pulse rounded-md bg-muted" />
        <div className="h-48 w-64 animate-pulse rounded-md bg-muted" />
        <div className="h-48 w-64 animate-pulse rounded-md bg-muted" />
      </div>
    </div>
  )
}
