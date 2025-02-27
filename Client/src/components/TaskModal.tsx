// Task Modal Component

import { useEffect, useState } from "react";
import { Task, useTaskStore } from "../stores/taskStore";
import SuccessModal from "./SuccessModal";

interface TaskModalProps {
	isOpen: boolean;
	onClose: () => void;
	task?: Task | null;
	mode: "add" | "edit";
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, task, mode }) => {
	const { createTask, updateTaskById } = useTaskStore();
	const [taskData, setTaskData] = useState({
		title: "",
		description: "",
		dueDate: "",
		status: "todo",
	});
	const [successModalOpen, setSuccessModalOpen] = useState(false);

	useEffect(() => {
		if (task && mode === "edit") {
			setTaskData({
				title: task.title || "",
				description: task.description || "",
				dueDate: task.dueDate || "",
				status: task.status || "todo",
			});
		} else {
			setTaskData({
				title: "",
				description: "",
				dueDate: "",
				status: "todo",
			});
		}
	}, [task, mode, isOpen]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setTaskData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			if (mode === "add") {
				await createTask(taskData);
				setSuccessModalOpen(true);
			} else if (mode === "edit" && task) {
				await updateTaskById(task.id, taskData);
				onClose();
			}
		} catch (error) {
			console.error("Error saving task:", error);
		}
	};

	if (!isOpen) return null;

	return (
		<>
			<div className="fixed inset-0 bg-[#00000030] bg-opacity-50 z-40 flex items-center justify-center">
				<div className="z-50 p-4 max-h-screen overflow-y-auto bg-white rounded-xl w-[350px]">
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center">
							<span className="h-2 w-2 bg-teal-400 rounded-full mr-2"></span>
							<h2 className="text-lg font-medium">{mode === "add" ? "ADD TASK" : "EDIT TASK"}</h2>
						</div>
						<button onClick={onClose} className="text-blue-500">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>

					<form onSubmit={handleSubmit}>
						<div className="mb-4">
							<label className="block text-sm font-medium mb-1">TASK NAME</label>
							<input
								type="text"
								name="title"
								value={taskData.title}
								onChange={handleChange}
								className="w-full border-b border-gray-300 pb-2 focus:outline-none focus:border-blue-500"
								placeholder="Enter task name"
								required
							/>
						</div>

						<div className="mb-4">
							<label className="block text-sm font-medium mb-1">DESCRIPTION</label>
							<textarea
								name="description"
								value={taskData.description}
								onChange={handleChange}
								className="w-full border-b border-gray-300 pb-2 focus:outline-none focus:border-blue-500 min-h-24"
								placeholder="Enter task description"
							/>
						</div>

						<div className="grid grid-cols-2 gap-4 mb-6">
							<div>
								<label className="block text-sm font-medium mb-1">DEADLINE</label>
								<input
									type="date"
									name="dueDate"
									value={taskData.dueDate}
									onChange={handleChange}
									min={new Date().toISOString().split("T")[0]} // Sets min date to today
									className="w-full border-b border-gray-300 pb-2 focus:outline-none focus:border-blue-500"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium mb-1">STATUS</label>
								<select
									name="status"
									value={taskData.status}
									onChange={handleChange}
									className="w-full border-b border-gray-300 pb-2 focus:outline-none focus:border-blue-500"
								>
									<option value="todo">todo</option>
									<option value="onProgress">onProgress</option>
									<option value="done">done</option>
									<option value="timeOut">Time Out</option>
								</select>
							</div>
						</div>

						<button
							type="submit"
							className="w-full bg-blue-500 text-white py-3 rounded-lg flex items-center justify-center"
						>
							{mode === "add" ? "Add Task" : "Update Task"}
						</button>
					</form>
				</div>

				<SuccessModal
					isOpen={successModalOpen}
					onClose={() => {
						setSuccessModalOpen(false);
						onClose();
					}}
					message="new task has been created successfully"
				/>
			</div>
		</>
	);
};

export default TaskModal;
