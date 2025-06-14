import { useState, useEffect } from "react";
import { Board, GameStatus, PromotionModal } from "./components";
import {
   // Types
   type Board as BoardType,
   type Player,
   type Position,
   type CastlingRights,
   type GameState,
   type Piece,
   // Constants
   initialCastlingRights,
   // Functions
   createBoard,
   isValidMove,
   isCurrentPlayerPiece,
   hasAnyLegalMoves,
   isInCheck,
   getBoardStateString,
   isInsufficientMaterial
} from "./core";

const ChessGame = () => {
   const [board, setBoard] = useState<BoardType>(createBoard);
   const [currentPlayer, setCurrentPlayer] = useState<Player>('white');
   const [selectedPiece, setSelectedPiece] = useState<Position>(null);
   const [enPassantTarget, setEnPassantTarget] = useState<Position>(null);
   const [hasMoved, setHasMoved] = useState<CastlingRights>(initialCastlingRights);
   const [gameState, setGameState] = useState<GameState>('playing');
   const [winner, setWinner] = useState<Player | null>(null);
   const [promotionChoice, setPromotionChoice] = useState<Position>(null);
   const [boardHistory, setBoardHistory] = useState<string[]>([]);

   // Effect to check for game-ending conditions
   useEffect(() => {
      if (gameState !== 'playing' || promotionChoice) return;

      const currentBoardStateString = getBoardStateString(board);
      const repetitionCount = boardHistory.filter(state => state === currentBoardStateString).length;
      if (repetitionCount >= 3) {
         setGameState('stalemate');
         return;
      }

      if (isInsufficientMaterial(board)) {
         setGameState('stalemate');
         return;
      }

      if (!hasAnyLegalMoves(board, currentPlayer, enPassantTarget, hasMoved)) {
         if (isInCheck(currentPlayer, board)) {
            setGameState('checkmate');
            setWinner(currentPlayer === 'white' ? 'black' : 'white');
         } else {
            setGameState('stalemate');
         }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [board, currentPlayer, gameState, promotionChoice, boardHistory]);

   function resetGame() {
      setBoard(createBoard());
      setCurrentPlayer('white');
      setSelectedPiece(null);
      setEnPassantTarget(null);
      setHasMoved(initialCastlingRights);
      setGameState('playing');
      setWinner(null);
      setPromotionChoice(null);
      setBoardHistory([]);
   }

   function clickAndMovePiece(row: number, col: number) {
      if (gameState !== 'playing' || promotionChoice) return;

      const clickedPiece = board[row][col];

      if (!selectedPiece) {
         if (clickedPiece && isCurrentPlayerPiece(clickedPiece, currentPlayer)) {
            setSelectedPiece({ row, col });
         }
         return;
      }

      if (selectedPiece.row === row && selectedPiece.col === col) {
         setSelectedPiece(null);
         return;
      }

      if (clickedPiece && isCurrentPlayerPiece(clickedPiece, currentPlayer)) {
         setSelectedPiece({ row, col });
         return;
      }

      const piece = board[selectedPiece.row][selectedPiece.col];
      if (piece && isValidMove(piece, selectedPiece, { row, col }, board, currentPlayer, enPassantTarget, hasMoved)) {
         movePiece(selectedPiece, { row, col });
      }
      setSelectedPiece(null);
   }

   function movePiece(from: Position, to: Position) {
      if (!from || !to) return;
      const piece = board[from.row][from.col];

      // Update castling rights if king or rook moves for the first time
      setHasMoved(prev => {
         const update: Partial<CastlingRights> = {};
         if (piece === 'w_king') update.w_king = true;
         if (piece === 'b_king') update.b_king = true;
         if (piece === 'w_rook') {
            if (from.row === 7 && from.col === 0) update.w_rook_queen = true;
            if (from.row === 7 && from.col === 7) update.w_rook_king = true;
         }
         if (piece === 'b_rook') {
            if (from.row === 0 && from.col === 0) update.b_rook_queen = true;
            if (from.row === 0 && from.col === 7) update.b_rook_king = true;
         }
         return { ...prev, ...update };
      });

      // Set en passant target
      const direction = currentPlayer === 'white' ? -1 : 1;
      const canBeCapturedEnPassant = piece?.endsWith('_pawn') && Math.abs(from.row - to.row) === 2;
      if (canBeCapturedEnPassant) {
         setEnPassantTarget({ row: from.row + direction, col: from.col });
      } else {
         setEnPassantTarget(null);
      }

      // Create the new board state
      const newBoard = board.map(row => [...row]);
      newBoard[to.row][to.col] = newBoard[from.row][from.col];
      newBoard[from.row][from.col] = null;

      // Handle castling move
      if ((piece === "w_king" || piece === "b_king") && Math.abs(from.col - to.col) === 2) {
         const row = from.row;
         if (to.col > from.col) { // Kingside
            newBoard[row][5] = newBoard[row][7];
            newBoard[row][7] = null;
         } else { // Queenside
            newBoard[row][3] = newBoard[row][0];
            newBoard[row][0] = null;
         }
      }

      // Handle en passant capture
      const isEnPassantCapture = piece?.endsWith('_pawn') && from.col !== to.col && !board[to.row][to.col];
      if (isEnPassantCapture) {
         newBoard[from.row][to.col] = null;
      }

      setBoard(newBoard);
      setBoardHistory(prev => [...prev, getBoardStateString(newBoard)]);

      // Check for Pawn Promotion
      const isPawn = piece?.endsWith('_pawn');
      const promotionRank = currentPlayer === 'white' ? 0 : 7;
      if (isPawn && to.row === promotionRank) {
         setPromotionChoice(to);
      } else {
         setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
      }
   }

   function handlePromotion(promotedPiece: Piece) {
      if (!promotionChoice) return;

      const newBoard = board.map(r => [...r]);
      newBoard[promotionChoice.row][promotionChoice.col] = promotedPiece;
      setBoard(newBoard);

      setPromotionChoice(null);
      setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
   }

   return (
      <div className="max-w-[1250px] mx-auto flex justify-center p-4 gap-4 select-none">
         <GameStatus
            gameState={gameState}
            currentPlayer={currentPlayer}
            winner={winner}
            promotionChoice={!!promotionChoice}
            resetGame={resetGame}
         />
         <div className="flex flex-col items-center max-w-[512px] w-full gap-2 relative">
            <Board
               board={board}
               selectedPiece={selectedPiece}
               clickAndMovePiece={clickAndMovePiece}
               isCurrentPlayerPiece={isCurrentPlayerPiece}
               currentPlayer={currentPlayer}
               gameState={gameState}
               promotionChoice={promotionChoice}
            />
            {promotionChoice && (
               <PromotionModal currentPlayer={currentPlayer} handlePromotion={handlePromotion} />
            )}
         </div>
         <div className="flex-1 min-w-[100px] bg-white shadow-md rounded-lg"></div>
      </div>
   );
};

export default ChessGame;