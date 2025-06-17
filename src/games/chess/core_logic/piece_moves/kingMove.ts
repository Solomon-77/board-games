import { useChessStore } from "../chessStore";
import type { Position } from "../types";
import { isCurrentPlayerPiece } from "../utils/isCurrentPlayerPiece";
import { isValidCastling } from "../utils/isValidCastling";

export function isValidKingMove(from: Position, to: Position): boolean {
   const { board } = useChessStore.getState()
   if (!from || !to) return false

   if (Math.abs(from.col - to.col) === 2 && from.row === to.row) {
      return isValidCastling(from, to)
   }

   const isKingMove = Math.abs(from.row - to.row) <= 1 && Math.abs(from.col - to.col) <= 1;
   if (!isKingMove) return false

   const target = board[to.row][to.col]
   if (target && isCurrentPlayerPiece(target)) return false

   return true
}