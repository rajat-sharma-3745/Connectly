import React, { useEffect, useRef } from "react";

const Modal = ({ open, onClose, children, closeButton, clickOutside }) => {
  const ModalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        clickOutside &&
        ModalRef.current &&
        !ModalRef.current.contains(e.target)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  if (!open) return null;
  return (
    <div className="fixed inset-0 w-screen h-screen z-51 flex items-center justify-center bg-black/40">
      <div
        ref={ModalRef}
        className="bg-white flex flex-col overflow-hidden shadow-lg rounded-lg relative"
      >
        {closeButton && (
          <div className="flex  justify-end">
            <button
              type="button"
              className="text-gray-400 bg-transparent  hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center pr-2 pt-3 "
              onClick={onClose}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1l6 6m0 0l6-6m-6 6l6 6m-6-6l-6 6"
                />
              </svg>
            </button>
          </div>
        )}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
