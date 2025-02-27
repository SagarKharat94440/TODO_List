"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskController_1 = require("../controller/taskController");
const router = express_1.default.Router();
// Define routes with controller functions
router.get("/tasks", taskController_1.getAllTasks);
router.get("/tasks/:id", taskController_1.getTaskById);
router.post("/tasks", taskController_1.createTask);
router.put("/tasks/:id", taskController_1.updateTask);
router.delete("/tasks/:id", taskController_1.deleteTask);
exports.default = router;
