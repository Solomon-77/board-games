import { useChessStore } from "../core_logic/chessStore"
import { resetGame } from "../core_logic/utils/resetGame"

const GameStatus = () => {
   const gameState = useChessStore((state) => state.gameState)
   const currentPlayer = useChessStore((state) => state.currentPlayer)
   const promotionChoice = useChessStore((state) => state.promotionChoice)
   const winner = useChessStore((state) => state.winner)

   return (
      <div className="flex-1 grid place-items-center">
         <div className="text-center">
            {gameState === 'playing' && !promotionChoice && (
               <div className="font-semibold text-xl capitalize">{currentPlayer}'s turn</div>
            )}
            {promotionChoice && (
               <div className="font-semibold text-xl capitalize">Promote your Pawn!</div>
            )}
            {gameState === 'checkmate' && (
               <div className="font-semibold text-xl capitalize">Checkmate! {winner} wins.</div>
            )}
            {gameState === 'stalemate' && (
               <div className="font-semibold text-xl">Stalemate! It's a draw.</div>
            )}
            {gameState !== 'playing' && (
               <button
                  onClick={resetGame}
                  className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
               >
                  Play Again
               </button>
            )}
         </div>
      </div>
   )
}

export default GameStatus