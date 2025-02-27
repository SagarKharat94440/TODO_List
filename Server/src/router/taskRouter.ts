import express from "express";
import { getAllTasks, getTaskById, createTask, updateTask, deleteTask } from "../controller/taskController";

const router = express.Router();

// Define routes with controller functions
router.get("/tasks", getAllTasks);
router.get("/tasks/:id", getTaskById);
router.post("/tasks", createTask);
router.put("/tasks/:id", updateTask);
router.delete("/tasks/:id", deleteTask);

export default router;
