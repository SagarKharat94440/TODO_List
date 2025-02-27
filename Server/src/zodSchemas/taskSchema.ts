import { z } from "zod";

export const taskSchema = z.object({
	title: z.string().min(3, "Title must be at least 3 characters"),
	description: z.string().min(5, "Description must be at least 5 characters"),
	status: z.enum(["todo", "onProgress", "done", "timeOut"]),
	dueDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
		message: "Invalid date format",
	}),
});
