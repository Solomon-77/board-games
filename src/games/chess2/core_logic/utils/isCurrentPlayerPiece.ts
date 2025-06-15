import { useChessStore } from "../chessStore";
import type { Piece } from "../types";

export function isCurrentPlayerPiece(piece: Piece): boolean {
   const { currentPlayer } = useChessStore.getState()
   return currentPlayer === 'white' ? piece.startsWith('w_') : piece.startsWith('b_')
}