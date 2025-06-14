import type { Board, Position } from "../types";

export function simulateMove(board: Board, from: Position, to: Position): Board | null {
   if (!from || !to) return null;
   const b2 = board.map(row => [...row]);
   b2[to.row][to.col] = b2[from.row][from.col];
   b2[from.row][from.col] = null;
   return b2;
}