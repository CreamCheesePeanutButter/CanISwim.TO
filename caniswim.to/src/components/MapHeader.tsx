type MarkerCardProps = {
  title: string;
  description: string;
  type: "active" | "nearby" | "alert" | "info";
};

function MarkerIcon({ type }: { type: MarkerCardProps["type"] }) {
  if (type === "info") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5 text-teal-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5M12 7h.01" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-3.5 w-3.5 ${
        type === "alert" ? "text-red-600" : "text-blue-700"
      }`}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 3 23 21H1L12 3Z" />
    </svg>
  );
}

function MarkerCard({ title, description, type }: MarkerCardProps) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
      <MarkerIcon type={type} />

      <div className="min-w-0">
        <h3 className="truncate text-[11px] font-semibold text-slate-800">
          {title}
        </h3>
        <p className="truncate text-[10px] text-slate-500">{description}</p>
      </div>
    </div>
  );
}

function ActionIcon({ type }: { type: "map" | "layers" | "search" }) {
  if (type === "map") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5 text-teal-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" />
        <path d="M9 3v15M15 6v15" />
      </svg>
    );
  }

  if (type === "layers") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5 text-slate-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
        <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5 text-slate-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 5 5" />
    </svg>
  );
}

function ActionButton({
  type,
  children,
}: {
  type: "map" | "layers" | "search";
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 transition hover:border-teal-500 hover:text-teal-700"
    >
      <ActionIcon type={type} />
      {children}
    </button>
  );
}

export default function ShorelineMapHeader() {
  return (
    <section className="w-full border-t-2 border-fuchsia-500 bg-slate-50 px-4 py-7 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">
              Mississauga–Oakville shoreline
            </h1>
            <p className="text-xs text-slate-500">
              Explore beaches along Lake Ontario
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-2">
            <ActionButton type="map">Map view</ActionButton>
            <ActionButton type="layers">Layers</ActionButton>
            <ActionButton type="search">Search</ActionButton>
          </nav>
        </header>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <MarkerCard
            title="Active marker"
            description="Beach location"
            type="active"
          />

          <MarkerCard
            title="Nearby points"
            description="Shoreline location"
            type="nearby"
          />

          <MarkerCard
            title="Alert marker"
            description="Highlighted location"
            type="alert"
          />

          <MarkerCard
            title="Info panel"
            description="Beach stats summary"
            type="info"
          />
        </div>
      </div>
    </section>
  );
}
