import type { BeachDTO } from "../DTOs/beachDTO.ts";

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

// Export as an object if your controller calls `beachService.getSingleBeachListWithLastestInspection(...)`
export const beachService = {
  getSingleBeachListWithLastestInspection,
};
