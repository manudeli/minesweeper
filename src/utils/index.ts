import { MAX_COLS, MAX_ROWS, NUMBER_OF_BOMBS } from "../constants";
import { CellValue, CellState, Cell } from "../types";

export const generateCells = (): Cell[][] => {
  let cells: Cell[][] = [];

  // 빈 cells을 만들기
  for (let row = 0; row < MAX_ROWS; row++) {
    cells.push([]);
    for (let col = 0; col < MAX_COLS; col++) {
      cells[row].push({
        value: CellValue.none,
        state: CellState.open,
      });
    }
  }

  // 랜덤으로 지뢰를 cell에 넣기
  let bombsPlaced = 0;
  while (bombsPlaced < NUMBER_OF_BOMBS) {
    const randomRow = Math.floor(Math.random() * MAX_ROWS);
    const randomCol = Math.floor(Math.random() * MAX_COLS);

    const currentCell = cells[randomRow][randomCol];

    // cell.value에 지뢰가 없는 경우 지뢰를 넣기, 같은 cell에 지뢰 중복넣기 방지
    if (currentCell.value !== CellValue.bomb) {
      cells = cells.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          // 랜덤으로 지정된 cell에 지뢰 넣기
          if (randomRow === rowIndex && randomCol === colIndex) {
            return {
              state: cell.state,
              value: CellValue.bomb,
            };
          }
          // 지정되지 않은 cell 반환
          return cell;
        })
      );
      //한개의 지뢰 설치 완료
      bombsPlaced++;
    }
  }

  // 각 cell의 숫자를 계산하기
  for (let rowIndex = 0; rowIndex < MAX_ROWS; rowIndex++) {
    for (let colIndex = 0; colIndex < MAX_COLS; colIndex++) {
      const currentCell = cells[rowIndex][colIndex];
      if (currentCell.value === CellValue.bomb) {
        continue;
      }

      // 지뢰개수 초기 선언
      let numberOfBombs = 0;
      // 주변 지뢰 확인
      const topLeftBomb =
        rowIndex > 0 && colIndex > 0 ? cells[rowIndex - 1][colIndex - 1] : null;
      const topBomb = rowIndex > 0 ? cells[rowIndex - 1][colIndex] : null;
      const topRightBomb =
        rowIndex > 0 && colIndex < MAX_COLS - 1
          ? cells[rowIndex - 1][colIndex + 1]
          : null;
      const leftBomb = colIndex > 0 ? cells[rowIndex][colIndex - 1] : null;
      const rightBomb =
        colIndex < MAX_COLS - 1 ? cells[rowIndex][colIndex + 1] : null;
      const bottomLeftBomb =
        rowIndex < MAX_ROWS - 1 && colIndex > 0
          ? cells[rowIndex + 1][colIndex - 1]
          : null;
      const bottomBomb =
        rowIndex < MAX_ROWS - 1 ? cells[rowIndex + 1][colIndex] : null;
      const bottomRightBomb =
        rowIndex < MAX_ROWS - 1 && colIndex < MAX_COLS - 1
          ? cells[rowIndex + 1][colIndex + 1]
          : null;

      // 주변 지뢰가 있으면 숫자 올리기
      [
        topLeftBomb,
        topBomb,
        topRightBomb,
        leftBomb,
        rightBomb,
        bottomLeftBomb,
        bottomBomb,
        bottomRightBomb,
      ].forEach((anyPositionBomb) => {
        if (anyPositionBomb?.value === CellValue.bomb) {
          numberOfBombs++;
        }
      });

      if (numberOfBombs > 0) {
        cells[rowIndex][colIndex] = {
          ...currentCell,
          value: numberOfBombs,
        };
      }
    }
  }

  return cells;
};
