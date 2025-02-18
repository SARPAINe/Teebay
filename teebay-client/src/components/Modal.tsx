import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "./Button";

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
          <Button onClick={onClose} type="cancel">
            Cancel
          </Button>
          <Button onClick={onConfirm}>Confirm</Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
