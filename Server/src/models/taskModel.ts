import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		required: true,
		enum: ["todo", "onProgress", "done", "timeOut"],
	},
	dueDate: {
		type: String,
		required: true,
	},
});

export const Task = mongoose.model("Task", taskSchema);
