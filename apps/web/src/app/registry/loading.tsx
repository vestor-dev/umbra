export default function RegistryLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 lg:px-10">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="space-y-3">
          <div className="skeleton h-3 w-28" />
          <div className="skeleton h-11 w-72" />
          <div className="skeleton h-4 w-96" />
        </div>
        <div className="skeleton h-11 w-52 rounded-full" />
      </div>

      {/* Stats strip */}
      <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline shadow-soft sm:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="space-y-2 bg-surface px-5 py-4">
            <div className="skeleton h-7 w-12" />
            <div className="skeleton h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="skeleton h-6 w-32" />
          <div className="skeleton h-8 w-24 rounded-full" />
        </div>
        <div className="overflow-hidden rounded-2xl border border-hairline bg-surface shadow-soft">
          <div className="border-b border-hairline p-3">
            <div className="skeleton h-9 w-full max-w-sm rounded-full" />
          </div>
          <div className="divide-y divide-hairline">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-4">
                <div className="skeleton h-9 w-9 rounded-full" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="skeleton h-3.5 w-32" />
                  <div className="skeleton h-3 w-24" />
                </div>
                <div className="hidden flex-1 items-center gap-3 md:flex">
                  <div className="skeleton h-9 w-9 rounded-full" />
                  <div className="space-y-2">
                    <div className="skeleton h-3.5 w-20" />
                    <div className="skeleton h-3 w-16" />
                  </div>
                </div>
                <div className="skeleton hidden h-6 w-28 rounded-md md:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
