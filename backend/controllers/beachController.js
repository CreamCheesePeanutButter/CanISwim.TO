// controllers/beachController.js
const beachModel = require("../models/beachModel.js");
const BeachDTO = require("../DTOs/beachDTO.js");
const beachService = require("../services/beachService.js");

const listBeaches = async (req, res) => {
  try {
    const beachResource = await beachModel.getBeachesResource();
    const beachesDTO = [];
    // console.log(beachResource);
    for (const resource of beachResource) {
      const beachDTO = new BeachDTO(
        resource._id,
        resource.facilityName,
        resource.address,
        resource.type,
        resource.insStatus,
        resource.insDate,
        resource.observation,
        resource.infCategory,
        resource.defDesc,
        resource.actionDesc,
        resource.geometry,
      );
      beachesDTO.push(beachDTO);
    }
    // for (const beach of beachesDTO) {
    //   console.log(beach.facilityName);
    // }
    const result =
      beachService.getSingleBeachListWithLastestInspection(beachesDTO);
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch Toronto beach GeoJSON",
      details: error.message,
    });
  }
};

// const getSingleBeach = async (req, res) => {
//   try {
//     const feature = await beachModel.getBeachById(req.params.id);

//     if (!feature) {
//       return res.status(404).json({ error: "Beach feature not found" });
//     }

//     res.status(200).json(feature);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "Failed to fetch beach details", details: error.message });
//   }
// };

module.exports = {
  listBeaches,
  // getSingleBeach,
};
