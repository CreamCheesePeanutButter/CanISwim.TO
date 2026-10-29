import { useState } from "react";
import { Link } from "react-router-dom";

interface PoolSummary {
  _id: number;
  facilityName: string;
  address: string;
  type: string;
  insStatus: string;
  insDate: string;
}

type StatusFilter = "All" | "Pass" | "Fail";

// Mock Data (will be replaced by the API in Milestone 3)
const poolData: PoolSummary[] = [
  {
    _id: 1,
    facilityName: "YORK RECREATION CENTRE (POOL A)",
    address: "115 BLACK CREEK DR",
    type: "Indoor Pool",
    insStatus: "Pass",
    insDate: "2026-06-04",
  },
  {
    _id: 3,
    facilityName: "YORK RECREATION CENTRE (SPA B)",
    address: "115 BLACK CREEK DR",
    type: "Indoor Pool",
    insStatus: "Fail",
    insDate: "2026-01-27",
  },
  {
    _id: 4,
    facilityName: "SAMPLE LAKESIDE POOL",
    address: "10 EXAMPLE ST",
    type: "Outdoor Pool",
    insStatus: "Pass",
    insDate: "2026-07-12",
  },
  {
    _id: 5,
    facilityName: "SAMPLE COMMUNITY WADING POOL",
    address: "25 EXAMPLE AVE",
    type: "Wading Pool",
    insStatus: "Pass",
    insDate: "2026-07-03",
  },
  {
    _id: 6,
    facilityName: "SAMPLE FITNESS CLUB SPA",
    address: "300 EXAMPLE RD",
    type: "Spa",
    insStatus: "Fail",
    insDate: "2026-05-19",
  },
];

// Pool Card Component
interface PoolCardProps {
  data: PoolSummary;
  isSaved: boolean;
  onToggleSave: (id: number) => void;
}

export function PoolCard({ data, isSaved, onToggleSave }: PoolCardProps) {
  return (
    <article className="bg-white border border-gray-200 p-4 rounded-2xl flex flex-col gap-3 shadow-sm">
      <div className="flex justify-between items-start gap-2">
        <div>
          <h3 className="text-sm font-bold text-blue-900 leading-tight">
            {data.facilityName}
          </h3>
          <span className="text-xs text-gray-500 mt-0.5 block">
            {data.address}
          </span>
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

      <hr className="border-gray-100" />

      <div className="flex justify-between items-end gap-2 text-xs">
        <div>
          <span className="text-gray-400 block font-medium uppercase text-[10px] tracking-wider">
            {data.type}
          </span>
          <span className="text-gray-900 font-medium">
            Inspected {data.insDate}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onToggleSave(data._id)}
          aria-pressed={isSaved}
          aria-label={`${isSaved ? "Unsave" : "Save"} ${data.facilityName}`}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            isSaved
              ? "bg-emerald-700 text-white"
              : "border border-emerald-700 text-emerald-700 hover:bg-emerald-50"
          }`}
        >
          {isSaved ? "★ Saved" : "☆ Save"}
        </button>
      </div>
    </article>
  );
}

// Layout Integration Wrapper
export function MainPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [savedIds, setSavedIds] = useState<number[]>([]);

  const toggleSave = (id: number) => {
    setSavedIds((prev) =>
      prev.includes(id)
        ? prev.filter((savedId) => savedId !== id)
        : [...prev, id],
    );
  };

  const filteredPools =
    statusFilter === "All"
      ? poolData
      : poolData.filter((pool) => pool.insStatus === statusFilter);

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 p-4 antialiased">
      {/* Hero Section */}
      <section className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center gap-3">
        <h1 className="text-3xl font-bold">Can I swim today?</h1>
        <p>
          Check the latest SwimSafe inspection results for pools and spas in
          Toronto before you go.
        </p>
        <Link
          to="/map"
          className="bg-emerald-700 text-white font-semibold px-4 py-2 rounded-xl shadow-sm shadow-emerald-200 hover:bg-emerald-800 transition-all"
        >
          Explore the map
        </Link>
      </section>

      {/* Inspection Results */}
      <section aria-labelledby="results-title" className="flex flex-col gap-4">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div>
            <h2 id="results-title" className="text-xl font-bold text-gray-900">
              Recent Inspections
            </h2>
            <span className="text-xs text-gray-500 font-medium">
              Showing {filteredPools.length} facilities · {savedIds.length}{" "}
              saved · Sample data
            </span>
          </div>

          {/* Status Filter */}
          <div
            className="flex gap-2"
            role="group"
            aria-label="Filter by inspection status"
          >
            {(["All", "Pass", "Fail"] as StatusFilter[]).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                aria-pressed={statusFilter === status}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                  statusFilter === status
                    ? "bg-gray-900 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPools.map((pool) => (
            <PoolCard
              key={pool._id}
              data={pool}
              isSaved={savedIds.includes(pool._id)}
              onToggleSave={toggleSave}
            />
          ))}
        </div>
      </section>
    </div>
  );
}