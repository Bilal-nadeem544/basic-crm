import express from "express";
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  updateLeadStage,
} from "../controllers/leads.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.use(requireAuth); // saare lead routes protected hain

router.get("/", getLeads);
router.post("/", createLead);
router.get("/:id", getLeadById);
router.put("/:id", updateLead);
router.delete("/:id", deleteLead);
router.put("/:id/stage", updateLeadStage);

export default router;