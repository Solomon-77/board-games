import type { Board, Piece, Position, Player } from './types';

export const createBoard = (): Board => {
   const initialBoard: Board = Array(8).fill(null).map(() => Array(8).fill(null));

   initialBoard[0] = ['b_rook', 'b_knight', 'b_bishop', 'b_queen', 'b_king', 'b_bishop', 'b_knight', 'b_rook']
   initialBoard[1] = Array(8).fill('b_pawn')
   initialBoard[6] = Array(8).fill('w_pawn')
   initialBoard[7] = ['w_rook', 'w_knight', 'w_bishop', 'w_queen', 'w_king', 'w_bishop', 'w_knight', 'w_rook']

   return initialBoard;
}

export function getSquareColor(rowIndex: number, colIndex: number): string {
   return (rowIndex + colIndex) % 2 === 0 ? 'bg-white' : 'bg-amber-800'
}

export function isSelectedSquare(selectedPiece: Position, row: number, col: number): boolean {
   return selectedPiece?.row === row && selectedPiece?.col === col
}

export function isPieceOwnedByCurrentPlayer(piece: Piece, currentPlayer: Player): boolean {
   return currentPlayer === 'white' ? piece.startsWith('w_') : piece.startsWith('b_')
}