import React, { useState } from "react";

import Button from "../Button";
import NumberDisplay from "../NumberDisplay";
import { generateCells } from "../../utils";
import imgFossil from "../../assets/fossil.png";

import "./App.scss";

const App: React.FC = () => {
  const [cells, setSells] = useState(generateCells());

  const renderCells = (): React.ReactNode => {
    return cells.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <Button
          key={`${colIndex}-${rowIndex}`}
          state={cell.state}
          value={cell.value}
          row={rowIndex}
          col={colIndex}
        />
      ))
    );
  };

  console.log(cells);

  return (
    <div className="App">
      <div>
        <img
          src={imgFossil}
          alt="fossil"
          style={{ width: 300, borderRadius: 16 }}
        />
        <br />
        티라노사우르스 화석을 발굴하자! <br />
        화석이 묻혀 있는 땅 주변을 모두 파면 온전한 화석 10개를 얻을 수 있어요
        <br />
        실수로 화석이 있는 땅을 파면 화석이 깨질 수 있으니 조심하세요
        <br />
        <small>
          화석이 있을 것 같은 땅에는 마우스 오른쪽 클릭으로 📍를 표시해 기억할
          수 있어요
        </small>
        <br />
        <br />
        <small>
          피해야하는 것(지뢰) - 찾고 싶은 것(공룡화석)으로 바꾸면
          <br />
          공룡을 좋아하는 게이머에게 동기부여 해줄 수 있지 않을까?
        </small>
      </div>
      <div>
        <div className="Header">
          <NumberDisplay value={0} type={"📍"} />
          <div className="Face">
            <span role="img" aria-label="face">
              😋
            </span>
          </div>
          <NumberDisplay value={23} type={"⏱️"} />
        </div>
        <div className="Body"> {renderCells()} </div>
      </div>
    </div>
  );
};

export default App;
