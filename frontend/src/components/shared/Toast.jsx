import React from "react";
import { FaCircleCheck, FaCircleInfo, FaCircleXmark } from "react-icons/fa6";

const toastTypes = {
  success: { icon: FaCircleCheck, color: "bg-green-500" },
  error: { icon: FaCircleXmark, color: "bg-red-500" },
  info: { icon: FaCircleInfo, color: "bg-blue-500" },
};
// this will be show toast message
const Toast = ({ message, type, onClose }) => {
  const Icon = toastTypes[type]?.icon || FaCircleCheck;
  const bgColor = toastTypes[type]?.color || "bg-green-500";
  return <div className={`flex items-center p-4 rounded-lg shadow-lg text-white ${bgColor}`}>
    <Icon className="w-5 h-5 mr-3" />
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white">
        ✖
      </button>

  </div>;
};

export default Toast;
