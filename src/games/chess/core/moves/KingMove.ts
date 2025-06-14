import { isCurrentPlayerPiece } from "../extrafunctions/isCurrentPlayerPiece";
import type { Board, CastlingRights, Player, Position } from "../types";
import { isValidCastling } from "./Castling";

export function isValidKingMove(from: Position, to: Position, board: Board, currentPlayer: Player, hasMoved: CastlingRights): boolean {
   if (!from || !to) return false;

   // Check for castling
   if (Math.abs(from.col - to.col) === 2 && from.row === to.row) {
      return isValidCastling(from, to, board, currentPlayer, hasMoved);
   }

   // Standard king move
   const isKingMove = Math.abs(from.row - to.row) <= 1 && Math.abs(from.col - to.col) <= 1;
   if (!isKingMove) return false;

   const target = board[to.row][to.col];
   if (target && isCurrentPlayerPiece(target, currentPlayer)) return false;

   return true;
}