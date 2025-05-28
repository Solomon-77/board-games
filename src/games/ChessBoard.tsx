// ChessBoard.tsx
import type { Board, Piece, Position } from './Chess/types';
import { pieces } from './Chess/types'
import { getSquareColor, isSelectedSquare } from './Chess/boardUtils';

interface ChessBoardProps {
   board: Board;
   selectedPiece: Position;
   onSquareClick: (row: number, col: number) => void;
}

export const ChessBoard = ({ board, selectedPiece, onSquareClick }: ChessBoardProps) => {
   return (
      <div className="grid grid-cols-8 w-full max-w-[512px] rounded-lg overflow-hidden shadow-md">
         {board.map((row, rowIndex) => (
            row.map((_, colIndex) => (
               <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`aspect-square grid place-items-center ${getSquareColor(rowIndex, colIndex)} ${isSelectedSquare(selectedPiece, rowIndex, colIndex) ? 'border-4 border-blue-500' : ''
                     }`}
                  onClick={() => onSquareClick(rowIndex, colIndex)}
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
   );
}