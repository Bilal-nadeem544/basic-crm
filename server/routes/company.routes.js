import express from "express";
import { getCompanySettings, updateCompanySettings } from "../controllers/company.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", requireAuth, getCompanySettings);
router.put("/", requireAuth, updateCompanySettings);

export default router;