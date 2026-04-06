import { ClipLoader } from "react-spinners";

const GlobalLoadingSpinner = () => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20"
      aria-label="Loading data"
      role="status"
      aria-live="polite"
    >
      <ClipLoader color={"#ffffff"} loading={true} size={50} />
    </div>
  );
};

export default GlobalLoadingSpinner;
