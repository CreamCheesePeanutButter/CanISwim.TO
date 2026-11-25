import { AppError } from "../utils/AppError.js";
import { PoolDTO } from "../DTOs/poolDTO.js";
import { getPoolsResource } from "../models/poolsModel.js";

export async function getSinglePoolListWithLastestInspection() {
  const poolsDTO = await getPoolsResource();
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
