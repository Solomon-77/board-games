import { useChessStore } from "../chessStore"
import type { Position } from "../types"
import { isCurrentPlayerPiece } from "../utils/isCurrentPlayerPiece"

export function isValidPawnMove(from: Position, to: Position): boolean {
   const { board, currentPlayer, enPassantTarget } = useChessStore.getState()
   if (!from || !to) return false

   const direction = currentPlayer === 'white' ? -1 : 1
   const startRow = currentPlayer === 'white' ? 6 : 1

   const oneStepForward = to.row === from.row + direction && to.col === from.col
   const twoStepForward = from.row === startRow && to.row === from.row + 2 * direction && to.col === from.col
   const isTargetEmpty = board[to.row][to.col] === null

   if (oneStepForward && isTargetEmpty) return true
   if (twoStepForward && isTargetEmpty && board[from.row + direction][from.col] === null) return true

   const isDiagonalCapture =
      Math.abs(to.col - from.col) === 1 &&
      to.row === from.row + direction &&
      board[to.row][to.col] !== null &&
      !isCurrentPlayerPiece(board[to.row][to.col]!)

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