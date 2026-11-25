import { Request, Response, NextFunction } from "express";
import { getBeachesResource } from "../models/beachesModel.js";
import type { BeachDTO } from "../DTOs/beachDTO.js";
import { getSingleBeachListWithLastestInspection } from "../services/beachService.js";

export const listBeaches = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // 1. Fetch raw records from the model
    const beachResource = await getBeachesResource();

    // 2. Map raw records to plain objects matching the BeachDTO interface
    const beachesDTO: BeachDTO[] = beachResource.map((resource) => ({
      id: resource.id,
      facilityName: resource.facilityName,
      address: resource.address,
      type: resource.type,
      inspectionStatus: resource.inspectionStatus,
      lastInspectionDate: resource.lastInspectionDate,
      observation: resource.observation,
      infCategory: resource.infCategory,
      defectDescription: resource.defectDescription,
      actionDescription: resource.actionDescription,
      geometry: resource.geometry,
    }));

    // 3. Apply business logic via the service
    const result = await getSingleBeachListWithLastestInspection();

    // 4. Send formatted HTTP response
    res.status(200).json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    res.status(500).json({
      error: "Failed to fetch Toronto beach GeoJSON",
      details: message,
    });
  }
};
