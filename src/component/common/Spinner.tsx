import React from "react";
import "./Spinner.css";

interface SpinnerProps {
  size?: "small" | "medium" | "large";
  color?: string;
  text?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = "medium",
  color = "#FFD54F",
  text = "로딩중입니다",
}) => {
  const getSize = () => {
    switch (size) {
      case "small":
        return 24;
      case "large":
        return 48;
      default:
        return 36;
    }
  };

  return (
    <div className="spinner-container">
      <div
        className="spinner"
        style={{
          width: getSize(),
          height: getSize(),
          borderColor: `${color}20`,
          borderTopColor: color,
        }}
      ></div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
};

export default Spinner;
