import type { Piece, Player } from "../types";

export function isCurrentPlayerPiece(piece: Piece, currentPlayer: Player): boolean {
   return currentPlayer === 'white' ? piece.startsWith('w_') : piece.startsWith('b_');
}