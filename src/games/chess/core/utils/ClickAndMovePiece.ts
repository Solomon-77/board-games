import type { Board, GameState, Player, Position, PromotionPiece } from "../types";
import { isCurrentPlayerPiece } from "./CurrentPlayer";

export function clickAndMovePiece(
   row: number,
   col: number,
   gameState: GameState,
   promotionChoice: PromotionPiece,
   selectedPiece: Position,
   board: Board,
   currentPlayer: Player,
   setSelectedPiece: (pos: Position | null) => void
) {
   if (gameState !== 'playing' || promotionChoice) return;

   const clickedPiece = board[row][col]

   if (!selectedPiece) {
      if (clickedPiece && isCurrentPlayerPiece(clickedPiece, currentPlayer)) {
         setSelectedPiece({ row, col })
      }
      return
   }

   if (selectedPiece.row === row && selectedPiece.col === col) {
      setSelectedPiece(null)
      return
   }

   if (clickedPiece && isCurrentPlayerPiece(clickedPiece, currentPlayer)) {
      setSelectedPiece({ row, col })
      return
   }

   const piece = board[selectedPiece.row][selectedPiece.col]
   if (piece && isValidMove(piece, selectedPiece, { row, col })) {
      movePiece(selectedPiece, { row, col })
   }
   setSelectedPiece(null)
}