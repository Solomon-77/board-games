import { create } from 'zustand'
import type { Board, CastlingRights, Player, Position } from './types'
import { createBoard } from './utils/createBoard'
import { initialCastlingRights } from './constants'

interface ChessState {
   board: Board
   setBoard: (board: Board) => void
   currentPlayer: Player
   setCurrentPlayer: (player: Player) => void
   selectedPiece: Position | null
   setSelectedPiece: (pos: Position | null) => void
   enPassantTarget: Position | null
   setEnPassantTarget: (pos: Position | null) => void
   hasMoved: CastlingRights
   setHasMoved: (updater: CastlingRights | ((prev: CastlingRights) => CastlingRights)) => void
}

export const useChessStore = create<ChessState>((set) => ({
   board: createBoard(),
   setBoard: (board) => set({ board }),
   currentPlayer: 'white',
   setCurrentPlayer: (player) => set({ currentPlayer: player }),
   selectedPiece: null,
   setSelectedPiece: (pos) => set({ selectedPiece: pos }),
   enPassantTarget: null,
   setEnPassantTarget: (pos) => set({ enPassantTarget: pos }),
   hasMoved: initialCastlingRights,
   setHasMoved: (updater) => set(state => ({
      hasMoved: typeof updater === 'function' ? updater(state.hasMoved) : updater
   }))
}))