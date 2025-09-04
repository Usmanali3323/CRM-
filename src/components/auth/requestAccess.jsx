import React from "react";
import { X } from "lucide-react";

export default function Popup({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      ></div>

      {/* Modal content */}
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-lg p-6 z-10">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Modal body */}
        <div>{children}</div>
      </div>
    </div>
  );
}
