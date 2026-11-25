import { Request, Response, NextFunction } from "express";
import { beachService } from "../services/beachService.ts";
import { getBeachesResource } from "../models/beachesModel";

export const listBeaches = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const beachesResource = await getBeachesResource();

    // const poolsDTO: PoolDTO[] = poolResource.map((resource) => ({
    //   id: resource.id,
    //   facilityName: resource.facilityName,
    //   address: resource.address,
    //   type: resource.type,
    //   inspectionStatus: resource.inspectionStatus,
    //   lastInspectionDate: resource.lastInspectionDate,
    //   observation: resource.observation,
    //   infCategory: resource.infCategory,
    //   defectDescription: resource.defectDescription,
    //   actionDescription: resource.actionDescription,
    //   geometry: resource.geometry,
    // }));

    const result =
      beachService.getSingleBeachListWithLastestInspection(beachesResource);

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
