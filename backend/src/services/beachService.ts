import type { BeachDTO } from "../DTOs/beachDTO.ts";
import type { LocationDTO } from "../DTOs/locationDTO.ts";
export function getSingleBeachListWithLastestInspection(
  beachesDTO: BeachDTO[],
): BeachDTO[] {
  const latestByBeach = new Map<string, BeachDTO>();
  for (const beach of beachesDTO) {
    const existing = latestByBeach.get(beach.beachName);
    if (!existing) {
      latestByBeach.set(beach.beachName, beach);
    } else if (
      new Date(beach.collectionDate).getTime() >
      new Date(existing.collectionDate).getTime()
    ) {
      latestByBeach.set(beach.beachName, beach);
    }
  }
  return Array.from(latestByBeach.values());
}
export function getLocationListWithLastestInspection(
  beachesDTO: BeachDTO[],
): LocationDTO[] {
  const beaches = getSingleBeachListWithLastestInspection(beachesDTO);
  const locations: LocationDTO[] = beaches.map(
    (beach): LocationDTO => ({
      id: beach.beachId,
      name: beach.beachName,
      type: "Beach",
      isActive: beach.eColi != null,
      pass: beach.eColi > 100,
      geometry: beach.geometry,
    }),
  );
  return Array.from(locations.values());
}
export function getBeachByIdWithLatestInspection(
  beachesDTO: BeachDTO[],
  id: number,
) {
  const beaches = getSingleBeachListWithLastestInspection(beachesDTO);
  const target = beaches.find((beach) => beach.beachId == id);
  if (target == null) return;
  return target;
} // Export as an object if your controller calls `beachService.getSingleBeachListWithLastestInspection(...)`
export const beachService = {
  getSingleBeachListWithLastestInspection,
  getLocationListWithLastestInspection,
  getBeachByIdWithLatestInspection,
};
