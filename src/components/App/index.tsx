import React, { useState, useEffect } from "react";

import Button from "../Button";
import NumberDisplay from "../NumberDisplay";
import { generateCells, openMultipleCells } from "../../utils";
import { Face, Cell, CellState, CellValue } from "../../types";
import imgFossil from "../../assets/fossil.png";
import { NUMBER_OF_BOMBS, MAX_ROWS, MAX_COLS } from "../../constants";

import "./App.scss";

const App: React.FC = () => {
  const [cells, setCells] = useState<Cell[][]>(generateCells());
  const [face, setFace] = useState<Face>(Face.curious);
  const [time, setTime] = useState<number>(0);
  const [live, setLive] = useState<boolean>(false);
  const [bombCounter, setBombCounter] = useState<number>(NUMBER_OF_BOMBS);
  const [dead, setDead] = useState<boolean>(false);
  const [won, setWon] = useState<boolean>(false);

  useEffect(() => {
    const handleMousedown = (): void => {
      setFace(Face.finding);
    };
    const handleMouseup = (): void => {
      setFace(Face.curious);
    };
    window.addEventListener("mousedown", handleMousedown);
    window.addEventListener("mouseup", handleMouseup);

    return () => {
      window.removeEventListener("mousedown", handleMousedown);
      window.removeEventListener("mouseup", handleMouseup);
    };
  }, []);

  useEffect(() => {
    if (live) {
      const timer = setInterval(() => {
        setTime(time + 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [live, time]);

  useEffect(() => {
    if (dead) {
      setLive(false);
      setFace(Face.dead);
      alert("네 이 녀석!!!, 티라노사우루스 화석을 산산조각 내어 버렸구나!🤣");
    }
  }, [dead]);

  useEffect(() => {
    if (won) {
      setLive(false);
      setFace(Face.won);
      alert("정말 대단해요!!!, 티라노사우루스 화석을 모두 발굴하시다니!🥳");
      setCells(showAllBombs());
    }
  }, [won]);

  const handleCellClick = (rowParam: number, colParam: number) => (): void => {
    let newCells = cells.slice();

    // 게임 시작하기
    if (!live) {
      //첫 선택한 cell인 지뢰인 경우 지뢰가 아닐때까지 cells 재생성
      let isABomb = true;
      while (isABomb) {
        newCells = generateCells();
        if (newCells[rowParam][colParam].value !== CellValue.bomb) {
          isABomb = false;
          break;
        }
      }
      setLive(true);
    }

    const currentCell = newCells[rowParam][colParam];

    if ([CellState.flagged, CellState.visible].includes(currentCell.state)) {
      // 핀 되어있는 칸 or 열어져있는 칸 누르면 반응 없음
      return;
    }

    if (currentCell.value === CellValue.bomb) {
      setDead(true);
      newCells[rowParam][colParam].red = true;
      newCells = showAllBombs();
      setCells(newCells);
      return;
    } else if (currentCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam, colParam);
    } else {
      newCells[rowParam][colParam].state = CellState.visible;
    }

    // 이겼는 지 체크하기
    let safeOpenCellsExist = false;
    for (let row = 0; row < MAX_ROWS; row++) {
      for (let col = 0; col < MAX_COLS; col++) {
        const currentCell = newCells[row][col];

        if (
          currentCell.value !== CellValue.bomb &&
          currentCell.state === CellState.open
        ) {
          safeOpenCellsExist = true;
          break;
        }
      }
    }
    if (!safeOpenCellsExist) {
      newCells = newCells.map((row) =>
        row.map((cell) => {
          if (cell.value === CellValue.bomb) {
            return {
              ...cell,
              state: CellState.flagged,
            };
          }
          return cell;
        })
      );
      setWon(true);
    }

    setCells(newCells);
  };

  const handleCellContext = (rowParam: number, colParam: number) => (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    e.preventDefault();

    if (bombCounter <= 0) {
      return;
    }

    const currentCells = cells.slice();
    const currentCell = cells[rowParam][colParam];

    if (currentCell.state === CellState.visible) {
      return;
    } else if (currentCell.state === CellState.open) {
      currentCells[rowParam][colParam].state = CellState.flagged;
      setCells(currentCells);
      setBombCounter(bombCounter - 1);
    } else if (currentCell.state === CellState.flagged) {
      currentCells[rowParam][colParam].state = CellState.open;
      setCells(currentCells);
      setBombCounter(bombCounter + 1);
    }
  };

  const handleFaceClick = (): void => {
    setLive(false);
    setTime(0);
    setBombCounter(NUMBER_OF_BOMBS);
    setCells(generateCells());
    setDead(false);
    setWon(false);
  };

  const renderCells = (): React.ReactNode => {
    return cells.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <Button
          key={`${colIndex}-${rowIndex}`}
          onClick={handleCellClick}
          onContext={handleCellContext}
          row={rowIndex}
          col={colIndex}
          value={cell.value}
          state={cell.state}
          red={cell.red}
        />
      ))
    );
  };

  const showAllBombs = (): Cell[][] => {
    const currentCells = cells.slice();
    return currentCells.map((row) =>
      row.map((cell) => {
        if (cell.value === CellValue.bomb) {
          return {
            ...cell,
            state: CellState.visible,
          };
        }

        return cell;
      })
    );
  };

  return (
    <div className="App">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: 50, fontWeight: 900 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 50,
              fontWeight: 900,
              color: "gray",
            }}
          >
            <img
              src={imgFossil}
              alt="fossil"
              style={{ width: 300, borderRadius: 16 }}
            />
            × {NUMBER_OF_BOMBS}
          </div>
        </div>
        <div
          style={{
            width: 400,
            lineHeight: 1.7,
            letterSpacing: -0.3,
            color: "#222222",
            wordBreak: "keep-all",
          }}
        >
          <strong style={{ fontSize: 20, fontWeight: 900 }}>
            게임하는 방법
          </strong>{" "}
          <br />
          당신은 공룡을 무척 좋아하는 고고학자에요. 이 곳에는 아주 가치있는{" "}
          <strong>티라노사우르스 화석 {NUMBER_OF_BOMBS}개</strong>가 묻혀
          있어요. <strong>화석이 있는 땅 주변을 모두 파내면</strong> 화석을 얻을
          수 있어요. <br /> 단, 조심하세요! 화석은 아주 오래된 것이기 때문에{" "}
          <strong>
            실수로 화석이 있는 땅을 직접 파내면 화석이 산산 조각 나버릴 거에요.
          </strong>{" "}
          화석 주변의 땅바닥에는 주변 화석의 숫자가 있기 때문에 쉽게 알 수 있을
          거에요. 자, 이제 화석을 모으러 갑시다!
          <br /> <br />
          ⛏️
          <small> (좌 클릭): 화석 주변의 땅을 곡괭이로 파내세요.</small>
          <br />
          📍
          <small>
            (우 클릭): 화석이 있을 것 같은 땅을 핀으로 표시해 기억하세요.
          </small>
        </div>
        <div className="Header">
          <div className="Face" onClick={handleFaceClick}>
            <span role="img" aria-label="face">
              {face}
            </span>
          </div>
          <NumberDisplay value={bombCounter} type={"📍"} />
          <NumberDisplay value={time} type={"⏱️"} />
        </div>
      </div>
      <div>
        <div className="Body"> {renderCells()} </div>
      </div>
    </div>
  );
};

export default App;
