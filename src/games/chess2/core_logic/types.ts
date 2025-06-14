import type { pieces } from "./constants";

export type Piece = keyof typeof pieces
export type Board = (Piece | null)[][]