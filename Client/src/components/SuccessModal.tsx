interface SuccessModalProps {
	isOpen: boolean;
	onClose: () => void;
	message: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, message }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-[#00000050] bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-xl p-6 w-72 max-w-sm flex flex-col items-center">
				<div className="bg-black rounded-lg p-3 mb-3">
					<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
					</svg>
				</div>
				<p className="text-center text-sm mb-4">{message}</p>
				<button onClick={onClose} className="w-full bg-black text-white rounded-lg py-2 font-medium">
					Back
				</button>
			</div>
		</div>
	);
};

export default SuccessModal;
