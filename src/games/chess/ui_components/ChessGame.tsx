import { useEffect } from "react"
import { useChessStore } from "../core_logic/chessStore"
import { pieces } from "../core_logic/constants"
import { clickAndMovePiece } from "../core_logic/utils/clickAndMovePiece"
import { getBoardStateString } from "../core_logic/utils/getBoardStateString"
import { isInsufficientMaterial } from "../core_logic/utils/isInsufficientMaterial"
import { hasAnyLegalMoves } from "../core_logic/utils/hasAnyLegalMoves"
import { isInCheck } from "../core_logic/utils/isInCheck"
import PromotionModal from "./PromotionModal"

const ChessGame = () => {
   const board = useChessStore((state) => state.board);
   const currentPlayer = useChessStore((state) => state.currentPlayer);
   const gameState = useChessStore((state) => state.gameState);
   const boardHistory = useChessStore((state) => state.boardHistory);
   const promotionChoice = useChessStore((state) => state.promotionChoice);

   const { setGameState, setWinner } = useChessStore.getState()

   useEffect(() => {
      // Don't check if the game is already over or a promotion is pending
      if (gameState !== 'playing' || promotionChoice) return;

      const currentBoardStateString = getBoardStateString(board);

      // Check for Threefold Repetition
      const repetitionCount = boardHistory.filter(state => state === currentBoardStateString).length;
      if (repetitionCount >= 3) {
         setGameState('stalemate');
         return;
      }

      // Check for Insufficient Material
      if (isInsufficientMaterial(board)) {
         setGameState('stalemate');
         return;
      }

      // Check for Checkmate or Stalemate (no legal moves)
      if (!hasAnyLegalMoves()) {
         if (isInCheck(currentPlayer, board)) {
            setGameState('checkmate');
            setWinner(currentPlayer === 'white' ? 'black' : 'white');
         } else {
            setGameState('stalemate');
         }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [board, currentPlayer, gameState, promotionChoice, boardHistory]);

   return (
      <>
         <div className="grid grid-cols-8 max-w-[512px] w-full rounded-lg shadow-md overflow-hidden">
            {board.map((row, rowIndex) => (
               row.map((piece, colIndex) => (
                  <div
                     key={`${rowIndex}-${colIndex}`}
                     onClick={() => clickAndMovePiece(rowIndex, colIndex)}
                     className={`aspect-square grid place-items-center ${(rowIndex + colIndex) % 2 === 0 ? 'bg-white' : 'bg-amber-800'}`}
                  >
                     {piece && (
                        <img
                           src={pieces[piece]}
                           alt={piece}
                           className="h-full p-[3%] select-none"
                           draggable={false}
                        />
                     )}
                  </div>
               ))
            ))}
         </div>
         {promotionChoice && (
            <PromotionModal />
         )}
      </>
   )
}

export default ChessGame