import { Router } from "express";
import { listBeaches } from "../controllers/beachController.ts";

const router = Router();

router.get("/", listBeaches);

export default router;
