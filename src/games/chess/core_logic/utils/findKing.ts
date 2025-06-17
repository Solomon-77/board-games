import type { Player, Board, Position } from "../types"

export function findKing(player: Player, board: Board): Position {
   const king = player === 'white' ? 'w_king' : 'b_king'

   for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
         if (board[r][c] === king) return { row: r, col: c }
      }
   }

   return null
}