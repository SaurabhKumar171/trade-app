type AlertProps = {
  message: string;
  onClose: () => void;
};

export default function SuccessAlert({ message, onClose }: AlertProps) {
  return (
    <div className="fixed bottom-4 right-4 max-w-sm w-full p-4 bg-green-100 border border-green-400 text-green-800 rounded-lg shadow-lg flex items-start justify-between z-50">
      <div>
        <strong className="font-bold">Success!</strong>
        <span className="block sm:inline ml-2">{message}</span>
      </div>
      <button
        onClick={onClose}
        className="ml-4 text-green-800 hover:text-green-900"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
