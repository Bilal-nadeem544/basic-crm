import express from "express";
import { getUsers, updateProfile } from "../controllers/users.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", requireAuth, getUsers);
router.put("/me", requireAuth, updateProfile);

export default router;