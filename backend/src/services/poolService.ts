import { AppError } from "../utils/AppError.ts";
import { PoolDTO } from "../DTOs/poolDTO.ts";
import { LocationDTO } from "../DTOs/locationDTO.ts";

//Get Location
export function getLocationListWithLastestInspection(
  poolsDTO: PoolDTO[],
): LocationDTO[] {
  const pools = getSinglePoolListWithLastestInspection(poolsDTO);
  const locations: LocationDTO[] = pools.map(
    (pool): LocationDTO => ({
      id: pool.id,
      name: pool.facillityName,
      type: pool.type,
      isActive: pool.inspectionStatus != null,
      pass: pool.inspectionStatus == "Pass",
      geometry: pool.geometry,
    }),
  );

  return Array.from(locations.values());
}

export function getSinglePoolListWithLastestInspection(poolsDTO: PoolDTO[]) {
  const map = new Map();
  for (const pool of poolsDTO) {
    if (!map.has(pool.facilityName)) {
      map.set(pool.facilityName, pool);
    } else {
      if (
        new Date(pool.lastInspectionDate) >
        new Date(map.get(pool.facilityName).lastInspectionDate)
      ) {
        map.set(pool.facilityName, pool);
      }
    }
  }
  return Array.from(map.values());
}
export function getPoolByIdWithLatestInspection(
  poolsDTO: PoolDTO[],
  id: number,
) {
  const pools = getSinglePoolListWithLastestInspection(poolsDTO);

  const target = pools.find((pool) => pool.id == id);

  if (target == null) return;
  return target;
}

export const poolService = {
  getSinglePoolListWithLastestInspection,
  getLocationListWithLastestInspection,
  getPoolByIdWithLatestInspection,
};
