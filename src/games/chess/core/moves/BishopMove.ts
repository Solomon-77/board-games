import { isCurrentPlayerPiece } from "../extrafunctions/isCurrentPlayerPiece";
import { isPathClear } from "../extrafunctions/isPathClear";
import type { Board, Player, Position } from "../types";

export function isValidBishopMove(from: Position, to: Position, board: Board, currentPlayer: Player): boolean {
   if (!from || !to) return false;

   const isBishopMove = Math.abs(from.row - to.row) === Math.abs(from.col - to.col);
   if (!isBishopMove) return false;

   if (!isPathClear(from, to, board)) return false;

   const target = board[to.row][to.col];
   if (target && isCurrentPlayerPiece(target, currentPlayer)) return false;

   return true;
}