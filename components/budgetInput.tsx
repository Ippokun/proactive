import React, { useState } from "react";
// import { useJobPostContext } from "../app/client/job-post/JobPostContext";
// import styles from "../../../components/style/budget.module.css";

const formatCurrency = (value: number | null): string => {
  if (value === null) return "";
  return `${value.toLocaleString("en-US")}₮`;
};

const BudgetInput = ({
  value,
  onChange,
  placeholder,
}: {
  value: number | null;
  onChange: (newValue: number | null) => void;
  placeholder: string;
}) => {
  const [inputValue, setInputValue] = useState<string>(
    value !== null ? formatCurrency(value) : ""
  );

  const parseNumber = (input: string): number => Number(input.replace(/[^0-9]/g, "")) || 0;

  // Handle typing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setInputValue(rawValue); // Display raw input
    const numericValue = parseNumber(rawValue);
    onChange(numericValue);
  };

  // Handle formatting on blur
  const handleBlur = () => {
    if (value !== null) {
      setInputValue(formatCurrency(value)); // Format the value for display
    }
  };

  // Handle focusing
  const handleFocus = () => {
    setInputValue(value !== null ? value.toString() : ""); // Show raw number
  };

  return (
    <input
      type="text"
      value={inputValue}
      onChange={handleInputChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      className="mt-2 px-4 py-2 border rounded-lg"
      placeholder={placeholder}
    />
  );
};

export default BudgetInput;
