import { useNavigate } from "react-router-dom";
import type { LocationDTO } from "../DTOs/LocationDTO";

type MarkerCardProps = {
  title: string;
  description: string;
  type: "type" | "active" | "pass" | "info";
  locationInfo?: LocationDTO;
};

type MarkerIconProps = {
  type: MarkerCardProps["type"];
  locationInfo?: LocationDTO;
};

function MarkerIcon({ type, locationInfo }: MarkerIconProps) {
  switch (type) {
    case "info":
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5 text-teal-600"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5M12 7h.01" />
        </svg>
      );

    case "active":
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5 text-amber-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="3" fill="currentColor" />
        </svg>
      );

    case "pass":
      return (
        <svg
          viewBox="0 0 24 24"
          className={`h-3.5 w-3.5 ${
            locationInfo?.pass ? "text-emerald-600" : "text-red-600"
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );

    case "type":
    default:
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5 text-blue-700"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 3 23 21H1L12 3Z" />
        </svg>
      );
  }
}

function MarkerCard({
  title,
  description,
  type,
  locationInfo,
}: MarkerCardProps) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
      <MarkerIcon type={type} locationInfo={locationInfo} />

      <div className="mr-auto min-w-0">
        <h3 className="text-[11px] font-semibold text-slate-800">{title}</h3>

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

export interface ShorelineMapHeaderProps {
  id: number | undefined;
  title: string;
  locationType: string;
  isActive: boolean;
  pass: string;
}

export default function ShorelineMapHeader({
  id,
  title,
  locationType,
  isActive,
  pass,
}: ShorelineMapHeaderProps): React.JSX.Element {
  const navigate = useNavigate();

  const locationInfo: LocationDTO = {
    id: id ?? 0,
    name: title,
    type: locationType,
    isActive,
    pass,
    geometry: null,
  };

  const handleInfoClick = () => {
    if (id === undefined) return;

    if (locationType === "Beach") {
      navigate(`/location/beach/${id}`);
    } else if (locationType === "Pool") {
      navigate(`/location/pool/${id}`);
    }
  };

  return (
    <section className="w-full border-t-2 border-green-500 bg-slate-50 px-4 py-7 sm:px-8">
      <div className="w-full space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-left">
            <h1 className="text-xl font-bold tracking-tight text-slate-800">
              {title}
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
            title="Type"
            description={locationType}
            type="type"
            locationInfo={locationInfo}
          />

          <MarkerCard
            title="Active"
            description={isActive ? "Active" : "Not recorded"}
            type="active"
            locationInfo={locationInfo}
          />

          <MarkerCard
            title="Safe to swim"
            description={pass ? "Pass" : "Fail"}
            type="pass"
            locationInfo={locationInfo}
          />

          <div
            onClick={handleInfoClick}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleInfoClick();
              }
            }}
            className="cursor-pointer"
          >
            <MarkerCard
              title="Info panel"
              description="Summary"
              type="info"
              locationInfo={locationInfo}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
