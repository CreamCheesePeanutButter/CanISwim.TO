import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Geometry } from "geojson";
import type { PoolDTO } from "../DTOs/PoolDTO";

interface ParsedCoords {
  label: string;
  mapsUrl: string | null;
}

function parseGeometry(geometry: string | Geometry | null): ParsedCoords {
  if (!geometry) {
    return {
      label: "Unavailable",
      mapsUrl: null,
    };
  }

  try {
    const parsed: Geometry =
      typeof geometry === "string" ? JSON.parse(geometry) : geometry;

    if (parsed.type === "Point" && Array.isArray(parsed.coordinates)) {
      const [lng, lat] = parsed.coordinates;

      return {
        label: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        mapsUrl: `https://www.google.com/maps?q=${lat},${lng}`,
      };
    }

    return {
      label: `${parsed.type}`,
      mapsUrl: null,
    };
  } catch {
    return {
      label: typeof geometry === "string" ? geometry : "Invalid geometry",
      mapsUrl: null,
    };
  }
}

function getInspectionStatusConfig(status?: string) {
  const normalized = (status ?? "").trim().toLowerCase();

  if (normalized.includes("pass") && !normalized.includes("conditional")) {
    return {
      label: status || "Pass",
      badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
      dotClass: "bg-emerald-500",
      bannerClass: "bg-emerald-50/60 border-emerald-200/80 text-emerald-900",
      bannerText:
        "This recreational water facility passed its most recent public health inspection.",
    };
  }

  if (normalized.includes("conditional")) {
    return {
      label: status || "Conditional Pass",
      badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
      dotClass: "bg-amber-500",
      bannerClass: "bg-amber-50/70 border-amber-200/80 text-amber-900",
      bannerText:
        "Significant infractions were observed during the latest inspection. Re-inspection is required.",
    };
  }

  if (
    normalized.includes("closed") ||
    normalized.includes("fail") ||
    normalized.includes("order")
  ) {
    return {
      label: status || "Closed",
      badgeClass: "bg-red-50 text-red-800 border-red-200",
      dotClass: "bg-red-500",
      bannerClass: "bg-red-50/70 border-red-200/80 text-red-900",
      bannerText:
        "Critical health hazards were identified. This facility is closed until violations are resolved.",
    };
  }

  return {
    label: status || "Status Unknown",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    dotClass: "bg-slate-400",
    bannerClass: "bg-slate-50 border-slate-200 text-slate-600",
    bannerText: "No recent inspection status details available for this pool.",
  };
}

export function PoolInfoPage() {
  // Supports both /pools/:poolId and /pools/:id
  const { poolId, id } = useParams<{
    poolId?: string;
    id?: string;
  }>();

  const currentPoolId = poolId ?? id;

  const [pool, setPool] = useState<PoolDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentPoolId) {
      return;
    }

    const validPoolId = currentPoolId;
    const controller = new AbortController();

    async function fetchPoolInfo() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `http://localhost:3000/pools/?id=${encodeURIComponent(validPoolId)}`,
          {
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to load pool data (${response.status})`);
        }

        const data: PoolDTO = await response.json();

        setPool(data);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError((err as Error).message || "Error loading pool details.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchPoolInfo();

    return () => controller.abort();
  }, [currentPoolId]);

  const isLoading = Boolean(currentPoolId) && loading;
  const displayedError =
    error ?? (!currentPoolId ? "Pool ID is missing." : null);

  /*
   * Loading state
   */
  if (isLoading) {
    return (
      <div className="w-full space-y-6 animate-pulse text-left">
        <div className="space-y-2">
          <div className="h-7 w-64 bg-slate-200 rounded-lg" />
          <div className="h-4 w-56 bg-slate-100 rounded-md" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, idx) => (
            <div
              key={idx}
              className="h-28 bg-slate-100 border border-slate-200/60 rounded-xl"
            />
          ))}
        </div>
      </div>
    );
  }

  /*
   * Error state
   */
  if (displayedError || !pool) {
    return (
      <div className="w-full p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-left flex items-center gap-3">
        <span className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-red-500" />

        <p className="text-sm font-medium">
          {displayedError ?? "Pool not found."}
        </p>
      </div>
    );
  }

  const statusConfig = getInspectionStatusConfig(pool.inspectionStatus);

  const coords = parseGeometry(pool.geometry);

  const formattedDate = pool.lastInspectionDate
    ? new Date(pool.lastInspectionDate).toLocaleDateString("en-CA", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

  const hasInspectionDetails = Boolean(
    pool.observation ||
    pool.infCategory ||
    pool.defectDescription ||
    pool.actionDescription,
  );

  return (
    <div className="w-full flex flex-col items-start text-left space-y-6">
      {/* Header */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {pool.facilityName}
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            {pool.address || "Address unavailable"}

            <span className="text-slate-400"> • ID #{pool.id}</span>
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-2 self-start sm:self-auto px-3.5 py-1.5 text-xs font-semibold rounded-full border ${statusConfig.badgeClass}`}
        >
          <span className={`w-2 h-2 rounded-full ${statusConfig.dotClass}`} />

          {statusConfig.label}
        </span>
      </div>

      {/* Status Callout */}
      <div
        className={`w-full px-4 py-3 rounded-xl border text-sm ${statusConfig.bannerClass}`}
      >
        {statusConfig.bannerText}
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {/* Facility Type */}
        <div className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Facility Type
            </p>

            <p className="text-base font-bold text-slate-900 mt-1.5 line-clamp-2">
              {pool.type || "Public Pool"}
            </p>
          </div>

          <p className="text-xs text-slate-400 mt-3">Water classification</p>
        </div>

        {/* Last Inspection */}
        <div className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Last Inspected
            </p>

            <p className="text-lg font-bold text-slate-900 mt-1.5">
              {formattedDate}
            </p>
          </div>

          <p className="text-xs text-slate-400 mt-3">Public health audit</p>
        </div>

        {/* Infraction Category */}
        <div className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Infraction Category
            </p>

            <p className="text-base font-bold text-slate-900 mt-1.5 line-clamp-2">
              {pool.infCategory || "None Reported"}
            </p>
          </div>

          <p className="text-xs text-slate-400 mt-3">Compliance grouping</p>
        </div>

        {/* Coordinates */}
        <div className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Coordinates
            </p>

            <p className="text-sm font-mono font-semibold text-slate-800 mt-2">
              {coords.label}
            </p>
          </div>

          {coords.mapsUrl ? (
            <a
              href={coords.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700 mt-3 transition"
            >
              View on Map ↗
            </a>
          ) : (
            <p className="text-xs text-slate-400 mt-3">GPS location</p>
          )}
        </div>
      </div>

      {/* Inspection Findings */}
      {hasInspectionDetails && (
        <div className="w-full pt-2 space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Inspection Notes & Corrective Actions
          </h3>

          <div className="grid gap-4 w-full">
            {/* Observation */}
            {pool.observation && (
              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Observation
                </p>

                <p className="text-sm text-slate-700 leading-relaxed">
                  {pool.observation}
                </p>
              </div>
            )}

            {/* Defect */}
            {pool.defectDescription && (
              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Defect Description
                </p>

                <p className="text-sm text-slate-700 leading-relaxed">
                  {pool.defectDescription}
                </p>
              </div>
            )}

            {/* Action */}
            {pool.actionDescription && (
              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Action Taken
                </p>

                <p className="text-sm text-slate-700 leading-relaxed">
                  {pool.actionDescription}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
