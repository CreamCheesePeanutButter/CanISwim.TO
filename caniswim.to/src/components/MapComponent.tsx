import { useEffect, useMemo, useState } from "react";
import L, { Layer } from "leaflet";
import type { Feature, FeatureCollection, Geometry, Point } from "geojson";
import "leaflet/dist/leaflet.css";
import type { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import type { SwimSafeProperties } from "../types/SwimSafeProperties";
import type { LocationDTO } from "../DTOs/LocationDTO";

interface SwimSafeMapProps {
  onSelectFeature: (properties: LocationDTO) => void;
}

// Helper to create custom colored SVG pins
function createPinIcon(color: string, label: string) {
  return L.divIcon({
    className: "custom-map-pin",
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.35);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="
          transform: rotate(45deg);
          color: white;
          font-size: 13px;
          font-weight: bold;
          line-height: 1;
        ">${label}</span>
      </div>
    `,
    // iconSize:10,
    // iconAnchor:,
    popupAnchor: [0, -30],
  });
}

const poolIcon = createPinIcon("#0284c7", "P"); // Sky blue pin for pools
const beachIcon = createPinIcon("#f59e0b", "B"); // Amber/Gold pin for beaches

// Helper to safely parse stringified or object GeoJSON geometry
function parseGeometry(rawGeometry: unknown): Geometry | null {
  if (!rawGeometry) return null;
  return typeof rawGeometry === "string"
    ? (JSON.parse(rawGeometry) as Geometry)
    : (rawGeometry as Geometry);
}

export default function SwimSafeMap({ onSelectFeature }: SwimSafeMapProps) {
  const [pools, setPools] = useState<LocationDTO[]>([]);
  const [beaches, setBeaches] = useState<LocationDTO[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const mapCenter: LatLngExpression = [43.68614, -79.48129];
  const zoomLevel = 12;

  useEffect(() => {
    const controller = new AbortController();

    async function fetchAllLocations() {
      try {
        setLoading(true);
        setError(null);

        const [beachesRes, poolsRes] = await Promise.all([
          fetch("http://localhost:3000/beaches/locations", {
            signal: controller.signal,
          }),
          fetch("http://localhost:3000/pools/locations", {
            signal: controller.signal,
          }),
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

        const [beachesData, poolsData]: [LocationDTO[], LocationDTO[]] =
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
            category: "pool",
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
            category: "beach",
          } as unknown as SwimSafeProperties,
        };
      });

    return {
      type: "FeatureCollection",
      features: [...poolFeatures, ...beachFeatures],
    };
  }, [pools, beaches]);

  // Assign custom icon based on feature category
  const pointToLayer = (
    feature: Feature<Point, SwimSafeProperties>,
    latlng: L.LatLng,
  ): Layer => {
    const icon = feature.properties?.type === "Beach" ? beachIcon : poolIcon;
    return L.marker(latlng, { icon });
  };

  const onEachFeature = (
    feature: Feature<Geometry, LocationDTO>,
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
        <div className="absolute top-3 right-3 z-[1000] bg-white/90 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 shadow">
          Loading pools & beaches...
        </div>
      )}

      {/* Map Legend */}
      <div className="absolute bottom-5 left-3 z-[1000] bg-white/95 px-3 py-2 rounded-xl shadow-md border border-gray-200 text-xs font-medium text-gray-700 flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-sky-600 inline-block" />
          <span>Pools</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
          <span>Beaches</span>
        </div>
      </div>

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
            pointToLayer={pointToLayer}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>
    </div>
  );
}
