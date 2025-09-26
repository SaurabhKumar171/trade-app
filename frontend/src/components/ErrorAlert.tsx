type AlertProps = {
  message: string;
  onClose: () => void;
};

export default function ErrorAlert({ message, onClose }: AlertProps) {
  return (
    <div className="fixed bottom-4 right-4 max-w-sm w-full p-4 bg-red-100 border border-red-400 text-red-800 rounded-lg shadow-lg flex items-start justify-between z-50">
      <div>
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline ml-2">{message}</span>
      </div>
      <button
        onClick={onClose}
        className="ml-4 text-red-800 hover:text-red-900"
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
