import type { CastlingRights, PromotionPiece } from "./types";

export const pieces = {
   b_rook: '/chess_piece/black/black_rook.svg',
   b_knight: '/chess_piece/black/black_knight.svg',
   b_bishop: '/chess_piece/black/black_bishop.svg',
   b_queen: '/chess_piece/black/black_queen.svg',
   b_king: '/chess_piece/black/black_king.svg',
   b_pawn: '/chess_piece/black/black_pawn.svg',
   w_rook: '/chess_piece/white/white_rook.svg',
   w_knight: '/chess_piece/white/white_knight.svg',
   w_bishop: '/chess_piece/white/white_bishop.svg',
   w_queen: '/chess_piece/white/white_queen.svg',
   w_king: '/chess_piece/white/white_king.svg',
   w_pawn: '/chess_piece/white/white_pawn.svg'
}

export const initialCastlingRights: CastlingRights = {
   w_king: false,
   b_king: false,
   w_rook_king: false,
   w_rook_queen: false,
   b_rook_king: false,
   b_rook_queen: false,
};

export const promotionPieceTypes: PromotionPiece[] = [
   'queen', 'rook', 'bishop', 'knight'
]