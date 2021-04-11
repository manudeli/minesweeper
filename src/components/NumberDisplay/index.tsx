import React from "react";
import "./NumberDisplay.scss";

interface NumberDisplayProps {
  value: number;
  type: string;
}

const NumberDisplay: React.FC<NumberDisplayProps> = ({ value, type }) => {
  return (
    <div className="NumberDisplay">
      {type} {value.toString().padStart(3, "0")}
    </div>
  );
};

export default NumberDisplay;
