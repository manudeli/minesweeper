import React from "react";
import { CellState, CellValue } from "../../types";
import imgFossil from "../../assets/fossil.png";
import imgBroken from "../../assets/broken.png";

import "./Button.scss";

interface ButtonProps {
  row: number;
  col: number;
  state: CellState;
  value: CellValue;
  onClick(rowParam: number, colParam: number): (...args: any[]) => void;
  onContext(rowParam: number, colParam: number): (...args: any[]) => void;
  red: boolean | undefined;
}

const Button: React.FC<ButtonProps> = ({
  row,
  col,
  state,
  value,
  onClick,
  onContext,
  red,
}) => {
  const renderContent = (): React.ReactNode => {
    if (state === CellState.visible) {
      if (value === CellValue.bomb) {
        return (
          <span
            role="img"
            aria-label="fossil"
            style={{
              position: "relative",
            }}
          >
            <img
              src={imgFossil}
              alt="fossil"
              style={{ width: 70, borderRadius: 16 }}
            />
            {red && (
              <img
                src={imgBroken}
                alt="broken"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 70,
                }}
              />
            )}
          </span>
        );
      } else if (value === CellValue.none) {
        return null;
      }

      return value;
    } else if (state === CellState.flagged) {
      return (
        <span role="img" aria-label="flag">
          📍
        </span>
      );
    }

    return null;
  };

  return (
    <div
      className={`Button ${
        state === CellState.visible ? "visible" : ""
      } value-${value}`}
      onClick={onClick(row, col)}
      onContextMenu={onContext(row, col)}
      style={{ backgroundColor: red ? "#FF3971" : undefined }}
    >
      {renderContent()}
    </div>
  );
};

export default Button;
