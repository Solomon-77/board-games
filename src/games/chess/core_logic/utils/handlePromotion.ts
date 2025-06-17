import { useChessStore } from "../chessStore";
import type { Piece } from "../types";

export function handlePromotion(promotedPiece: Piece) {
   const { board, setBoard, promotionChoice, setPromotionChoice, currentPlayer, setCurrentPlayer } = useChessStore.getState()
   if (!promotionChoice) return;

   const newBoard = board.map(r => [...r]);
   newBoard[promotionChoice.row][promotionChoice.col] = promotedPiece;
   setBoard(newBoard);

   // Reset promotion state and continue the game
   setPromotionChoice(null);
   setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
}