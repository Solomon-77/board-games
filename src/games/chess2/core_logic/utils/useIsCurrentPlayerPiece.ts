import type { Piece } from "../types";
import { useChessState } from "../useHooks";

export function useIsCurrentPlayerPiece() {
   const { currentPlayer } = useChessState()

   function isCurrentPlayerPiece(piece: Piece): boolean {
      return currentPlayer === 'white' ? piece.startsWith('w_') : piece.startsWith('b_')
   }

   return { isCurrentPlayerPiece }
}