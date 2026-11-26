import type { Geometry } from "geojson";

export interface LocationDTO {
  id: number;
  name: string;
  type: string;
  isActive: boolean;
  pass: string;
  geometry: string | Geometry | null;
}
