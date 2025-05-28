import type { Piece, Position, Board, Player } from './types';
import { isPieceOwnedByCurrentPlayer } from './boardUtils';

export function isValidMove(piece: Piece, from: Position, to: Position, board: Board, currentPlayer: Player): boolean {
   if (!from || !to) return false;

   const pieceType = piece.split('_')[1]

   switch (pieceType) {
      case 'pawn':
         return isValidPawnMove(piece, from, to, board, currentPlayer)
      // case 'rook':
      //    return isValidRookMove(from, to, board)
      // case 'bishop':
      //    return isValidBishopMove(from, to, board)
      // case 'knight':
      //    return isValidKnightMove(from, to)
      // case 'king':
      //    return isValidKingMove(from, to)
      // case 'queen':
      //    return isValidQueenMove(from, to, board)
      default:
         return false;
   }
}

export function isValidPawnMove(piece: Piece, from: Position, to: Position, board: Board, currentPlayer: Player): boolean {
   if (!from || !to) return false;

   const isWhite = piece.startsWith('w_')
   const direction = isWhite ? -1 : 1
   const startRow = isWhite ? 6 : 1

   const rowDiff = to.row - from.row
   const colDiff = Math.abs(to.col - from.col)

   // Moving forward
   if (colDiff === 0) {
      if (rowDiff === direction && !board[to.row][to.col]) {
         return true
      }
      if (rowDiff === direction * 2 && from.row === startRow &&
         !board[to.row][to.col] && !board[from.row + direction][from.col]) {
         return true
      }
   }

   // Diagonal capture
   if (colDiff === 1 && rowDiff === direction) {
      const targetPiece = board[to.row][to.col]
      if (targetPiece && !isPieceOwnedByCurrentPlayer(targetPiece, currentPlayer)) {
         return true
      }
   }

   return false
}

// // Placeholder functions for other pieces
// export function isValidRookMove(from: Position, to: Position, board: Board): boolean {
//    // Implement rook movement logic
//    return true; // Temporary
// }

// export function isValidBishopMove(from: Position, to: Position, board: Board): boolean {
//    // Implement bishop movement logic
//    return true; // Temporary
// }

// export function isValidKnightMove(from: Position, to: Position): boolean {
//    // Implement knight movement logic
//    return true; // Temporary
// }

// export function isValidKingMove(from: Position, to: Position): boolean {
//    // Implement king movement logic
//    return true; // Temporary
// }

// export function isValidQueenMove(from: Position, to: Position, board: Board): boolean {
//    // Queen moves like rook + bishop
//    return isValidRookMove(from, to, board) || isValidBishopMove(from, to, board);
// }