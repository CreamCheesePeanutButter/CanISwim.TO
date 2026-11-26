import { useEffect, useMemo, useState } from "react";
import { Layer } from "leaflet";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import "leaflet/dist/leaflet.css";
import type { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";

// Import types & DTOs
import type { SwimSafeProperties } from "../types/SwimSafeProperties";
import type { PoolDTO } from "../DTOs/PoolDTO";
import type { BeachDTO } from "../DTOs/BeachDTO";

//Import components
import { FacilityCard } from "../components/FacilitiyCard";
import ShorelineMapHeader from "../components/MapHeader";
interface SwimSafeMapProps {
  onSelectFeature: (properties: SwimSafeProperties) => void;
}

// Helper to safely parse stringified or object GeoJSON geometry
function parseGeometry(rawGeometry: unknown): Geometry | null {
  if (!rawGeometry) return null;
  return typeof rawGeometry === "string"
    ? (JSON.parse(rawGeometry) as Geometry)
    : (rawGeometry as Geometry);
}

export default function SwimSafeMap({ onSelectFeature }: SwimSafeMapProps) {
  const [pools, setPools] = useState<PoolDTO[]>([]);
  const [beaches, setBeaches] = useState<BeachDTO[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Map variables (Zoom 11-12 frames Toronto's shoreline & pools well)
  const mapCenter: LatLngExpression = [43.68614, -79.48129];
  const zoomLevel = 12;

  useEffect(() => {
    const controller = new AbortController();

    async function fetchAllLocations() {
      try {
        setLoading(true);
        setError(null);

        // Fetch both endpoints in parallel
        const [beachesRes, poolsRes] = await Promise.all([
          fetch("http://localhost:3000/beaches", { signal: controller.signal }),
          fetch("http://localhost:3000/pools", { signal: controller.signal }),
        ]);

        if (!beachesRes.ok) {
          throw new Error(
            `Beaches error: ${beachesRes.status} ${beachesRes.statusText}`,
          );
        }
        if (!poolsRes.ok) {
          throw new Error(
            `Pools error: ${poolsRes.status} ${poolsRes.statusText}`,
          );
        }

        const [beachesData, poolsData]: [BeachDTO[], PoolDTO[]] =
          await Promise.all([beachesRes.json(), poolsRes.json()]);

        setBeaches(beachesData);
        setPools(poolsData);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchAllLocations();
    return () => controller.abort();
  }, []);

  // Merge both Pools and Beaches into a single GeoJSON FeatureCollection
  const geoJsonData = useMemo<
    FeatureCollection<Geometry, SwimSafeProperties>
  >(() => {
    const poolFeatures: Feature<Geometry, SwimSafeProperties>[] = pools
      .filter((pool) => Boolean(pool.geometry))
      .map((pool) => {
        const parsedGeometry = parseGeometry(pool.geometry)!;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { geometry: _geometry, ...properties } = pool;

        return {
          type: "Feature",
          id: `pool-${pool.id}`,
          geometry: parsedGeometry,
          properties: {
            ...properties,
            category: "pool", // Helpful tag for FacilityCard rendering
          } as unknown as SwimSafeProperties,
        };
      });

    const beachFeatures: Feature<Geometry, SwimSafeProperties>[] = beaches
      .filter((beach) => Boolean(beach.geometry))
      .map((beach) => {
        const parsedGeometry = parseGeometry(beach.geometry)!;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { geometry: _geometry, ...properties } = beach;

        return {
          type: "Feature",
          id: `beach-${beach.id}`,
          geometry: parsedGeometry,
          properties: {
            ...properties,
            category: "beach", // Helpful tag for FacilityCard rendering
          } as unknown as SwimSafeProperties,
        };
      });

    return {
      type: "FeatureCollection",
      features: [...poolFeatures, ...beachFeatures],
    };
  }, [pools, beaches]);

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

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center rounded-2xl border border-red-200 bg-red-50 text-red-700 p-4">
        Failed to load map data: {error}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-inner border border-gray-200">
      {loading && (
        <div className="absolute top-3 right-3 z- bg-white/90 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 shadow">
          Loading pools & beaches...
        </div>
      )}

      <MapContainer
        center={mapCenter}
        zoom={zoomLevel}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {geoJsonData.features.length > 0 && (
          <GeoJSON
            key={`swimsafe-layer-${geoJsonData.features.length}`}
            data={geoJsonData}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>
    </div>
  );
}

// Layout Integration Wrapper
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
            <h2>Toronto Map</h2>
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
            {/* <img
              className="w-full h-64 object-cover"
              src={pnutAvt}
              alt="Peanut Butter"
            /> */}
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
      <div className="w-3/4 h-[calc(100vh-32px)] flex flex-col gap-4">
        <ShorelineMapHeader />
        <SwimSafeMap onSelectFeature={setSelectedFacility} />
      </div>
    </div>
  );
}
