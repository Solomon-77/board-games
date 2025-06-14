import { useChessState } from "../useHooks";
import { useIsCurrentPlayerPiece } from "./useIsCurrentPlayerPiece";
import { useMovePiece } from "./useMovePiece";

export function useClickAndMovePiece() {
   const { board, selectedPiece, setSelectedPiece } = useChessState()
   const { isCurrentPlayerPiece } = useIsCurrentPlayerPiece()
   const { movePiece } = useMovePiece()

   function clickAndMovePiece(row: number, col: number) {
      const clickedPiece = board[row][col]

      // if not yet selected a piece then select
      if (!selectedPiece) {
         if (clickedPiece && isCurrentPlayerPiece(clickedPiece)) {
            setSelectedPiece({ row, col })
         }
         return
      }

      // if selected the same piece then deselect
      if (selectedPiece.row === row && selectedPiece.col === col) {
         setSelectedPiece(null)
         return
      }

      // if clicked another piece then select it instead
      if (clickedPiece && isCurrentPlayerPiece(clickedPiece)) {
         setSelectedPiece({ row, col })
         return
      }

      // attempt to move
      movePiece(selectedPiece, { row, col })
   }

   return { clickAndMovePiece }
}