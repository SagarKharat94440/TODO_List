"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTaskById = exports.getAllTasks = void 0;
const taskModel_1 = require("../models/taskModel");
const taskSchema_1 = require("../zodSchemas/taskSchema");
// Get all tasks
const getAllTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield taskModel_1.Task.find();
        const formattedTasks = tasks.map((task) => ({
            id: task._id,
            title: task.title,
            description: task.description,
            status: task.status,
            dueDate: task.dueDate,
        }));
        res.json(formattedTasks);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getAllTasks = getAllTasks;
// Get task by ID
const getTaskById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield taskModel_1.Task.findById(req.params.id);
        if (!task) {
            res.status(404).json({ message: "Task not found" });
            return;
        }
        res.json(task);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getTaskById = getTaskById;
// Create new task with validation
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validation = taskSchema_1.taskSchema.safeParse(req.body);
    if (!validation.success) {
        res.status(400).json({ errors: validation.error.errors });
        return;
    }
    try {
        const task = new taskModel_1.Task(req.body);
        const newTask = yield task.save();
        res.status(201).json(newTask);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createTask = createTask;
// Update task with validation
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validation = taskSchema_1.taskSchema.safeParse(req.body);
    if (!validation.success) {
        res.status(400).json({ errors: validation.error.errors });
        return;
    }
    try {
        const task = yield taskModel_1.Task.findById(req.params.id);
        if (!task) {
            res.status(404).json({ message: "Task not found" });
            return;
        }
        Object.assign(task, req.body);
        const updatedTask = yield task.save();
        res.json(updatedTask);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateTask = updateTask;
// Delete task
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield taskModel_1.Task.findById(req.params.id);
        if (!task) {
            res.status(404).json({ message: "Task not found" });
            return;
        }
        yield taskModel_1.Task.deleteOne({ _id: req.params.id });
        res.json({ message: "Task deleted" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteTask = deleteTask;
