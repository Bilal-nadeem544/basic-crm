import express from "express";
import { getUsers } from "../controllers/users.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", requireAuth, getUsers);

export default router;