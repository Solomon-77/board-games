import { useChessStore } from "../chessStore";
import type { Position } from "../types";
import { simulateMove } from "./simulateMove";

export function movePiece(from: Position, to: Position) {
    const { board, setBoard, currentPlayer, setCurrentPlayer, enPassantTarget, setEnPassantTarget } = useChessStore.getState()
    if (!from || !to) return;
    const piece = board[from.row][from.col]

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

    if (isEnPassantCapture) newBoard[from.row][to.col] = null;
    setBoard(newBoard)

    setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
}