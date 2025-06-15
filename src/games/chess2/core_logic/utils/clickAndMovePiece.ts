import { useChessStore } from "../chessStore"
import { isCurrentPlayerPiece } from "./isCurrentPlayerPiece"
import { isValidMove } from "./isValidMove"
import { movePiece } from "./movePiece"

export function clickAndMovePiece(row: number, col: number) {
   const { board, selectedPiece, setSelectedPiece } = useChessStore.getState()
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
   const piece = board[selectedPiece.row][selectedPiece.col]
   if (piece && isValidMove(piece, selectedPiece, { row, col })) {
      movePiece(selectedPiece, { row, col })
   }
   setSelectedPiece(null)
}