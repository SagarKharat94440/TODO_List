import { Request, Response } from "express";
import { Task } from "../models/taskModel";
import { taskSchema } from "../zodSchemas/taskSchema";

// Get all tasks
export const getAllTasks = async (req: Request, res: Response): Promise<void> => {
	try {
		const tasks = await Task.find();
		const formattedTasks = tasks.map((task) => ({
			id: task._id,
			title: task.title,
			description: task.description,
			status: task.status,
			dueDate: task.dueDate,
		}));
		res.json(formattedTasks);
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
};

// Get task by ID
export const getTaskById = async (req: Request, res: Response): Promise<void> => {
	try {
		const task = await Task.findById(req.params.id);
		if (!task) {
			res.status(404).json({ message: "Task not found" });
			return;
		}
		res.json(task);
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
};

// Create new task with validation
export const createTask = async (req: Request, res: Response): Promise<void> => {
	const validation = taskSchema.safeParse(req.body);
	if (!validation.success) {
		res.status(400).json({ errors: validation.error.errors });
		return;
	}

	try {
		const task = new Task(req.body);
		const newTask = await task.save();
		res.status(201).json(newTask);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

// Update task with validation
export const updateTask = async (req: Request, res: Response): Promise<void> => {
	const validation = taskSchema.safeParse(req.body);
	if (!validation.success) {
		res.status(400).json({ errors: validation.error.errors });
		return;
	}

	try {
		const task = await Task.findById(req.params.id);
		if (!task) {
			res.status(404).json({ message: "Task not found" });
			return;
		}

		Object.assign(task, req.body);
		const updatedTask = await task.save();
		res.json(updatedTask);
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
};

// Delete task
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
	try {
		const task = await Task.findById(req.params.id);
		if (!task) {
			res.status(404).json({ message: "Task not found" });
			return;
		}

		await Task.deleteOne({ _id: req.params.id });
		res.json({ message: "Task deleted" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Internal server error" });
	}
};
