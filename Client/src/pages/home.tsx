import { useEffect, useState } from "react";
import FilterDropdown from "../components/FilterDropdown";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import { Task, useTaskStore } from "../stores/taskStore";

export default function Home() {
	const { tasks, fetchTasks, deleteTaskById } = useTaskStore();
	const [searchTerm, setSearchTerm] = useState("");
	const [addTaskOpen, setAddTaskOpen] = useState(false);
	const [editTaskData, setEditTaskData] = useState<Task | null>(null);
	const [editTaskOpen, setEditTaskOpen] = useState(false);
	const [filter, setFilter] = useState<"all" | "todo" | "onProgress" | "done" | "timeOut">("all");
	const [showExpiredTasks, setShowExpiredTasks] = useState(false); // New state for expired tasks
	const filterOptions: (typeof filter)[] = ["all", "todo", "onProgress", "done", "timeOut"];


	useEffect(() => {
		fetchTasks();
	}, [fetchTasks]);

	const handleEditTask = (task: Task) => {
		setEditTaskData(task);
		setEditTaskOpen(true);
	};

	const handleDeleteTask = async (taskId: string) => {
		if (window.confirm("Are you sure you want to delete this task?")) {
			await deleteTaskById(taskId);
		}
	};

	const filteredTasks = tasks.filter(
		(task) =>
			task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			task.description.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	// Group tasks by status
	const tasksByStatus = {
		todo: filteredTasks.filter((task) => task.status === "todo"),
		onProgress: filteredTasks.filter((task) => task.status === "onProgress"),
		done: filteredTasks.filter((task) => task.status === "done"),
	};

	// Expired tasks logic
	const expiredTasks = tasks.filter(
		(task) => new Date(task.dueDate) < new Date() && task.status !== "done",
	);

	return (
		<div className="bg-gray-100 min-h-screen p-4 md:p-6">
			{/* Header with search and filter */}
			<div className="bg-white rounded-lg shadow-sm p-3 flex justify-between items-center mb-6">
				<div className="relative">
					<input
						type="text"
						placeholder="Search Project"
						className="pl-9 pr-4 py-2 rounded-full border border-gray-200 w-48 md:w-56 text-sm"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<svg
						className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</div>

				<FilterDropdown filterOptions={filterOptions} filter={filter} setFilter={setFilter} />
			</div>

			{/* Dashboard Grid */}
			<div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6">
				{/* Sidebar Stats */}
				<div className="md:col-span-1 space-y-4">
					{/* Expired Tasks */}
					<div
						className="bg-white rounded-lg p-4 md:p-6 hover:cursor-pointer"
						onClick={() => setShowExpiredTasks(!showExpiredTasks)} // Toggle expired tasks
					>
						<div className="flex items-center mb-4">
							<div className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">
								<span className="font-bold">!</span>
							</div>
							<span className="text-gray-600 text-sm">Expired Tasks</span>
						</div>
						<div className="text-3xl font-bold">{expiredTasks.length}</div>
					</div>

					{/* All Active Tasks */}
					<div className="bg-white rounded-lg p-4 md:p-6">
						<div className="flex items-center mb-4">
							<div className="bg-orange-200 text-orange-500 w-8 h-8 rounded-full flex items-center justify-center mr-3">
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
							</div>
							<span className="text-gray-600 text-sm">All Active Tasks</span>
						</div>
						<div className="text-3xl font-bold">{tasks.filter((task) => task.status !== "done").length}</div>
					</div>

					{/* Completed Tasks */}
					<div className="bg-white rounded-lg p-4 md:p-6">
						<div className="flex items-center mb-4">
							<div className="bg-blue-100 text-blue-500 w-8 h-8 rounded-full flex items-center justify-center mr-3">
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
								</svg>
							</div>
							<span className="text-gray-600 text-sm">Completed Tasks</span>
						</div>
						<div className="text-3xl font-bold">
							{tasks.filter((task) => task.status === "done").length}
							<span className="text-sm text-gray-500">/{tasks.length}</span>
						</div>
					</div>

					{/* Add Task Button */}
					<button
						className="w-full bg-indigo-900 text-white py-3 rounded-lg flex items-center justify-center space-x-2 hover:cursor-pointer"
						onClick={() => setAddTaskOpen(true)}
					>
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
						</svg>
						<span>Add Task</span>
					</button>
				</div>

				{/* Kanban Board */}
				<div className="md:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
					{/* Show expired tasks if clicked */}
					{showExpiredTasks ? (
						<div className="bg-white rounded-lg p-4">
							<div className="flex items-center mb-4">
								<div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
								<span className="font-medium">Expired Tasks</span>
								<span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded-full">
									{expiredTasks.length}
								</span>
							</div>
							<div className="border-t border-red-500 mb-4"></div>

							{expiredTasks.map((task) => (
								<TaskCard
									key={task.id}
									task={task}
									onEdit={() => handleEditTask(task)}
									onDelete={() => handleDeleteTask(task.id)}
								/>
							))}
						</div>
					) : (
						<>
							{/* todo Column */}
							{(filter == "all" || filter == "todo") && (
								<div className="bg-white rounded-lg p-4">
									<div className="flex items-center mb-4">
										<div className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></div>
										<span className="font-medium">To Do</span>
										<span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded-full">
											{tasksByStatus["todo"].length}
										</span>
									</div>
									<div className="border-t border-indigo-600 mb-4"></div>

									{tasksByStatus["todo"].map((task) => (
										<TaskCard
											key={task.id}
											task={task}
											onEdit={() => handleEditTask(task)}
											onDelete={() => handleDeleteTask(task.id)}
										/>
									))}
								</div>
							)}

							{/* onProgress Column */}
							{(filter == "all" || filter == "onProgress") && (
								<div className="bg-white rounded-lg p-4">
									<div className="flex items-center mb-4">
										<div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
										<span className="font-medium">On Progress</span>
										<span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded-full">
											{tasksByStatus["onProgress"].length}
										</span>
									</div>
									<div className="border-t border-yellow-500 mb-4"></div>

									{tasksByStatus["onProgress"].map((task) => (
										<TaskCard
											key={task.id}
											task={task}
											onEdit={() => handleEditTask(task)}
											onDelete={() => handleDeleteTask(task.id)}
										/>
									))}
								</div>
							)}

							{/* done Column */}
							{(filter == "all" || filter == "done") && (
								<div className="bg-white rounded-lg p-4">
									<div className="flex items-center mb-4">
										<div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
										<span className="font-medium">Done</span>
										<span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded-full">
											{tasksByStatus["done"].length}
										</span>
									</div>
									<div className="border-t border-green-500 mb-4"></div>

									{tasksByStatus["done"].map((task) => (
										<TaskCard
											key={task.id}
											task={task}
											onEdit={() => handleEditTask(task)}
											onDelete={() => handleDeleteTask(task.id)}
										/>
									))}
								</div>
							)}
						</>
					)}
				</div>
			</div>

			{/* Task Modals */}
			{addTaskOpen && <TaskModal isOpen={addTaskOpen} onClose={() => setAddTaskOpen(false)} mode="add" />}

			{editTaskOpen && editTaskData && (
				<TaskModal isOpen={editTaskOpen} onClose={() => setEditTaskOpen(false)} task={editTaskData} mode="edit" />
			)}
		</div>
	);
}