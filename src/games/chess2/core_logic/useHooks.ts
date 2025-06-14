import { useState } from "react"
import type { Board, Player, Position } from "./types"
import { createBoard } from "./utils/createBoard"

export function useChessState() {
	const [board, setBoard] = useState<Board>(createBoard)
	const [currentPlayer, setCurrentPlayer] = useState<Player>('white')
	const [selectedPiece, setSelectedPiece] = useState<Position>(null)

	return {
		board, setBoard,
		currentPlayer, setCurrentPlayer,
		selectedPiece, setSelectedPiece
	}
}