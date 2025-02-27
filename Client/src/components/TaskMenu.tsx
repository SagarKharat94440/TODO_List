interface TaskMenuProps {
	isOpen: boolean;
	onClose: () => void;
	onEdit: () => void;
	onDelete: () => void;
}

const TaskMenu: React.FC<TaskMenuProps> = ({ isOpen, onClose, onEdit, onDelete }) => {
	console.log("TaskMenu isOpen:", isOpen);
	if (isOpen != true) return null;

	return (
		<div
			className="absolute bg-white shadow-lg rounded-md py-2 z-10 w-32 ml-[250px] mt-6"
			// style={{ top: position.top, right: position.right }}
		>
			<button
				onClick={() => {
					onEdit();
					onClose();
				}}
				className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
			>
				Edit
			</button>
			<button
				onClick={() => {
					onDelete();
					onClose();
				}}
				className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500 text-sm"
			>
				Delete
			</button>
		</div>
	);
};

export default TaskMenu;
