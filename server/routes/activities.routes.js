import express from "express";
import {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
} from "../controllers/activities.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router({ mergeParams: true });

router.use(requireAuth);

router.get("/", getActivities);
router.post("/", createActivity);
router.put("/:id", updateActivity);
router.delete("/:id", deleteActivity);

export default router;