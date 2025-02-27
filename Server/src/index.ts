import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connect from "./database/connection";
import taskRouter from "./router/taskRouter";
import cron from "node-cron";
import { Task } from "./models/taskModel";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// routes
app.get("/", (req, res) => {
	res.json({ message: "welcome 😊, Server is up and running" });
});
app.use(taskRouter);


// Run every day at midnight (00:00) to update tasks
cron.schedule("0 0 * * *", async () => {
	console.log("Running task status update...");

	const today = new Date().toISOString().split("T")[0];

	try {
		const result = await Task.updateMany(
			{ dueDate: { $lt: today }, status: { $ne: "done" } },
			{ $set: { status: "timeOut" } },
		);
		console.log(`${result.modifiedCount} tasks updated to 'timeOut'`);
	} catch (error) {
		console.error("Error updating tasks:", error);
	}
});

// start server
const PORT = process.env.PORT || 8080;

const startServer = async () => {
	try {
		// connect to database
		await connect();
		app.listen(Number(PORT), () => console.log("server started"));
	} catch (error) {
		console.error("Failed to start server:", error);
		process.exit(1);
	}
};

startServer();
