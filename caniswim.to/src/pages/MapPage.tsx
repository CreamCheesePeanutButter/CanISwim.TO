import { useState } from "react";
import { Layer } from "leaflet";
import type { Feature, Geometry } from "geojson";
import "leaflet/dist/leaflet.css";
import type { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";

// import types
import type { SwimSafeProperties } from "../types/SwimSafeProperties";
// import image
import pnutAvt from "../assets/dummy/pnutAvt.png";
import { FacilityCard } from "../components/FacilitiyCard";
// import swimSafeData from "../assets/dummy/map/Swimsafe-4326.json";

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
  // latestGeoJsonData: FeatureCollection<Geometry, SwimSafeProperties>;
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
            {/* Icon copy from open Icon */}
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
              src={pnutAvt}
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
