import { Router } from "express";
import { listLocations, listPools } from "../controllers/poolController.js";

const router = Router();

router.get("/", listPools);
router.get("/locations", listLocations);

export default router;
