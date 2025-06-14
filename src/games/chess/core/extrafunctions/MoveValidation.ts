import { isValidBishopMove } from "../moves/BishopMove";
import { isValidKingMove } from "../moves/KingMove";
import { isValidKnightMove } from "../moves/KnightMove";
import { isValidPawnMove } from "../moves/PawnMove";
import { isValidQueenMove } from "../moves/QueenMove";
import { isValidRookMove } from "../moves/RookMove";
import type { Board, CastlingRights, Piece, Player, Position } from "../types";
import { isInCheck } from "./isInCheck";
import { simulateMove } from "./simulateMove";

export function isValidMove(
   piece: Piece,
   from: Position,
   to: Position,
   board: Board,
   currentPlayer: Player,
   enPassantTarget: Position,
   hasMoved: CastlingRights
): boolean {
   if (!from || !to) return false;

   let valid = false;
   if (piece.endsWith('_pawn')) valid = isValidPawnMove(from, to, board, currentPlayer, enPassantTarget);
   else if (piece.endsWith('_rook')) valid = isValidRookMove(from, to, board, currentPlayer);
   else if (piece.endsWith('_knight')) valid = isValidKnightMove(from, to, board, currentPlayer);
   else if (piece.endsWith('_bishop')) valid = isValidBishopMove(from, to, board, currentPlayer);
   else if (piece.endsWith('_queen')) valid = isValidQueenMove(from, to, board, currentPlayer);
   else if (piece.endsWith('_king')) valid = isValidKingMove(from, to, board, currentPlayer, hasMoved);

   if (!valid) return false;

   // After confirming the move is pseudo-legal, check if it leaves the king in check
   const simulated = simulateMove(board, from, to);
   if (!simulated) return false;

   return !isInCheck(currentPlayer, simulated);
}