import React from "react";
import "./Spinner.css";

interface SpinnerProps {
  size?: "small" | "medium" | "large";
  color?: string;
  text?: string;
  inButton?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = "medium",
  color = "#FFD54F",
  text = "로딩중입니다",
  inButton = false,
}) => {
  const getSize = () => {
    switch (size) {
      case "small":
        return inButton ? 16 : 24;
      case "large":
        return 48;
      default:
        return 36;
    }
  };

  return (
    <div className={`spinner-container ${inButton ? "in-button" : ""}`}>
      <div
        className="spinner"
        style={{
          width: getSize(),
          height: getSize(),
          borderColor: `${color}20`,
          borderTopColor: color,
          borderWidth: inButton ? "2px" : "3px",
        }}
      ></div>
      {text && !inButton && <p className="spinner-text">{text}</p>}
    </div>
  );
};

export default Spinner;
