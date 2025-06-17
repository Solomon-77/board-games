import { useChessStore } from "../chessStore";
import { isValidBishopMove } from "../piece_moves/bishopMove";
import { isValidKingMove } from "../piece_moves/kingMove";
import { isValidKnightMove } from "../piece_moves/knightMove";
import { isValidPawnMove } from "../piece_moves/pawnMove";
import { isValidQueenMove } from "../piece_moves/queenMove";
import { isValidRookMove } from "../piece_moves/rookMove";
import type { Piece, Position } from "../types";
import { isInCheck } from "./isInCheck";
import { simulateMove } from "./simulateMove";

export function isValidMove(piece: Piece, from: Position, to: Position): boolean {
   const { board, currentPlayer } = useChessStore.getState()

   if (!from || !to) return false;

   let valid = false;

   if (piece.endsWith('_pawn')) valid = isValidPawnMove(from, to);
   else if (piece.endsWith('_rook')) valid = isValidRookMove(from, to);
   else if (piece.endsWith('_knight')) valid = isValidKnightMove(from, to);
   else if (piece.endsWith('_bishop')) valid = isValidBishopMove(from, to);
   else if (piece.endsWith('_queen')) valid = isValidQueenMove(from, to);
   else if (piece.endsWith('_king')) valid = isValidKingMove(from, to);

   if (!valid) return false;

   const simulated = simulateMove(board, from, to);
   if (!simulated) return false;

   return !isInCheck(currentPlayer, simulated);
   return true
}