import { Router } from "express";
import { listBeaches } from "../controllers/beachController.js";

const router = Router();

router.get("/", listBeaches);

export default router;
