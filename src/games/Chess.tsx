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
type Player = 'white' | 'black'
type Position = {
   row: number,
   col: number
} | null

const createBoard = (): Board => {
   const initialBoard: Board = Array(8).fill(null).map(() => Array(8).fill(null))

   initialBoard[0] = ['b_rook', 'b_knight', 'b_bishop', 'b_queen', 'b_king', 'b_bishop', 'b_knight', 'b_rook']
   initialBoard[1] = Array(8).fill('b_pawn')
   initialBoard[6] = Array(8).fill('w_pawn')
   initialBoard[7] = ['w_rook', 'w_knight', 'w_bishop', 'w_queen', 'w_king', 'w_bishop', 'w_knight', 'w_rook']

   return initialBoard
}

const Chess = () => {
   const [board, setBoard] = useState<Board>(createBoard)
   const [currentPlayer, setCurrentPlayer] = useState<Player>('white') // currentPlayer is white by default
   const [selectedPiece, setSelectedPiece] = useState<Position>(null)

   function isCurrentPlayerPiece(piece: Piece): boolean {
      return currentPlayer === 'white' ? piece.startsWith('w_') : piece.startsWith('b_')
   } // piece.startsWith returns true or false value

   function clickAndMovePiece(row: number, col: number) {
      const clickedPiece = board[row][col]

      // if there is no selected piece then select a piece that is owned by current player
      if (!selectedPiece) {
         if (clickedPiece && isCurrentPlayerPiece(clickedPiece)) {
            setSelectedPiece({ row, col })
         }
         return
      }

      // if clicking the same piece then deselect
      if (selectedPiece.row === row && selectedPiece.col === col) {
         setSelectedPiece(null)
         return
      }

      // if click another piece then select it instead
      if (clickedPiece && isCurrentPlayerPiece(clickedPiece)) {
         setSelectedPiece({ row, col })
         return
      }

      // move piece
      const piece = board[selectedPiece.row][selectedPiece.col] // outputs piece like 'w_pawn'
      if (piece && isValidMove(piece, selectedPiece, { row, col })) {
         movePiece(selectedPiece, { row, col })
      }
      setSelectedPiece(null)
   }

   function isValidPawnMove(from: Position, to: Position): boolean {
      if (!from || !to) return false

      const direction = currentPlayer === 'white' ? -1 : 1
      const startRow = currentPlayer === 'white' ? 6 : 1

      const oneStepForward = to.row === from.row + direction && to.col === from.col
      const twoStepForward = from.row === startRow && to.row === from.row + 2 * direction && to.col === from.col
      const isTargetEmpty = board[to.row][to.col] === null

      if (oneStepForward && isTargetEmpty) return true
      if (twoStepForward && isTargetEmpty && board[from.row + direction][from.col] === null) return true

      // diagonal capture
      const isDiagonalCapture =
         Math.abs(to.col - from.col) === 1 &&
         to.row === from.row + direction &&
         board[to.row][to.col] !== null &&
         !isCurrentPlayerPiece(board[to.row][to.col]!)

      if (isDiagonalCapture) return true

      return false
   }

   function isValidMove(piece: Piece, from: Position, to: Position): boolean {
      if (!from || !to) return false;

      switch (piece) {
         case 'w_pawn':
         case 'b_pawn':
            return isValidPawnMove(from, to)
         default:
            return false;
      }
   }

   function movePiece(from: Position, to: Position) {
      if (!from || !to) return;

      const newBoard = board.map(row => [...row]);
      newBoard[to.row][to.col] = newBoard[from.row][from.col];
      newBoard[from.row][from.col] = null;

      setBoard(newBoard);
      setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
   }

   return (
      <>
         <div className="max-w-[1250px] mx-auto flex justify-center p-4 gap-4 select-none">
            <div className="flex-1"></div>
            <div className="flex flex-col items-center max-w-[512px] w-full gap-2">
               <div className="grid grid-cols-8 max-w-[512px] w-full rounded-lg shadow-md overflow-hidden">
                  {board.map((row, rowIndex) => (
                     row.map((piece, colIndex) => (
                        <div
                           onClick={() => clickAndMovePiece(rowIndex, colIndex)}
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