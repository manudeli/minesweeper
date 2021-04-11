import React, { useState } from "react";

import Button from "../Button";
import NumberDisplay from "../NumberDisplay";
import { generateCells } from "../../utils";

import "./App.scss";

const App: React.FC = () => {
  const [cells, setSells] = useState(generateCells());

  const renderCells = (): React.ReactNode => {
    return cells.map((row, rowIndex) =>
      row.map((cell, colIndex) => <Button />)
    );
  };

  return (
    <div className="App">
      <div className="Header">
        <NumberDisplay value={0} />
        <div className="Face">
          <span role="img" aria-label="face">
            😋
          </span>
        </div>
        <NumberDisplay value={23} />
      </div>
      <div className="Body"> {renderCells()} </div>
    </div>
  );
};

export default App;
