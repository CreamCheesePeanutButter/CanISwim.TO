const BeachDTO = require("../DTOs/beachDTO.js");

function getSingleBeachListWithLastestInspection(beachesDTO) {
  const map = new Map();
  for (beach of beachesDTO) {
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

module.exports = {
  getSingleBeachListWithLastestInspection,
};
