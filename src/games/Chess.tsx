// Chess.tsx
import { useState } from "react"
import type { Board, Position, Player } from './Chess/types'
import { createBoard, isPieceOwnedByCurrentPlayer } from './Chess/boardUtils'
import { isValidMove } from './Chess/gameLogic'
import { ChessBoard } from './ChessBoard'

const Chess = () => {
   const [board, setBoard] = useState<Board>(createBoard)
   const [selectedPiece, setSelectedPiece] = useState<Position>(null)
   const [currentPlayer, setCurrentPlayer] = useState<Player>("white")

   function makeMove(from: Position, to: Position) {
      if (!from || !to) return;

      const newBoard = board.map(row => [...row])
      newBoard[to.row][to.col] = newBoard[from.row][from.col]
      newBoard[from.row][from.col] = null
      setBoard(newBoard)
      setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white')
   }

   function handleSquareClick(row: number, col: number) {
      const clickedPiece = board[row][col]

      if (!selectedPiece) {
         if (clickedPiece && isPieceOwnedByCurrentPlayer(clickedPiece, currentPlayer)) {
            setSelectedPiece({ row, col })
         }
         return
      }

      if (selectedPiece.row === row && selectedPiece.col === col) {
         setSelectedPiece(null)
         return
      }

      if (clickedPiece && isPieceOwnedByCurrentPlayer(clickedPiece, currentPlayer)) {
         setSelectedPiece({ row, col })
         return
      }

      const piece = board[selectedPiece.row][selectedPiece.col]
      if (piece && isValidMove(piece, selectedPiece, { row, col }, board, currentPlayer)) {
         makeMove(selectedPiece, { row, col })
      }

      setSelectedPiece(null)
   }

   return (
      <div className="max-w-[1250px] mx-auto p-4 flex justify-center gap-4">
         <div className="flex-1"></div>

         <div className="flex flex-col items-center w-full max-w-[512px]">
            <h1 className="font-semibold text-xl mb-4">Chess Game</h1>

            <ChessBoard
               board={board}
               selectedPiece={selectedPiece}
               onSquareClick={handleSquareClick}
            />

            <p className="mt-4 text-center">Current Player: {currentPlayer}</p>
         </div>

         <div className="flex-1"></div>
      </div>
   );
}

export default Chess