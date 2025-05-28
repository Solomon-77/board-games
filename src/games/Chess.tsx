import { useState } from "react"

const pieces = {
   b_rook: '/chess_piece/black/black_rook.svg',
   b_knight: '/chess_piece/black/black_knight.svg',
   b_bishop: '/chess_piece/black/black_bishop.svg',
   b_queen: '/chess_piece/black/black_queen.svg',
   b_king: '/chess_piece/black/black_king.svg',
   b_pawn: '/chess_piece/black/black_pawn.svg',
   w_rook: '/chess_piece/white/white_rook.svg',
   w_knight: '/chess_piece/white/white_knight.svg',
   w_bishop: '/chess_piece/white/white_bishop.svg',
   w_queen: '/chess_piece/white/white_queen.svg',
   w_king: '/chess_piece/white/white_king.svg',
   w_pawn: '/chess_piece/white/white_pawn.svg',
}

type Piece = keyof typeof pieces;
type Board = (Piece | null)[][];
type Position = {
   row: number,
   col: number
} | null;
type Player = "white" | "black"

const createBoard = (): Board => {
   const initialBoard: Board = Array(8).fill(null).map(() => Array(8).fill(null));

   initialBoard[0] = ['b_rook', 'b_knight', 'b_bishop', 'b_queen', 'b_king', 'b_bishop', 'b_knight', 'b_rook']
   initialBoard[1] = Array(8).fill('b_pawn')
   initialBoard[6] = Array(8).fill('w_pawn')
   initialBoard[7] = ['w_rook', 'w_knight', 'w_bishop', 'w_queen', 'w_king', 'w_bishop', 'w_knight', 'w_rook']

   return initialBoard;
}

const Chess = () => {
   const [board, setBoard] = useState<Board>(createBoard)
   const [selectedPiece, setSelectedPiece] = useState<Position>(null)
   const [currentPlayer, setCurrentPlayer] = useState<Player>("white")

   function getSquareColor(rowIndex: number, colIndex: number): string {
      return (rowIndex + colIndex) % 2 === 0 ? 'bg-white' : 'bg-amber-800'
   }

   function isSelectedSquare(row: number, col: number): boolean {
      return selectedPiece?.row === row && selectedPiece?.col === col
   }

   function isPieceOwnedByCurrentPlayer(piece: Piece): boolean {
      return currentPlayer === 'white' ? piece.startsWith('w_') : piece.startsWith('b_')
   }

   function makeMove(from: Position, to: Position) {
      // Add null checks here as well for safety
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
         if (clickedPiece && isPieceOwnedByCurrentPlayer(clickedPiece)) {
            setSelectedPiece({ row, col })
         }
         return
      }

      if (selectedPiece.row === row && selectedPiece.col === col) {
         setSelectedPiece(null)
         return
      }

      if (clickedPiece && isPieceOwnedByCurrentPlayer(clickedPiece)) {
         setSelectedPiece({ row, col })
         return
      }

      // try to move the piece
      const piece = board[selectedPiece.row][selectedPiece.col]
      if (piece && isValidMove(piece, selectedPiece, { row, col })) {
         makeMove(selectedPiece, { row, col })
      }

      setSelectedPiece(null)
   }

   // check if valid move
   function isValidMove(piece: Piece, from: Position, to: Position): boolean {
      // Add null checks for from and to positions
      if (!from || !to) return false;

      const pieceType = piece.split('_')[1]

      switch (pieceType) {
         case 'pawn':
            return isValidPawnMove(piece, from, to)
         default:
            return false;
      }
   }

   // piece valid moves
   function isValidPawnMove(piece: Piece, from: Position, to: Position): boolean {
      // Add null checks for from and to positions
      if (!from || !to) return false;

      const isWhite = piece.startsWith('w_')
      const direction = isWhite ? -1 : 1 // White moves up (-1), black moves down (+1)
      const startRow = isWhite ? 6 : 1

      const rowDiff = to.row - from.row
      const colDiff = Math.abs(to.col - from.col)

      // Moving forward
      if (colDiff === 0) {
         // One square forward
         if (rowDiff === direction && !board[to.row][to.col]) {
            return true
         }
         // Two squares forward from starting position
         if (rowDiff === direction * 2 && from.row === startRow && !board[to.row][to.col] && !board[from.row + direction][from.col]) {
            return true
         }
      }

      // Diagonal capture
      if (colDiff === 1 && rowDiff === direction) {
         const targetPiece = board[to.row][to.col]
         if (targetPiece && !isPieceOwnedByCurrentPlayer(targetPiece)) {
            return true
         }
      }

      return false
   }

   // function isValidRookMove() {

   // }

   // function isValidBishopMove() {

   // }

   // function isValidKnightMove() {

   // }

   // function isValidKingMove() {

   // }

   // function isValidQueenMove() {

   // }

   return (
      <div className="max-w-[1250px] mx-auto p-4 flex justify-center gap-4">

         <div className="flex-1">

         </div>

         <div className="flex flex-col items-center w-full max-w-[512px]">
            {/* title */}
            <h1 className="font-semibold text-xl mb-4">Chess Game</h1>

            {/* display chess board */}
            <div className="grid grid-cols-8 w-full max-w-[512px] rounded-lg overflow-hidden shadow-md">
               {board.map((row, rowIndex) => (
                  row.map((_, colIndex) => (
                     <div
                        key={`${rowIndex} ${colIndex}`}
                        className={`aspect-square grid place-items-center ${getSquareColor(rowIndex, colIndex)} ${isSelectedSquare(rowIndex, colIndex) ? 'border-4 border-blue-500' : ''}`} // Add conditional class for selection
                        onClick={() => handleSquareClick(rowIndex, colIndex)}
                     >
                        {board[rowIndex][colIndex] && (
                           <img
                              src={pieces[board[rowIndex][colIndex] as Piece]}
                              alt={board[rowIndex][colIndex]}
                              className="w-full h-full p-[2px] cursor-pointer select-none"
                           />
                        )}
                     </div>
                  ))
               ))}
            </div>
         </div>

         {/* chat room */}
         <div className="bg-white flex-1 rounded-lg shadow-md">

         </div>

      </div>
   );
}

export default Chess