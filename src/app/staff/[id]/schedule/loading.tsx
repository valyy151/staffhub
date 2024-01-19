export default function StaffScheduleLoading() {
  return (
    <div className="flex flex-col">
      <div className="h-8 w-[28rem] animate-pulse rounded bg-muted" />
      <div className="mt-4 flex space-x-10">
        <div className="h-[46.2rem] min-w-[40vw] animate-pulse rounded bg-muted" />
        <div className="flex flex-col">
          <div className="h-[20.5rem] w-[22rem] animate-pulse rounded bg-muted" />
          <div className="mt-2 h-11 w-36 animate-pulse rounded-md bg-muted" />
        </div>
      </div>
    </div>
  )
}
