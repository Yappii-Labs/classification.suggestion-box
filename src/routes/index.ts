import { Router } from "express";
import { getClassifications } from "../controllers/suggestions.controller";

const router = Router();
router.post("/suggestions", getClassifications);

export default router;
