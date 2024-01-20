export default function DashboardLoading() {
  return (
    <div className="flex">
      <div className="hidden h-screen w-[15.45rem] border-r p-4 md:block">
        <div className="h-8 w-24 animate-pulse rounded bg-muted" />
        <div className="mt-3 h-10 w-full animate-pulse rounded bg-muted" />
        <div className="mt-4 flex space-x-2">
          <div className="h-10 w-28 animate-pulse rounded bg-muted" />
          <div className="h-10 w-28 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="w-full p-4">
        <div className="h-8 w-full animate-pulse rounded bg-muted md:w-96" />
        <div className="mt-4 h-10 w-full animate-pulse rounded bg-muted md:hidden" />
        <div className="mt-4 h-96 w-full animate-pulse rounded bg-muted" />
      </div>
    </div>
  )
}
