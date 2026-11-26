import type { Geometry } from "geojson";
export interface BeachDTO {
  id: number;
  beachId: number;
  beachName: string;
  siteName: string;
  collectionDate: string;
  eColi: string;
  geometry: string | Geometry | null;
}
