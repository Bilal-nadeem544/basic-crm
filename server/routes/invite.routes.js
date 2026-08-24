import express from "express";

import { createInvite } from "../controllers/invite.controller.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/",
  requireAuth,
  requireAdmin,
  createInvite
);

export default router;