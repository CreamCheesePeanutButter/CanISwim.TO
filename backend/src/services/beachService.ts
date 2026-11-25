import { AppError } from "../utils/AppError.js";
import { BeachDTO } from "../DTOs/beachDTO.js";
import { getBeachesResource } from "../models/beachesModel.js";

export async function getSingleBeachListWithLastestInspection() {
  const beachesDTO = await getBeachesResource();
  const map = new Map();
  for (const beach of beachesDTO) {
    if (!map.has(beach.facilityName)) {
      map.set(beach.facilityName, beach);
    } else {
      if (
        new Date(beach.lastInspectionDate) >
        new Date(map.get(beach.facilityName).lastInspectionDate)
      ) {
        map.set(beach.facilityName, beach);
      }
    }
  }
  return Array.from(map.values());
}
