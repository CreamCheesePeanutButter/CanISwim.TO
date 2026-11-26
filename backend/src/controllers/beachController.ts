import { Request, Response, NextFunction } from "express";
import { beachService } from "../services/beachService.ts";
import { getBeachesResource } from "../models/beachesModel";

export const listBeaches = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { id } = req.query;

  try {
    const beachesResource = await getBeachesResource();

    if (id) {
      // Do NOT redeclare `const { id } = req.params` here
      const result = beachService.getBeachByIdWithLatestInspection(
        beachesResource,
        Number(id),
      );

      if (!result) {
        res.status(404).json({ message: "Beach not found" });
        return;
      }

      res.status(200).json(result);
      return; // Stop execution so the code below doesn't run too
    }

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

export const listLocations = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const beachesResource = await getBeachesResource();

    const result =
      beachService.getLocationListWithLastestInspection(beachesResource);

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
