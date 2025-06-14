import type { Position } from "../types";
import { useChessState } from "../useHooks";
import { simulateMove } from "./simulateMove";

export function useMovePiece() {
    const { board, setBoard, currentPlayer, setCurrentPlayer } = useChessState()

    function movePiece(from: Position, to: Position) {
        if (!from || !to) return;

        const newBoard = simulateMove(board, from, to)
        setBoard(newBoard!)

        setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
    }

    return { movePiece }
}