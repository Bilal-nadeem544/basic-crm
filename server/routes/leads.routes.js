import express from "express";
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  updateLeadStage,
} from "../controllers/leads.controller.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.use(requireAuth); // saare lead routes protected hain

router.get("/", getLeads);
router.get("/:id", getLeadById);

// Sirf admin (Super Admin) hi lead add/edit/delete/stage-change kar sakta hai
router.post("/", requireAdmin, createLead);
router.put("/:id", requireAdmin, updateLead);
router.delete("/:id", requireAdmin, deleteLead);
router.put("/:id/stage", requireAdmin, updateLeadStage);

export default router;