import { useChessStore } from "../chessStore";
import { initialCastlingRights } from "../constants";
import { createBoard } from "./createBoard";

export function resetGame() {
   const {
      setBoard,
      setCurrentPlayer,
      setSelectedPiece,
      setEnPassantTarget,
      setHasMoved,
      setGameState,
      setWinner,
      setPromotionChoice,
      setBoardHistory
   } = useChessStore.getState()

   setBoard(createBoard());
   setCurrentPlayer('white');
   setSelectedPiece(null);
   setEnPassantTarget(null);
   setHasMoved(initialCastlingRights);
   setGameState('playing');
   setWinner(null);
   setPromotionChoice(null); // Reset promotion state
   setBoardHistory([]); // Reset board history
}