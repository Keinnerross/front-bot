import { FaSpinner } from "react-icons/fa";

const LoadingScreen = () => {
    return (
        <div className="flex flex-col justify-center items-center gap-4 h-screen bg-[#fbc2c8]">
            <FaSpinner className="animate-spin text-4xl"  size={40}/>
        </div>
    );
}

export default LoadingScreen;