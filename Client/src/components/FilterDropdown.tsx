import { useState, useRef, useEffect } from "react";

type prop = {
	filterOptions: ("all" | "todo" | "onProgress" | "done" | "timeOut")[];
	filter: "all" | "todo" | "onProgress" | "done" | "timeOut";
	setFilter: React.Dispatch<React.SetStateAction<"all" | "todo" | "onProgress" | "done" | "timeOut">>;
};

const FilterDropdown = ({ filterOptions, filter, setFilter }: prop) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className="relative" ref={dropdownRef}>
			{/* Toggle Button */}
			<button
				onClick={() => setIsOpen((prev) => !prev)}
				className="flex items-center space-x-1 px-3 py-1.5 border border-gray-200 rounded-md text-sm bg-white"
			>
				<span>{filter.charAt(0).toUpperCase() + filter.slice(1)}</span>
				<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
				</svg>
			</button>

			{/* Dropdown Menu */}
			{isOpen && (
				<div className="absolute right-0 mt-2 w-30 bg-white border border-gray-200 rounded-md shadow-md z-10">
					{filterOptions.map((option) => (
						<button
							key={option}
							onClick={() => {
								setFilter(option);
								setIsOpen(false);
							}}
							className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
								filter === option ? "font-semibold bg-gray-200" : ""
							}`}
						>
							{option.charAt(0).toUpperCase() + option.slice(1)}
						</button>
					))}
				</div>
			)}
		</div>
	);
};

export default FilterDropdown;
