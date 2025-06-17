import { useChessStore } from "../chessStore";
import type { Position } from "../types";
import { isInCheck } from "./isInCheck";
import { simulateMove } from "./simulateMove";

export function isValidCastling(from: Position, to: Position): boolean {
   const { board, currentPlayer, hasMoved } = useChessStore.getState()
   if (!from || !to) return false;

   const kingMoved = currentPlayer === 'white' ? hasMoved.w_king : hasMoved.b_king
   const rookMoved = currentPlayer === 'white'
      ? (to.col > from.col ? hasMoved.w_rook_king : hasMoved.w_rook_queen)
      : (to.col > from.col ? hasMoved.b_rook_king : hasMoved.b_rook_queen)

   if (kingMoved || rookMoved) return false

   const castleDirection = to.col > from.col ? 1 : -1

   for (let c = from.col + castleDirection; c !== to.col; c += castleDirection) {
      if (board[from.row][c] !== null) return false
   }

   if (isInCheck(currentPlayer, board)) return false

   for (let step = 1; step <= 2; step++) {
      const col = from.col + castleDirection * step
      const testBoard = simulateMove(board, from, { row: from.row, col })

      if (isInCheck(currentPlayer, testBoard!)) return false
   }

   return true
}