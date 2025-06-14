import { isCurrentPlayerPiece } from "../extrafunctions/isCurrentPlayerPiece";
import type { Board, Player, Position } from "../types";

export function isValidPawnMove(from: Position, to: Position, board: Board, currentPlayer: Player, enPassantTarget: Position): boolean {
    if (!from || !to) return false;

    const direction = currentPlayer === 'white' ? -1 : 1;
    const startRow = currentPlayer === 'white' ? 6 : 1;

    // Standard 1-step forward move
    const oneStepForward = to.row === from.row + direction && to.col === from.col;
    const isTargetEmpty = board[to.row][to.col] === null;
    if (oneStepForward && isTargetEmpty) return true;

    // Initial 2-step forward move
    const twoStepForward = from.row === startRow && to.row === from.row + 2 * direction && to.col === from.col;
    if (twoStepForward && isTargetEmpty && board[from.row + direction][from.col] === null) return true;

    // Diagonal capture
    const isDiagonalCapture =
        Math.abs(to.col - from.col) === 1 &&
        to.row === from.row + direction &&
        board[to.row][to.col] !== null &&
        !isCurrentPlayerPiece(board[to.row][to.col]!, currentPlayer);

    // En passant capture
    const isEnPassantCapture =
        Math.abs(to.col - from.col) === 1 &&
        to.row === from.row + direction &&
        board[to.row][to.col] === null &&
        enPassantTarget &&
        enPassantTarget.row === to.row &&
        enPassantTarget.col === to.col;

    if (isDiagonalCapture || isEnPassantCapture) return true;

    return false;
}