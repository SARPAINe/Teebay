import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { GET_END_DATE } from "../graphql/queries";

interface DatePickerWithEndDateProps {
  id: number;
  startDate: Date | null;
  setStartDate: (date: Date | null) => void;
  endDate: Date | null;
  setEndDate: (date: Date | null) => void;
}

const DatePickerWithEndDate = ({
  id,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: DatePickerWithEndDateProps) => {
  const [possibleRentEndDate, setPossibleRentEndDate] = useState<Date | null>(
    null
  );

  const { data, loading, error } = useQuery(GET_END_DATE, {
    variables: { id, inputStartDate: startDate?.toISOString() },
    skip: !startDate,
    onCompleted: (data) => {
      setPossibleRentEndDate(new Date(data.enddate.endDate));
    },
  });

  useEffect(() => {
    if (startDate) {
      setEndDate(null); // Reset end date when start date changes
    }
  }, [startDate, setEndDate]);

  const isDateDisabled = (date: Date) => {
    return possibleRentEndDate && date > possibleRentEndDate;
  };

  return (
    <div className="flex gap-4">
      <div>
        <label>Start Date</label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="yyyy-MM-dd"
          className="w-full px-4 py-2 rounded-md bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5B51F8] focus:border-transparent"
        />
      </div>
      <div>
        <label>End Date</label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          dateFormat="yyyy-MM-dd"
          className="w-full px-4 py-2 rounded-md bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5B51F8] focus:border-transparent"
          filterDate={isDateDisabled}
        />
      </div>
    </div>
  );
};

export default DatePickerWithEndDate;
