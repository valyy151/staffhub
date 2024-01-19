export default function StaffLoading() {
  return (
    <main className="px-36 py-8">
      <div className="mb-2 mt-8 flex justify-between">
        <div className="h-10 w-[26rem] animate-pulse rounded bg-muted" />
        <div className="flex space-x-2">
          <div className="h-10 w-[17rem] animate-pulse rounded bg-muted" />
          <div className="h-10 w-40 animate-pulse rounded bg-muted" />
        </div>
      </div>

      <section className="h-[36.5rem] w-full animate-pulse rounded bg-muted" />
    </main>
  )
}
