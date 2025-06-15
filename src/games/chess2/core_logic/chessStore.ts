import { create } from 'zustand'
import type { Board, Player, Position } from './types'
import { createBoard } from './utils/createBoard'

interface ChessState {
   board: Board
   setBoard: (board: Board) => void
   currentPlayer: Player
   setCurrentPlayer: (player: Player) => void
   selectedPiece: Position | null
   setSelectedPiece: (pos: Position | null) => void
   enPassantTarget: Position | null
   setEnPassantTarget: (pos: Position | null) => void
}

export const useChessStore = create<ChessState>((set) => ({
   board: createBoard(),
   setBoard: (board) => set({ board }),
   currentPlayer: 'white',
   setCurrentPlayer: (player) => set({ currentPlayer: player }),
   selectedPiece: null,
   setSelectedPiece: (pos) => set({ selectedPiece: pos }),
   enPassantTarget: null,
   setEnPassantTarget: (pos) => set({ enPassantTarget: pos })
}))
