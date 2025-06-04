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
   const [enPassantTarget, setEnPassantTarget] = useState<Position>(null)

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

      // attempt move
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

      // pawn move
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

      // en passant capture
      const isEnPassantCapture =
         Math.abs(to.col - from.col) === 1 &&
         to.row === from.row + direction &&
         board[to.row][to.col] === null &&
         enPassantTarget &&
         enPassantTarget.row === to.row &&
         enPassantTarget.col === to.col

      if (isDiagonalCapture || isEnPassantCapture) return true

      return false
   }

   function isValidRookMove(from: Position, to: Position): boolean {
      if (!from || !to) return false

      const isVerticalOrHorizontal =
         (from.row === to.row && from.col !== to.col) || // horizontal
         (from.col === to.col && from.row !== to.row)  // vertical

      if (!isVerticalOrHorizontal) return false

      const rowStep = to.row === from.row ? 0 : (to.row > from.row ? 1 : -1);
      const colStep = to.col === from.col ? 0 : (to.col > from.col ? 1 : -1);

      for (
         let currRow = from.row + rowStep, currCol = from.col + colStep;
         currRow !== to.row || currCol !== to.col;
         currRow += rowStep, currCol += colStep
      ) {
         if (board[currRow][currCol] !== null) return false;
      }

      // capture enemy piece not your own piece
      const target = board[to.row][to.col];
      if (target && isCurrentPlayerPiece(target)) return false;

      return true;
   }

   function isValidKnightMove(from: Position, to: Position): boolean {
      if (!from || !to) return false

      const isKnightMove =
         Math.abs(from.row - to.row) === 2 && Math.abs(from.col - to.col) === 1 ||
         Math.abs(from.col - to.col) === 2 && Math.abs(from.row - to.row) === 1

      if (!isKnightMove) return false

      const target = board[to.row][to.col]
      if (target && isCurrentPlayerPiece(target)) return false

      return true
   }

   function isValidBishopMove(from: Position, to: Position): boolean {
      if (!from || !to) return false

      const isBishopMove = Math.abs(from.row - to.row) === Math.abs(from.col - to.col)

      if (!isBishopMove) return false

      const rowStep = (to.row - from.row) > 0 ? 1 : -1; // to row 5 - from row 7
      const colStep = (to.col - from.col) > 0 ? 1 : -1;

      for (
         let r = from.row + rowStep, c = from.col + colStep;
         r !== to.row;
         r += rowStep, c += colStep
      ) {
         if (board[r][c]) return false; // Blocked
      }

      // capture
      const target = board[to.row][to.col];
      if (target && isCurrentPlayerPiece(target)) return false;

      return true
   }

   function isValidMove(piece: Piece, from: Position, to: Position): boolean {
      if (!from || !to) return false;

      if (piece.endsWith('_pawn')) return isValidPawnMove(from, to);
      if (piece.endsWith('_rook')) return isValidRookMove(from, to);
      if (piece.endsWith('_knight')) return isValidKnightMove(from, to);
      if (piece.endsWith('_bishop')) return isValidBishopMove(from, to);
      // if (piece.endsWith('_queen')) return isValidQueenMove(from, to);
      // if (piece.endsWith('_king')) return isValidKingMove(from, to);

      return false;
   }

   function movePiece(from: Position, to: Position) {
      if (!from || !to) return;

      const direction = currentPlayer === 'white' ? -1 : 1;
      const canBeCapturedEnPassant = Math.abs(from.row - to.row) === 2

      const isEnPassantCapture =
         Math.abs(to.col - from.col) === 1 &&
         to.row === from.row + direction &&
         board[to.row][to.col] === null &&
         enPassantTarget &&
         enPassantTarget.row === to.row &&
         enPassantTarget.col === to.col;

      if (canBeCapturedEnPassant) {
         setEnPassantTarget({ row: from.row + direction, col: from.col }); // set square as en passant target
      } else {
         setEnPassantTarget(null);
      }

      const newBoard = board.map(row => [...row]);
      newBoard[to.row][to.col] = newBoard[from.row][from.col];
      newBoard[from.row][from.col] = null;

      if (isEnPassantCapture) newBoard[from.row][to.col] = null; // remove captured pawn

      setBoard(newBoard);
      setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
   }

   function isSquareSelected(row: number, col: number): string {
      const isLight = (row + col) % 2 === 0
      const isSelected = selectedPiece?.row === row && selectedPiece?.col === col

      if (isSelected) {
         return isLight ? 'bg-neutral-300' : 'bg-amber-900'
      } else {
         return isLight ? 'bg-white' : 'bg-amber-800'
      }
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
                           className={`aspect-square grid place-items-center ${isSquareSelected(rowIndex, colIndex)}`}
                        >
                           {piece && (
                              <img
                                 src={pieces[piece]}
                                 alt={piece}
                                 className={`h-full p-[3%] select-none ${isCurrentPlayerPiece(piece) ? 'cursor-pointer' : 'cursor-default'}`}
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