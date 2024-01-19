export default function Loading() {
  return (
    <>
      <div className="h-10 w-40 animate-pulse rounded bg-muted" />
      <section className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="h-52 w-96 animate-pulse rounded bg-muted" />
        <div className="h-52 w-96 animate-pulse bg-muted" />
        <div className="h-52 w-96 animate-pulse bg-muted" />
      </section>
      <div className="mt-4 h-52 w-full animate-pulse bg-muted" />
    </>
  )
}
