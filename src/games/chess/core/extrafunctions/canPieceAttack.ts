import type { Board, Piece, Position } from "../types";
import { doesPawnAttack } from "./doesPawnAttack";
import { isPathClear } from "./isPathClear";

export function canPieceAttack(piece: Piece, from: Position, to: Position, board: Board): boolean {
   if (!from || !to) return false;

   if (piece.endsWith('_pawn')) {
      return doesPawnAttack(from, to, board);
   }
   if (piece.endsWith('_knight')) {
      const dr = Math.abs(from.row - to.row), dc = Math.abs(from.col - to.col);
      return (dr === 2 && dc === 1) || (dr === 1 && dc === 2);
   }
   if (piece.endsWith('_bishop') || piece.endsWith('_queen')) {
      if (Math.abs(from.row - to.row) === Math.abs(from.col - to.col)) {
         return isPathClear(from, to, board);
      }
   }
   if (piece.endsWith('_rook') || piece.endsWith('_queen')) {
      if (from.row === to.row || from.col === to.col) {
         return isPathClear(from, to, board);
      }
   }
   if (piece.endsWith('_king')) {
      return (Math.abs(from.row - to.row) <= 1 && Math.abs(from.col - to.col) <= 1);
   }
   return false;
}