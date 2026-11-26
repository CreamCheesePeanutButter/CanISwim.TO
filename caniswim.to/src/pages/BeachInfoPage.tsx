import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Geometry } from "geojson";
import type { BeachDTO } from "../DTOs/BeachDTO";

interface ParsedCoords {
  label: string;
  mapsUrl: string | null;
}

function parseGeometry(geometry: string | Geometry | null): ParsedCoords {
  if (!geometry) {
    return { label: "Unavailable", mapsUrl: null };
  }

  try {
    const parsed: Geometry =
      typeof geometry === "string" ? JSON.parse(geometry) : geometry;

    if (parsed.type === "Point" && Array.isArray(parsed.coordinates)) {
      const [lng, lat] = parsed.coordinates;
      return {
        label: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        mapsUrl: `https://google.com{lat},${lng}`,
      };
    }
    return { label: `${parsed.type}`, mapsUrl: null };
  } catch {
    return {
      label: typeof geometry === "string" ? geometry : "Invalid geometry",
      mapsUrl: null,
    };
  }
}

export function BeachInfoPage() {
  const { beachId } = useParams<{ beachId: string }>();

  const [beach, setBeach] = useState<BeachDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!beachId) return;

    const controller = new AbortController();

    async function fetchBeachInfo() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `http://localhost:3000/beaches/?id=${beachId}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error(`Failed to load beach data (${response.status})`);
        }

        const data: BeachDTO = await response.json();
        setBeach(data);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError((err as Error).message || "Error loading beach details.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchBeachInfo();
    return () => controller.abort();
  }, [beachId]);

  if (loading) {
    return (
      <div className="w-full space-y-6 animate-pulse text-left">
        <div className="space-y-2">
          <div className="h-7 w-64 bg-slate-200 rounded-lg" />
          <div className="h-4 w-48 bg-slate-100 rounded-md" />
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

  if (error || !beach) {
    return (
      <div className="w-full p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-left flex items-center gap-3">
        <span className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-red-500" />
        <p className="text-sm font-medium">{error ?? "Beach not found."}</p>
      </div>
    );
  }

  // Ontario recreational water quality standard (<= 200 E. coli / 100mL)
  const eColiNumeric =
    beach.eColi != null ? parseFloat(String(beach.eColi)) : NaN;
  const hasReading = !isNaN(eColiNumeric);
  const isSafe = hasReading && eColiNumeric <= 200;

  const statusConfig = !hasReading
    ? {
        label: "Off-Season / No Recent Sample",
        badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
        dotClass: "bg-slate-400",
        bannerClass: "bg-slate-50 border-slate-200 text-slate-600",
        bannerText:
          "Water quality testing is currently inactive or no recent E. coli sample is available.",
      }
    : isSafe
      ? {
          label: "Safe for Swimming",
          badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
          dotClass: "bg-emerald-500",
          bannerClass:
            "bg-emerald-50/60 border-emerald-200/80 text-emerald-900",
          bannerText:
            "E. coli levels are within Ontario's recreational water quality standard (≤ 200 CFU/100mL).",
        }
      : {
          label: "Water Quality Advisory",
          badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
          dotClass: "bg-amber-500",
          bannerClass: "bg-amber-50/70 border-amber-200/80 text-amber-900",
          bannerText:
            "Elevated E. coli levels detected (> 200 CFU/100mL). Swimming is not recommended.",
        };

  const formattedDate = beach.collectionDate
    ? new Date(beach.collectionDate).toLocaleDateString("en-CA", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

  const coords = parseGeometry(beach.geometry);
  const meterPercent = hasReading
    ? Math.min(Math.round((eColiNumeric / 250) * 100), 100)
    : 0;

  return (
    <div className="w-full flex flex-col items-start text-left space-y-6">
      {/* Header + Status Pill */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {beach.beachName}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Sampling Site:{" "}
            <span className="font-medium text-slate-700">{beach.siteName}</span>{" "}
            <span className="text-slate-400">• ID #{beach.beachId}</span>
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-2 self-start sm:self-auto px-3.5 py-1.5 text-xs font-semibold rounded-full border ${statusConfig.badgeClass}`}
        >
          <span className={`w-2 h-2 rounded-full ${statusConfig.dotClass}`} />
          {statusConfig.label}
        </span>
      </div>

      {/* Contextual Status Callout */}
      <div
        className={`w-full px-4 py-3 rounded-xl border text-sm ${statusConfig.bannerClass}`}
      >
        {statusConfig.bannerText}
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {/* Card 1: E. coli Level + Threshold Bar */}
        <div className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              E. coli Level
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1.5">
              {hasReading ? beach.eColi : "—"}
              {hasReading && (
                <span className="text-xs font-normal text-slate-500 ml-1">
                  CFU/100mL
                </span>
              )}
            </p>
          </div>

          {hasReading && (
            <div className="mt-3">
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    isSafe ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                  style={{ width: `${meterPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Limit: 200 CFU/100mL
              </p>
            </div>
          )}
        </div>

        {/* Card 2: Collection Date */}
        <div className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Last Sampled
            </p>
            <p className="text-lg font-bold text-slate-900 mt-1.5">
              {formattedDate}
            </p>
          </div>
          <p className="text-xs text-slate-400 mt-3">Latest lab result</p>
        </div>

        {/* Card 3: Site Name */}
        <div className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Sampling Station
            </p>
            <p className="text-base font-bold text-slate-900 mt-1.5 line-clamp-2">
              {beach.siteName || "Main Beach"}
            </p>
          </div>
          <p className="text-xs text-slate-400 mt-3">Monitoring point</p>
        </div>

        {/* Card 4: Coordinates + Maps Link */}
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
    </div>
  );
}
