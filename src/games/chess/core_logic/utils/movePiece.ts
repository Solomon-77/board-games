import { useChessStore } from "../chessStore";
import type { CastlingRights, Position } from "../types";
import { getBoardStateString } from "./getBoardStateString";
import { simulateMove } from "./simulateMove";

export function movePiece(from: Position, to: Position) {
   const { board, setBoard, currentPlayer, setCurrentPlayer, enPassantTarget, setEnPassantTarget, setHasMoved, setPromotionChoice, setBoardHistory } = useChessStore.getState()

   if (!from || !to) return;
   const piece = board[from.row][from.col]

   setHasMoved(prev => {
      const update: Partial<CastlingRights> = {};
      if (piece === 'w_king') update.w_king = true;
      if (piece === 'b_king') update.b_king = true;
      if (piece === 'w_rook') {
         if (from.row === 7 && from.col === 0) update.w_rook_queen = true;
         if (from.row === 7 && from.col === 7) update.w_rook_king = true;
      }
      if (piece === 'b_rook') {
         if (from.row === 0 && from.col === 0) update.b_rook_queen = true;
         if (from.row === 0 && from.col === 7) update.b_rook_king = true;
      }
      return { ...prev, ...update };
   });

   const direction = currentPlayer === 'white' ? -1 : 1;
   const canBeCapturedEnPassant = piece?.endsWith('_pawn') && Math.abs(from.row - to.row) === 2

   const isEnPassantCapture =
      piece?.endsWith('_pawn') &&
      Math.abs(to.col - from.col) === 1 &&
      board[to.row][to.col] === null &&
      enPassantTarget &&
      enPassantTarget.row === to.row &&
      enPassantTarget.col === to.col;

   if (canBeCapturedEnPassant) {
      setEnPassantTarget({ row: from.row + direction, col: from.col });
   } else {
      setEnPassantTarget(null);
   }

   const newBoard = simulateMove(board, from, to)
   if (!newBoard) return

   // castling
   if ((piece === "w_king" || piece === "b_king") && Math.abs(from.col - to.col) === 2) {
      const row = from.row
      if (to.col > from.col) {
         newBoard[row][5] = newBoard[row][7]
         newBoard[row][7] = null
      } else {
         newBoard[row][3] = newBoard[row][0]
         newBoard[row][0] = null
      }
   }

   if (isEnPassantCapture) newBoard[from.row][to.col] = null;
   setBoard(newBoard)

   // Check for Pawn Promotion
   const isPawn = piece?.endsWith('_pawn');
   const promotionRank = currentPlayer === 'white' ? 0 : 7;
   const isPromotion = isPawn && to.row === promotionRank;

   setBoard(newBoard);
   // Add the new board state to history AFTER setting the board
   setBoardHistory(prev => [...prev, getBoardStateString(newBoard)]);

   if (isPromotion) {
      // Pause the game and wait for the user to choose a promotion piece
      setPromotionChoice(to);
   } else {
      // Continue the game normally
      setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
   }
}