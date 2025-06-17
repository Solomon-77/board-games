import type { pieces } from "./constants";

export type Piece = keyof typeof pieces
export type Board = (Piece | null)[][]
export type Player = 'white' | 'black'
export type GameState = 'playing' | 'checkmate' | 'stalemate';
export type PromotionPiece = 'queen' | 'rook' | 'bishop' | 'knight'

export type Position = {
   row: number,
   col: number
} | null

export type CastlingRights = {
   w_king: boolean;
   b_king: boolean;
   w_rook_king: boolean;
   w_rook_queen: boolean;
   b_rook_king: boolean;
   b_rook_queen: boolean;
}