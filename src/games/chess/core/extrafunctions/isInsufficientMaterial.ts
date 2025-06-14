import type { Board, Piece } from "../types";

export function isInsufficientMaterial(currentBoard: Board): boolean {
   const pieceCounts: { [key in Piece]?: number } = {};
   let totalPieces = 0;

   for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
         const piece = currentBoard[r][c];
         if (piece) {
            pieceCounts[piece] = (pieceCounts[piece] || 0) + 1;
            totalPieces++;
         }
      }
   }

   // King vs King
   if (totalPieces === 2 && pieceCounts['w_king'] === 1 && pieceCounts['b_king'] === 1) {
      return true;
   }
   // King and Bishop vs King
   if (totalPieces === 3 && ((pieceCounts['w_king'] === 1 && pieceCounts['b_king'] === 1 && pieceCounts['w_bishop'] === 1) || (pieceCounts['w_king'] === 1 && pieceCounts['b_king'] === 1 && pieceCounts['b_bishop'] === 1))) {
      return true;
   }
   // King and Knight vs King
   if (totalPieces === 3 && ((pieceCounts['w_king'] === 1 && pieceCounts['b_king'] === 1 && pieceCounts['w_knight'] === 1) || (pieceCounts['w_king'] === 1 && pieceCounts['b_king'] === 1 && pieceCounts['b_knight'] === 1))) {
      return true;
   }
   return false;
}