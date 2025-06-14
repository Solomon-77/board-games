import type { pieces } from "./constants";

export type Piece = keyof typeof pieces
export type Board = (Piece | null)[][]
export type Player = 'white' | 'black'

export type Position = {
    row: number,
    col: number
} | null