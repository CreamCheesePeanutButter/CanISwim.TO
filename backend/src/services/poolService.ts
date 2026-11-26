import { AppError } from "../utils/AppError.ts";
import { PoolDTO } from "../DTOs/poolDTO.ts";
import { LocationDTO } from "../DTOs/locationDTO.ts";
import pino from "pino";
import Console from "pino-console";

const logger = pino({ level: "info" });
const console = new Console(logger);

//Get Location
export function getLocationListWithLastestInspection(
  poolsDTO: PoolDTO[],
): LocationDTO[] {
  const pools = getSinglePoolListWithLastestInspection(poolsDTO);
  console.log(pools);
  const locations: LocationDTO[] = pools.map(
    (pool): LocationDTO => ({
      id: pool._id,
      name: pool.facilityName,
      type: pool.type,
      isActive: pool.inspectionStatus != null,
      pass: pool.inspectionStatus == "Pass",
      geometry: pool.geometry,
    }),
  );

  return Array.from(locations.values());
}

// export interface PoolDTO {
//   id: number;
//   facilityName: string;
//   address: string;
//   type: string;
//   inspectionStatus: string;
//   lastInspectionDate: string;
//   observation: string;
//   infCategory: string;
//   defectDescription: string;
//   actionDescription: string;
//   geometry: JSON;
// }

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

  const target = pools.find((pool) => pool._id == id);

  if (target == null) return;
  return target;
}

export const poolService = {
  getSinglePoolListWithLastestInspection,
  getLocationListWithLastestInspection,
  getPoolByIdWithLatestInspection,
};
