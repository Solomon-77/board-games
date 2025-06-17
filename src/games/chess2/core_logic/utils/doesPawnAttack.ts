import type { Position, Board } from "../types";

export function doesPawnAttack(from: Position, target: Position, board: Board): boolean {
   if (!from || !target) return false;

   const piece = board[from.row][from.col]!;
   const isWhite = piece.startsWith('w_');

   const dir = isWhite ? -1 : 1;

   return (
      Math.abs(target.col - from.col) === 1 &&
      target.row === from.row + dir
   );
}