import { useChessStore } from "../chessStore"
import type { Position } from "../types"
import { isCurrentPlayerPiece } from "../utils/isCurrentPlayerPiece"

export function isValidKnightMove(from: Position, to: Position): boolean {
   const { board } = useChessStore.getState()
   if (!from || !to) return false

   const isKnightMove =
      (Math.abs(from.row - to.row) === 2 && Math.abs(from.col - to.col) === 1) ||
      (Math.abs(from.col - to.col) === 2 && Math.abs(from.row - to.row) === 1)

   if (!isKnightMove) return false

   const target = board[to.row][to.col]
   if (target && isCurrentPlayerPiece(target)) return false

   return true
}