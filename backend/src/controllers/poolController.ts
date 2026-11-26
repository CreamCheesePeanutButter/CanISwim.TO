import { Request, Response, NextFunction } from "express";
import { getPoolsResource } from "../models/poolsModel.js";
import type { PoolDTO } from "../DTOs/poolDTO.js";
import { poolService } from "../services/poolService.js";

export const listPools = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { id } = req.query;
  try {
    const poolResource = await getPoolsResource();

    if (id) {
      // Do NOT redeclare `const { id } = req.params` here
      const result = poolService.getPoolByIdWithLatestInspection(
        poolResource,
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
      await poolService.getSinglePoolListWithLastestInspection(poolResource);

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
    const poolsResource = await getPoolsResource();

    const result =
      poolService.getLocationListWithLastestInspection(poolsResource);

    res.status(200).json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    res.status(500).json({
      error: "Failed to fetch Toronto pool GeoJSON",
      details: message,
    });
  }
};
