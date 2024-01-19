export default function ScheduleLoading() {
  return (
    <div className="flex space-x-14 p-4">
      <div className="w-fit">
        <div className="flex justify-between">
          <div className="h-10 w-48 animate-pulse rounded bg-muted" />
          <div className="h-10 w-56 animate-pulse rounded bg-muted" />
        </div>
        <div className="mt-2 h-[81vh] w-[50vw] animate-pulse rounded bg-muted" />
      </div>
      <div className="flex flex-col space-y-4">
        <div className="h-10 w-52 animate-pulse rounded bg-muted" />

        <div className="h-80 w-52 animate-pulse rounded bg-muted" />
      </div>
    </div>
  )
}
