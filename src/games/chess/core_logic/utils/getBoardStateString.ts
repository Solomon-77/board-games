import type { Board } from "../types";

export function getBoardStateString(currentBoard: Board): string {
   return currentBoard.map(row => row.map(piece => piece || 'null').join(',')).join(';');
}