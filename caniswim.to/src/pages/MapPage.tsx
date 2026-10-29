import { useState } from "react";
import { Layer } from "leaflet";
import type { Feature, Geometry } from "geojson";
import "leaflet/dist/leaflet.css";
import type { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";

interface SwimSafeProperties {
  _id: number;
  facilityName: string;
  address: string;
  estName: string;
  type: string;
  insStatus: string;
  insDate: string;
  observation: string;
  infCategory: string;
  defDesc: string;
  actionDesc: string;
}

// 1. Separate Facility Card Component
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

// 2. Map Setup with Mock Data
const swimSafeData = {
  type: "FeatureCollection" as const,
  name: "Swimsafe-4326",
  crs: {
    type: "name",
    properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
  },
  features: [
    {
      type: "Feature" as const,
      properties: {
        _id: 1,
        unique_id: "0543c99e46f9846674f4e7767d2c0903",
        facilityName: "YORK RECREATION CENTRE (POOL A)",
        address: "115 BLACK CREEK DR",
        estName: "YORK RECREATION CENTRE LANE POOL",
        type: "Indoor Pool",
        insStatus: "Pass",
        insDate: "2026-06-04",
        observation:
          "No infractions were observed under the SwimSafe Regulation during an inspection.",
        infCategory: "None",
        defDesc: "None",
        infType: "None",
        actionDesc: "None",
      },
      geometry: {
        type: "MultiPoint" as const,
        coordinates: [[-79.48129, 43.68614]],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        _id: 3,
        unique_id: "de48f9e93182e516171d73184d4e6bb7",
        facilityName: "YORK RECREATION CENTRE (SPA B)",
        address: "115 BLACK CREEK DR",
        estName: "YORK RECREATION CENTRE SPA",
        type: "Indoor Pool",
        insStatus: "Fail",
        insDate: "2026-01-27",
        observation:
          "One or more minor infractions were observed under the SwimSafe Regulation during an inspection.",
        infCategory: "4. MAINTENANCE/PROVISION OF POOL/SPA, DECK AND EQUIPMENT",
        defDesc:
          "Fail to ensure perimeter of pool deck clearly delineated where contiguous area may be confused with pool deck. Section 6 (6) (e)",
        infType: "M - Minor",
        actionDesc: "Notice to Comply",
      },
      geometry: {
        type: "MultiPoint" as const,
        coordinates: [[-79.48429, 43.68814]],
      },
    },
  ],
};

interface SwimSafeMapProps {
  onSelectFeature: (properties: SwimSafeProperties) => void;
}

export default function SwimSafeMap({ onSelectFeature }: SwimSafeMapProps) {
  const mapCenter: LatLngExpression = [43.68614, -79.48129];
  const zoomLevel = 15;

  const onEachFeature = (
    feature: Feature<Geometry, SwimSafeProperties>,
    layer: Layer,
  ) => {
    layer.on({
      click: () => {
        if (feature.properties) {
          onSelectFeature(feature.properties);
        }
      },
    });
  };

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-inner border border-gray-200">
      <MapContainer
        center={mapCenter}
        zoom={zoomLevel}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON
          key="swimsafe-layer"
          data={swimSafeData}
          onEachFeature={onEachFeature}
        />
      </MapContainer>
    </div>
  );
}

// 3. Layout Integration Wrapper
export function MapPage() {
  const [selectedFacility, setSelectedFacility] =
    useState<SwimSafeProperties | null>(null);

  return (
    <div className="flex gap-4 p-4 min-h-screen bg-gray-50 antialiased">
      {/* Sidebar Navigation */}
      <div className="w-1/4 bg-white p-4 flex flex-col gap-4 rounded-2xl border border-gray-200 shadow-sm">
        {/* Header Branding */}
        <div className="flex items-center gap-3">
          <div className="bg-emerald-700 p-2 rounded-xl text-white shadow-sm shadow-emerald-200">
            <svg
              xmlns="http://w3.org"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 leading-none">
              Toronto Map
            </h2>
            <p className="text-xs text-gray-500 mt-1 font-medium">
              SwimSafe Inspection Hub
            </p>
          </div>
        </div>

        <hr className="border-gray-100" />
        <div className="flex flex-col gap-2 bg-gray-50 p-3 rounded-2xl border border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex bg-green-100 p-2 rounded gap-2 items-center text-green-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-image"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Features
            </span>
          </div>
          <div className="max-w-md mx-auto overflow-hidden rounded-xl shadow-md">
            <img
              className="w-full h-64 object-cover"
              src="./assets/dummy/pnutAvt.png"
              alt="Peanut Butter"
            />
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Click markers on the map to review historic safety records, minor
            infractions, and compliance statuses.
          </div>
        </div>
        {/* Modular Information Card Mounted on Left Side Bar */}
        <div className="flex-1 flex flex-col">
          <FacilityCard data={selectedFacility} />
        </div>
      </div>

      {/* Primary Map Application Display */}
      <div className="w-3/4 h-[calc(100vh-2rem)]">
        <SwimSafeMap onSelectFeature={setSelectedFacility} />
      </div>
    </div>
  );
}
