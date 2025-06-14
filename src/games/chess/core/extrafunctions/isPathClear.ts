import type { Board, Position } from "../types";

export function isPathClear(from: Position, to: Position, board: Board): boolean {
   if (!from || !to) return false;

   const rowDiff = to.row - from.row;
   const colDiff = to.col - from.col;
   const rowStep = rowDiff === 0 ? 0 : (rowDiff > 0 ? 1 : -1);
   const colStep = colDiff === 0 ? 0 : (colDiff > 0 ? 1 : -1);

   let currRow = from.row + rowStep;
   let currCol = from.col + colStep;

   while (currRow !== to.row || currCol !== to.col) {
      if (board[currRow][currCol] !== null) {
         return false;
      }
      currRow += rowStep;
      currCol += colStep;
   }
   return true;
}