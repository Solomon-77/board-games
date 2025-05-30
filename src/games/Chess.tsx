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

type Piece = keyof typeof pieces
type Board = (Piece | null)[][]

const createBoard = (): Board => {
   const initialBoard = Array(8).fill(null).map(() => Array(8).fill(null))

   initialBoard[0] = ['b_rook', 'b_knight', 'b_bishop', 'b_queen', 'b_king', 'b_bishop', 'b_knight', 'b_rook']
   initialBoard[1] = Array(8).fill('b_pawn')
   initialBoard[6] = Array(8).fill('w_pawn')
   initialBoard[7] = ['w_rook', 'w_knight', 'w_bishop', 'w_queen', 'w_king', 'w_bishop', 'w_knight', 'w_rook']

   return initialBoard
}

const Chess = () => {
   const [board, setBoard] = useState<Board>(createBoard)

   return (
      <>
         <div className="max-w-[1250px] mx-auto flex justify-center p-4 gap-4 select-none">
            <div className="flex-1"></div>
            <div className="flex flex-col items-center max-w-[512px] w-full gap-2">
               <div className="grid grid-cols-8 max-w-[512px] w-full rounded-lg shadow-md overflow-hidden">
                  {board.map((row, rowIndex) => (
                     row.map((piece, colIndex) => (
                        <div
                           key={`${rowIndex}-${colIndex}`}
                           className={`aspect-square grid place-items-center ${(rowIndex + colIndex) % 2 === 0 ? 'bg-white' : 'bg-amber-800'}`}
                        >
                           {piece && (
                              <img
                                 src={pieces[piece]}
                                 alt={piece}
                                 className="h-full p-[3%] select-none cursor-pointer"
                                 draggable={false}
                              />
                           )}
                        </div>
                     ))
                  ))}
               </div>
            </div>
            <div className="flex-1 min-w-[100px] bg-white shadow-md rounded-lg"></div>
         </div>
      </>
   )
}

export default Chess