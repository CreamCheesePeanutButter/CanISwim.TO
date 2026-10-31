import type { SwimSafeProperties } from "../types/SwimSafeProperties";

interface FacilityCardProps {
  data: SwimSafeProperties | null;
}

export function FacilityCard({ data }: FacilityCardProps) {
  if (!data) {
    return (
      <div className="flex-1 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center text-gray-400">
        <svg
          xmlns="http://w3.org"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mb-2 opacity-60"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
        <p className="text-sm font-medium">No Facility Selected</p>
        <p className="text-xs text-gray-400 mt-1">
          Click a marker on the map to inspect safety reports.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex flex-col gap-3 shadow-sm transition-all">
      <div className="flex justify-between items-start gap-2">
        <div>
          <h3 className="text-sm font-bold text-blue-900 leading-tight">
            {data.facilityName}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">{data.address}</p>
        </div>
        <span
          className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide shrink-0 ${
            data.insStatus === "Pass"
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          {data.insStatus}
        </span>
      </div>

      <hr className="border-blue-100" />

      <div className="text-xs text-gray-700 flex flex-col gap-2">
        <div>
          <span className="text-gray-400 block font-medium uppercase text-[10px] tracking-wider">
            Establishment Type
          </span>
          <span className="text-gray-900 font-medium">{data.type}</span>
        </div>

        <div>
          <span className="text-gray-400 block font-medium uppercase text-[10px] tracking-wider">
            Inspection Date
          </span>
          <span className="text-gray-900 font-medium">{data.insDate}</span>
        </div>

        <div>
          <span className="text-gray-400 block font-medium uppercase text-[10px] tracking-wider">
            Official Observation
          </span>
          <p className="text-gray-600 mt-0.5 leading-relaxed">
            {data.observation}
          </p>
        </div>

        {data.defDesc !== "None" && (
          <div className="mt-1 p-2.5 bg-amber-50 rounded-xl text-amber-900 border border-amber-200 text-[11px] leading-relaxed">
            <strong className="text-amber-800 block text-[10px] uppercase tracking-wider mb-0.5">
              Detected Infraction:
            </strong>
            {data.defDesc}
          </div>
        )}

        {data.actionDesc !== "None" && (
          <div className="p-2 bg-gray-100 rounded-xl text-gray-800 text-[11px]">
            <strong className="text-gray-500 uppercase text-[9px] tracking-wider block">
              Required Enforcement Action:
            </strong>
            <span className="font-semibold text-gray-900">
              {data.actionDesc}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
