import { isCurrentPlayerPiece } from "../extrafunctions/isCurrentPlayerPiece";
import type { Board, Player, Position } from "../types";

export function isValidKnightMove(from: Position, to: Position, board: Board, currentPlayer: Player): boolean {
   if (!from || !to) return false;

   const isKnightMove =
      (Math.abs(from.row - to.row) === 2 && Math.abs(from.col - to.col) === 1) ||
      (Math.abs(from.col - to.col) === 2 && Math.abs(from.row - to.row) === 1);

   if (!isKnightMove) return false;

   const target = board[to.row][to.col];
   if (target && isCurrentPlayerPiece(target, currentPlayer)) return false;

   return true;
}