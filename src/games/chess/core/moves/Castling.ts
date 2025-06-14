import { isInCheck } from "../extrafunctions/isInCheck";
import { simulateMove } from "../extrafunctions/simulateMove";
import type { Board, CastlingRights, Player, Position } from "../types";

export function isValidCastling(from: Position, to: Position, board: Board, currentPlayer: Player, hasMoved: CastlingRights): boolean {
   if (!from || !to) return false;

   const kingMoved = currentPlayer === 'white' ? hasMoved.w_king : hasMoved.b_king;
   const rookMoved = currentPlayer === 'white'
      ? (to.col > from.col ? hasMoved.w_rook_king : hasMoved.w_rook_queen)
      : (to.col > from.col ? hasMoved.b_rook_king : hasMoved.b_rook_queen);

   if (kingMoved || rookMoved) return false;

   // Check if path is clear between king and rook
   const castleDirection = to.col > from.col ? 1 : -1;
   const rookCol = castleDirection === 1 ? 7 : 0;
   for (let c = from.col + castleDirection; c !== rookCol; c += castleDirection) {
      if (board[from.row][c] !== null) return false;
   }

   // King cannot be in check
   if (isInCheck(currentPlayer, board)) return false;

   // King cannot pass through a square that is under attack
   for (let step = 1; step <= 2; step++) {
      const col = from.col + castleDirection * step;
      const testBoard = simulateMove(board, from, { row: from.row, col });
      if (isInCheck(currentPlayer, testBoard!)) return false;
   }

   return true;
}