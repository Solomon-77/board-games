import type { Player, Board } from "../types";
import { canPieceAttack } from "./canPieceAttack";
import { findKing } from "./findKing";

export function isInCheck(player: Player, board: Board): boolean {
   const kingPos = findKing(player, board)!
   if (!kingPos) return false; // Should not happen in a real game

   const opponent = player === 'white' ? 'black' : 'white'

   for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
         const piece = board[r][c]
         if (!piece || (opponent === 'white' ? !piece.startsWith('w_') : !piece.startsWith('b_')))
            continue
         const from = { row: r, col: c }
         if (canPieceAttack(piece, from, kingPos, board)) return true
      }
   }

   return false
}