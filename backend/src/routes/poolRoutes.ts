import { Router } from "express";
import { listPools } from "../controllers/poolController.js";

const router = Router();

router.get("/", listPools);

export default router;
