import { isCurrentPlayerPiece } from "./isCurrentPlayerPiece";
import { isValidMove } from "./MoveValidation";
import type { Board, CastlingRights, Player, Position } from "../types";

export function hasAnyLegalMoves(board: Board, currentPlayer: Player, enPassantTarget: Position, hasMoved: CastlingRights): boolean {
   for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
         const piece = board[r][c];
         if (piece && isCurrentPlayerPiece(piece, currentPlayer)) {
            const from = { row: r, col: c };
            // Check all possible destination squares for this piece
            for (let toR = 0; toR < 8; toR++) {
               for (let toC = 0; toC < 8; toC++) {
                  if (isValidMove(piece, from, { row: toR, col: toC }, board, currentPlayer, enPassantTarget, hasMoved)) {
                     return true; // Found at least one legal move
                  }
               }
            }
         }
      }
   }
   return false; // No legal moves found for any piece
}