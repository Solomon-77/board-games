import { useChessStore } from "../chessStore";
import type { Position } from "../types";
import { isCurrentPlayerPiece } from "../utils/isCurrentPlayerPiece";
import { isPathClear } from "../utils/isPathClear";

export function isValidRookMove(from: Position, to: Position): boolean {
   const { board } = useChessStore.getState()
   if (!from || !to) return false

   const isVerticalOrHorizontal = from.row === to.row || from.col === to.col
   if (!isVerticalOrHorizontal) return false

   if (!isPathClear(from, to, board)) return false;

   const target = board[to.row][to.col];
   if (target && isCurrentPlayerPiece(target)) return false;

   return true;
}