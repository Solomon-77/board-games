import type { Board, Position } from "../types";

export function simulateMove(board: Board, from: Position, to: Position): Board | null {
   if (!from || !to) return null;

   const newBoard = board.map(row => [...row]);
   newBoard[to.row][to.col] = newBoard[from.row][from.col];
   newBoard[from.row][from.col] = null;

   return newBoard;
}