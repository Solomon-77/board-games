import { create } from 'zustand'
import type { Board, CastlingRights, GameState, Player, Position } from './types'
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
   gameState: GameState
   setGameState: (state: GameState) => void
   winner: Player | null
   setWinner: (player: Player | null) => void
   boardHistory: string[]
   setBoardHistory: (updater: string[] | ((prev: string[]) => string[])) => void
   promotionChoice: Position | null
   setPromotionChoice: (pos: Position | null) => void
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
   })),
   gameState: 'playing',
   setGameState: (state) => set({ gameState: state }),
   winner: null,
   setWinner: (player) => set({ winner: player }),
   boardHistory: [],
   setBoardHistory: (updater) => set(state => ({
      boardHistory: typeof updater === 'function' ? updater(state.boardHistory) : updater
   })),
   promotionChoice: null,
   setPromotionChoice: (pos) => set({ promotionChoice: pos }),
}))