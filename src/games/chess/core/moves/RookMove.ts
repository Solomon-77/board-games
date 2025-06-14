import { isCurrentPlayerPiece } from "../extrafunctions/isCurrentPlayerPiece";
import { isPathClear } from "../extrafunctions/isPathClear";
import type { Board, Player, Position } from "../types";

export function isValidRookMove(from: Position, to: Position, board: Board, currentPlayer: Player): boolean {
   if (!from || !to) return false;

   const isVerticalOrHorizontal = from.row === to.row || from.col === to.col;
   if (!isVerticalOrHorizontal) return false;

   if (!isPathClear(from, to, board)) return false;

   const target = board[to.row][to.col];
   if (target && isCurrentPlayerPiece(target, currentPlayer)) return false;

   return true;
}