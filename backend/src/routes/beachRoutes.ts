import { Router } from "express";
import { listBeaches, listLocations } from "../controllers/beachController.ts";

const router = Router();

router.get("/", listBeaches);
router.get("/locations", listLocations);

export default router;
