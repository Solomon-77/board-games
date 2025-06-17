import { useChessStore } from "../chessStore";
import type { Position } from "../types";
import { isCurrentPlayerPiece } from "../utils/isCurrentPlayerPiece";
import { isPathClear } from "../utils/isPathClear";

export function isValidQueenMove(from: Position, to: Position): boolean {
   const { board } = useChessStore.getState()
   if (!from || !to) return false

   const isQueenMove =
      from.row === to.row ||
      from.col === to.col ||
      Math.abs(from.row - to.row) === Math.abs(from.col - to.col)

   if (!isQueenMove) return false

   if (!isPathClear(from, to, board)) return false;

   const target = board[to.row][to.col];
   if (target && isCurrentPlayerPiece(target)) return false;

   return true
}