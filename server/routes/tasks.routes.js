import express from "express";
import {
  getAllTasks,
  createTask,
  updateTask,
  completeTask,
  deleteTask,
} from "../controllers/tasks.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", getAllTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.put("/:id/complete", completeTask);
router.delete("/:id", deleteTask);

export default router;