import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
  transactionType?: "BUY" | "RENT";
  startDate?: Date;
  endDate?: Date;
  setStartDate?: (date: Date) => void;
  setEndDate?: (date: Date) => void;
}

const Modal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  transactionType,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="mb-4">{children}</div>
        {transactionType === "RENT" && setStartDate && setEndDate && (
          <div className="mb-4">
            <label className="block mb-2">From:</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date as Date)}
              className="w-full px-4 py-2 border rounded-md"
            />
            <label className="block mt-4 mb-2">To:</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date as Date)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
        )}
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
