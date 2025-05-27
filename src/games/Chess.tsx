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

const createBoard = (): Board => {
   const initialBoard: Board = Array(8).fill(null).map(() => Array(8).fill(null));

   initialBoard[0] = ['b_rook', 'b_knight', 'b_bishop', 'b_queen', 'b_king', 'b_bishop', 'b_knight', 'b_rook']
   initialBoard[1] = ['b_pawn', 'b_pawn', 'b_pawn', 'b_pawn', 'b_pawn', 'b_pawn', 'b_pawn', 'b_pawn']
   initialBoard[6] = ['w_pawn', 'w_pawn', 'w_pawn', 'w_pawn', 'w_pawn', 'w_pawn', 'w_pawn', 'w_pawn']
   initialBoard[7] = ['w_rook', 'w_knight', 'w_bishop', 'w_queen', 'w_king', 'w_bishop', 'w_knight', 'w_rook']

   return initialBoard;
}

const Chess = () => {
   const [board] = useState<Board>(createBoard)

   function getSquareColor(rowIndex: number, colIndex: number): string {
      return (rowIndex + colIndex) % 2 === 0 ? 'bg-white' : 'bg-amber-800'
   }

   return (
      <div className="max-w-[1250px] mx-auto p-4 flex flex-col items-center">

         {/* title */}
         <h1 className="font-semibold text-xl mb-4">Chess Game</h1>

         {/* display chess board */}
         <div className="grid grid-cols-8 w-full max-w-[512px] rounded-lg overflow-hidden shadow-md">
            {board.map((row, rowIndex) => (
               row.map((_, colIndex) => (
                  <div
                     key={`${rowIndex} ${colIndex}`}
                     className={`aspect-square grid place-items-center ${getSquareColor(rowIndex, colIndex)}`}
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
   );
}

export default Chess