import { Request, Response, NextFunction } from "express";
import { getPoolsResource } from "../models/poolsModel.js";
import type { PoolDTO } from "../DTOs/poolDTO.js";
import { getSinglePoolListWithLastestInspection } from "../services/poolService.js";

export const listPools = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // const poolResource = await getBeachesResource();

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

    const result = await getSinglePoolListWithLastestInspection();

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
