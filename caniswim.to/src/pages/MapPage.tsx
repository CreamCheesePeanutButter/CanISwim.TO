import pnutAvt from "../assets/dummy/pnutAvt.png";
import SwimSafeMap from "../components/MapComponent";
// import type { SwimSafeProperties } from "../types/SwimSafeProperties";
import { useState } from "react";

//Import components
import { FacilityCard } from "../components/FacilitiyCard";
import ShorelineMapHeader from "../components/MapHeader";
import type { LocationDTO } from "../DTOs/LocationDTO";

// Layout Integration Wrapper
export function MapPage() {
  const [selectedFacility, setSelectedFacility] = useState<LocationDTO | null>(
    null,
  );

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
            <h2>Toronto Map</h2>
            <p className="text-xs text-gray-500 mt-1 font-medium">
              SwimSafe Inspection Hub
            </p>
          </div>
        </div>

        <hr className="border-gray-100" />
        {selectedFacility ? (
          <div className="flex flex-col gap-2 bg-gray-50 p-3 rounded-2xl border border-gray-100">
            <div className="flex justify-between items-center">
              <div className="flex bg-green-100 p-2 rounded gap-2 items-center text-green-800">
                <svg
                  xmlns="http://w3.org"
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
          </div>
        ) : (
          <div className="mt-2 text-sm text-gray-600">
            Click markers on the map to review historic safety records, minor
            infractions, and compliance statuses.
          </div>
        )}

        {/* Modular Information Card Mounted on Left Side Bar */}
        <div className="flex-1 flex flex-col">
          <FacilityCard
            facilityName={selectedFacility ? selectedFacility.name : "None"}
          />
        </div>
      </div>

      {/* Primary Map Application Display */}
      <div className="w-3/4 h-[calc(100vh-32px)] flex flex-col gap-4">
        <ShorelineMapHeader
          id={selectedFacility?.id}
          title={selectedFacility ? selectedFacility.name : "Select a location"}
          locationType={selectedFacility ? selectedFacility.type : "None"}
          isActive={selectedFacility ? selectedFacility.isActive : false}
          pass={selectedFacility ? String(selectedFacility.pass) : "None"}
        />
        <SwimSafeMap onSelectFeature={setSelectedFacility} />
      </div>
    </div>
  );
}
