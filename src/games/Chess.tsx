import { useState, useEffect } from "react"

const pieces = {
   b_rook: '/chess_piece/black/black_rook.svg',
   b_knight: '/chess_piece/black/black_knight.svg',
   b_bishop: '/chess_piece/black/black_bishop.svg',
   b_queen: '/chess_piece/black/black_queen.svg',
   b_king: '/chess_piece/black/black_king.svg',
   b_pawn: '/chess_piece/black/black_pawn.svg',
   w_rook: '/chess_piece/white/white_rook.svg',
   w_knight: '/chess_piece/white/white_knight.svg',
   w_bishop: '/chess_piece/white/white_bishop.svg',
   w_queen: '/chess_piece/white/white_queen.svg',
   w_king: '/chess_piece/white/white_king.svg',
   w_pawn: '/chess_piece/white/white_pawn.svg',
}

type Piece = keyof typeof pieces
type Board = (Piece | null)[][]
type Player = 'white' | 'black'
type Position = {
   row: number,
   col: number
} | null
type CastlingRights = {
   w_king: boolean;
   b_king: boolean;
   w_rook_king: boolean;
   w_rook_queen: boolean;
   b_rook_king: boolean;
   b_rook_queen: boolean;
}
type GameState = 'playing' | 'checkmate' | 'stalemate';

const initialCastlingRights: CastlingRights = {
   w_king: false,
   b_king: false,
   w_rook_king: false,
   w_rook_queen: false,
   b_rook_king: false,
   b_rook_queen: false,
};

const createBoard = (): Board => {
   const initialBoard: Board = Array(8).fill(null).map(() => Array(8).fill(null))

   initialBoard[0] = ['b_rook', 'b_knight', 'b_bishop', 'b_queen', 'b_king', 'b_bishop', 'b_knight', 'b_rook']
   initialBoard[1] = Array(8).fill('b_pawn')
   initialBoard[6] = Array(8).fill('w_pawn')
   initialBoard[7] = ['w_rook', 'w_knight', 'w_bishop', 'w_queen', 'w_king', 'w_bishop', 'w_knight', 'w_rook']

   return initialBoard
}

const Chess = () => {
   const [board, setBoard] = useState<Board>(createBoard)
   const [currentPlayer, setCurrentPlayer] = useState<Player>('white')
   const [selectedPiece, setSelectedPiece] = useState<Position>(null)
   const [enPassantTarget, setEnPassantTarget] = useState<Position>(null)
   const [hasMoved, setHasMoved] = useState<CastlingRights>(initialCastlingRights);
   const [gameState, setGameState] = useState<GameState>('playing');
   const [winner, setWinner] = useState<Player | null>(null);
   const [promotionChoice, setPromotionChoice] = useState<Position>(null); // State for pawn promotion
   const [boardHistory, setBoardHistory] = useState<string[]>([]); // State to track board history for threefold repetition

   // Helper to get a string representation of the board state
   function getBoardStateString(currentBoard: Board): string {
      return currentBoard.map(row => row.map(piece => piece || 'null').join(',')).join(';');
   }

   // Helper to check for insufficient material
   function isInsufficientMaterial(currentBoard: Board): boolean {
      const pieceCounts: { [key in Piece]?: number } = {};
      let totalPieces = 0;

      for (let r = 0; r < 8; r++) {
         for (let c = 0; c < 8; c++) {
            const piece = currentBoard[r][c];
            if (piece) {
               pieceCounts[piece] = (pieceCounts[piece] || 0) + 1;
               totalPieces++;
            }
         }
      }

      // Simple cases for insufficient material:
      // King vs King
      if (totalPieces === 2 && pieceCounts['w_king'] === 1 && pieceCounts['b_king'] === 1) {
         return true;
      }
      // King and Bishop vs King
      if (totalPieces === 3 && ((pieceCounts['w_king'] === 1 && pieceCounts['b_king'] === 1 && pieceCounts['w_bishop'] === 1) || (pieceCounts['w_king'] === 1 && pieceCounts['b_king'] === 1 && pieceCounts['b_bishop'] === 1))) {
         return true;
      }
      // King and Knight vs King
      if (totalPieces === 3 && ((pieceCounts['w_king'] === 1 && pieceCounts['b_king'] === 1 && pieceCounts['w_knight'] === 1) || (pieceCounts['w_king'] === 1 && pieceCounts['b_king'] === 1 && pieceCounts['b_knight'] === 1))) {
         return true;
      }
      return false;
   }


   // Effect to check for checkmate, stalemate, or draw conditions after a move
   useEffect(() => {
      // Don't check if the game is already over or a promotion is pending
      if (gameState !== 'playing' || promotionChoice) return;

      const currentBoardStateString = getBoardStateString(board);

      // Check for Threefold Repetition
      const repetitionCount = boardHistory.filter(state => state === currentBoardStateString).length;
      if (repetitionCount >= 3) {
         setGameState('stalemate');
         return;
      }

      // Check for Insufficient Material
      if (isInsufficientMaterial(board)) {
         setGameState('stalemate');
         return; 
      }

      // Check for Checkmate or Stalemate (no legal moves)
      if (!hasAnyLegalMoves()) {
         if (isInCheck(currentPlayer, board)) {
            setGameState('checkmate');
            setWinner(currentPlayer === 'white' ? 'black' : 'white');
         } else {
            setGameState('stalemate');
         }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [board, currentPlayer, gameState, promotionChoice, boardHistory]); // Added boardHistory to dependencies

   function hasAnyLegalMoves(): boolean {
      for (let r = 0; r < 8; r++) {
         for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece && isCurrentPlayerPiece(piece)) {
               const from = { row: r, col: c };
               // Check all possible destination squares for this piece
               for (let toR = 0; toR < 8; toR++) {
                  for (let toC = 0; toC < 8; toC++) {
                     if (isValidMove(piece, from, { row: toR, col: toC })) {
                        return true; // Found at least one legal move
                     }
                  }
               }
            }
         }
      }
      return false; // No legal moves found for any piece
   }

   function resetGame() {
      setBoard(createBoard());
      setCurrentPlayer('white');
      setSelectedPiece(null);
      setEnPassantTarget(null);
      setHasMoved(initialCastlingRights);
      setGameState('playing');
      setWinner(null);
      setPromotionChoice(null); // Reset promotion state
      setBoardHistory([]); // Reset board history
   }

   function isCurrentPlayerPiece(piece: Piece): boolean {
      return currentPlayer === 'white' ? piece.startsWith('w_') : piece.startsWith('b_')
   }

   function clickAndMovePiece(row: number, col: number) {
      // Don't allow moves if the game is over or a promotion is pending
      if (gameState !== 'playing' || promotionChoice) return;

      const clickedPiece = board[row][col]

      if (!selectedPiece) {
         if (clickedPiece && isCurrentPlayerPiece(clickedPiece)) {
            setSelectedPiece({ row, col })
         }
         return
      }

      if (selectedPiece.row === row && selectedPiece.col === col) {
         setSelectedPiece(null)
         return
      }

      if (clickedPiece && isCurrentPlayerPiece(clickedPiece)) {
         setSelectedPiece({ row, col })
         return
      }

      const piece = board[selectedPiece.row][selectedPiece.col]
      if (piece && isValidMove(piece, selectedPiece, { row, col })) {
         movePiece(selectedPiece, { row, col })
      }
      setSelectedPiece(null)
   }

   function isPathClear(from: Position, to: Position, board: Board): boolean {
      if (!from || !to) return false;
      const rowDiff = to.row - from.row;
      const colDiff = to.col - from.col;
      const rowStep = rowDiff === 0 ? 0 : (rowDiff > 0 ? 1 : -1);
      const colStep = colDiff === 0 ? 0 : (colDiff > 0 ? 1 : -1);
      let currRow = from.row + rowStep;
      let currCol = from.col + colStep;
      while (currRow !== to.row || currCol !== to.col) {
         if (board[currRow][currCol] !== null) {
            return false;
         }
         currRow += rowStep;
         currCol += colStep;
      }
      return true;
   }

   function isValidPawnMove(from: Position, to: Position): boolean {
      if (!from || !to) return false
      const direction = currentPlayer === 'white' ? -1 : 1
      const startRow = currentPlayer === 'white' ? 6 : 1
      const oneStepForward = to.row === from.row + direction && to.col === from.col
      const twoStepForward = from.row === startRow && to.row === from.row + 2 * direction && to.col === from.col
      const isTargetEmpty = board[to.row][to.col] === null
      if (oneStepForward && isTargetEmpty) return true
      if (twoStepForward && isTargetEmpty && board[from.row + direction][from.col] === null) return true
      const isDiagonalCapture =
         Math.abs(to.col - from.col) === 1 &&
         to.row === from.row + direction &&
         board[to.row][to.col] !== null &&
         !isCurrentPlayerPiece(board[to.row][to.col]!)
      const isEnPassantCapture =
         Math.abs(to.col - from.col) === 1 &&
         to.row === from.row + direction &&
         board[to.row][to.col] === null &&
         enPassantTarget &&
         enPassantTarget.row === to.row &&
         enPassantTarget.col === to.col
      if (isDiagonalCapture || isEnPassantCapture) return true
      return false
   }

   function isValidRookMove(from: Position, to: Position): boolean {
      if (!from || !to) return false
      const isVerticalOrHorizontal = from.row === to.row || from.col === to.col
      if (!isVerticalOrHorizontal) return false
      if (!isPathClear(from, to, board)) return false;
      const target = board[to.row][to.col];
      if (target && isCurrentPlayerPiece(target)) return false;
      return true;
   }

   function isValidKnightMove(from: Position, to: Position): boolean {
      if (!from || !to) return false
      const isKnightMove =
         (Math.abs(from.row - to.row) === 2 && Math.abs(from.col - to.col) === 1) ||
         (Math.abs(from.col - to.col) === 2 && Math.abs(from.row - to.row) === 1)
      if (!isKnightMove) return false
      const target = board[to.row][to.col]
      if (target && isCurrentPlayerPiece(target)) return false
      return true
   }

   function isValidBishopMove(from: Position, to: Position): boolean {
      if (!from || !to) return false
      const isBishopMove = Math.abs(from.row - to.row) === Math.abs(from.col - to.col)
      if (!isBishopMove) return false
      if (!isPathClear(from, to, board)) return false;
      const target = board[to.row][to.col];
      if (target && isCurrentPlayerPiece(target)) return false;
      return true
   }

   function isValidQueenMove(from: Position, to: Position): boolean {
      if (!from || !to) return false
      const isQueenMove =
         from.row === to.row ||
         from.col === to.col ||
         Math.abs(from.row - to.row) === Math.abs(from.col - to.col)
      if (!isQueenMove) return false
      if (!isPathClear(from, to, board)) return false;
      const target = board[to.row][to.col];
      if (target && isCurrentPlayerPiece(target)) return false;
      return true
   }

   function isValidCastling(from: Position, to: Position): boolean {
      if (!from || !to) return false;
      const kingMoved = currentPlayer === 'white' ? hasMoved.w_king : hasMoved.b_king
      const rookMoved = currentPlayer === 'white'
         ? (to.col > from.col ? hasMoved.w_rook_king : hasMoved.w_rook_queen)
         : (to.col > from.col ? hasMoved.b_rook_king : hasMoved.b_rook_queen)
      if (kingMoved || rookMoved) return false
      const castleDirection = to.col > from.col ? 1 : -1
      for (let c = from.col + castleDirection; c !== to.col; c += castleDirection) {
         if (board[from.row][c] !== null) return false
      }
      if (isInCheck(currentPlayer, board)) return false
      for (let step = 1; step <= 2; step++) {
         const col = from.col + castleDirection * step
         const testBoard = simulateMove(board, from, { row: from.row, col })
         if (isInCheck(currentPlayer, testBoard!)) return false
      }
      return true
   }

   function isValidKingMove(from: Position, to: Position): boolean {
      if (!from || !to) return false
      if (Math.abs(from.col - to.col) === 2 && from.row === to.row) {
         return isValidCastling(from, to)
      }
      const isKingMove = Math.abs(from.row - to.row) <= 1 && Math.abs(from.col - to.col) <= 1;
      if (!isKingMove) return false
      const target = board[to.row][to.col]
      if (target && isCurrentPlayerPiece(target)) return false
      return true
   }

   function simulateMove(board: Board, from: Position, to: Position): Board | null {
      if (!from || !to) return null;
      const b2 = board.map(row => [...row]);
      b2[to.row][to.col] = b2[from.row][from.col];
      b2[from.row][from.col] = null;
      return b2;
   }

   function findKing(player: Player, board: Board): Position {
      const king = player === 'white' ? 'w_king' : 'b_king'
      for (let r = 0; r < 8; r++) {
         for (let c = 0; c < 8; c++) {
            if (board[r][c] === king) return { row: r, col: c }
         }
      }
      return null
   }

   function doesPawnAttack(from: Position, target: Position, board: Board): boolean {
      if (!from || !target) return false;
      const piece = board[from.row][from.col]!;
      const isWhite = piece.startsWith('w_');
      const dir = isWhite ? -1 : 1;
      return (
         Math.abs(target.col - from.col) === 1 &&
         target.row === from.row + dir
      );
   }

   function canPieceAttack(piece: Piece, from: Position, to: Position, board: Board): boolean {
      if (!from || !to) return false;
      if (piece.endsWith('_pawn')) {
         return doesPawnAttack(from, to, board);
      }
      if (piece.endsWith('_knight')) {
         const dr = Math.abs(from.row - to.row), dc = Math.abs(from.col - to.col);
         return (dr === 2 && dc === 1) || (dr === 1 && dc === 2);
      }
      if (piece.endsWith('_bishop') || piece.endsWith('_queen')) {
         if (Math.abs(from.row - to.row) === Math.abs(from.col - to.col)) {
            return isPathClear(from, to, board);
         }
      }
      if (piece.endsWith('_rook') || piece.endsWith('_queen')) {
         if (from.row === to.row || from.col === to.col) {
            return isPathClear(from, to, board);
         }
      }
      if (piece.endsWith('_king')) {
         return (Math.abs(from.row - to.row) <= 1 && Math.abs(from.col - to.col) <= 1);
      }
      return false;
   }

   function isInCheck(player: Player, board: Board): boolean {
      const kingPos = findKing(player, board)!
      if (!kingPos) return false; // Should not happen in a real game
      const opponent = player === 'white' ? 'black' : 'white'
      for (let r = 0; r < 8; r++) {
         for (let c = 0; c < 8; c++) {
            const piece = board[r][c]
            if (!piece || (opponent === 'white' ? !piece.startsWith('w_') : !piece.startsWith('b_')))
               continue
            const from = { row: r, col: c }
            if (canPieceAttack(piece, from, kingPos, board)) return true
         }
      }
      return false
   }

   function isValidMove(piece: Piece, from: Position, to: Position): boolean {
      if (!from || !to) return false;
      let valid = false;
      if (piece.endsWith('_pawn')) valid = isValidPawnMove(from, to);
      else if (piece.endsWith('_rook')) valid = isValidRookMove(from, to);
      else if (piece.endsWith('_knight')) valid = isValidKnightMove(from, to);
      else if (piece.endsWith('_bishop')) valid = isValidBishopMove(from, to);
      else if (piece.endsWith('_queen')) valid = isValidQueenMove(from, to);
      else if (piece.endsWith('_king')) valid = isValidKingMove(from, to);
      if (!valid) return false;
      const simulated = simulateMove(board, from, to);
      if (!simulated) return false;
      return !isInCheck(currentPlayer, simulated);
   }

   function movePiece(from: Position, to: Position) {
      if (!from || !to) return;
      const piece = board[from.row][from.col]
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
      const newBoard = board.map(row => [...row]);
      newBoard[to.row][to.col] = newBoard[from.row][from.col];
      newBoard[from.row][from.col] = null;
      if ((piece === "w_king" || piece === "b_king") && Math.abs(from.col - to.col) === 2) {
         const row = from.row
         if (to.col > from.col) {
            newBoard[row][5] = newBoard[row][7]
            newBoard[row][7] = null
         } else {
            newBoard[row][3] = newBoard[row][0]
            newBoard[row][0] = null
         }
      }
      if (isEnPassantCapture) newBoard[from.row][to.col] = null;

      // Check for Pawn Promotion
      const isPawn = piece?.endsWith('_pawn');
      const promotionRank = currentPlayer === 'white' ? 0 : 7;
      const isPromotion = isPawn && to.row === promotionRank;

      setBoard(newBoard);
      // Add the new board state to history AFTER setting the board
      setBoardHistory(prev => [...prev, getBoardStateString(newBoard)]);


      if (isPromotion) {
         // Pause the game and wait for the user to choose a promotion piece
         setPromotionChoice(to);
      } else {
         // Continue the game normally
         setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
      }
   }

   function handlePromotion(promotedPiece: Piece) {
      if (!promotionChoice) return;

      const newBoard = board.map(r => [...r]);
      newBoard[promotionChoice.row][promotionChoice.col] = promotedPiece;
      setBoard(newBoard);

      // Reset promotion state and continue the game
      setPromotionChoice(null);
      setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
   }

   function isSquareSelected(row: number, col: number): string {
      const isLight = (row + col) % 2 === 0
      const isSelected = selectedPiece?.row === row && selectedPiece?.col === col
      if (isSelected) {
         return isLight ? 'bg-neutral-300' : 'bg-amber-900'
      } else {
         return isLight ? 'bg-white' : 'bg-amber-800'
      }
   }

   const promotionPieceTypes: ('queen' | 'rook' | 'bishop' | 'knight')[] = ['queen', 'rook', 'bishop', 'knight'];

   return (
      <>
         <div className="max-w-[1250px] mx-auto flex justify-center p-4 gap-4 select-none">
            <div className="flex-1 grid place-items-center">
               <div className="text-center">
                  {gameState === 'playing' && !promotionChoice && (
                     <div className="font-semibold text-xl capitalize">{currentPlayer}'s turn</div>
                  )}
                  {promotionChoice && (
                     <div className="font-semibold text-xl capitalize">Promote your Pawn!</div>
                  )}
                  {gameState === 'checkmate' && (
                     <div className="font-semibold text-xl capitalize">Checkmate! {winner} wins.</div>
                  )}
                  {gameState === 'stalemate' && (
                     <div className="font-semibold text-xl">Stalemate! It's a draw.</div>
                  )}
                  {gameState !== 'playing' && (
                     <button
                        onClick={resetGame}
                        className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
                     >
                        Play Again
                     </button>
                  )}
               </div>
            </div>
            <div className="flex flex-col items-center max-w-[512px] w-full gap-2 relative">
               <div className="grid grid-cols-8 max-w-[512px] w-full rounded-lg shadow-md overflow-hidden">
                  {board.map((row, rowIndex) => (
                     row.map((piece, colIndex) => (
                        <div
                           onClick={() => clickAndMovePiece(rowIndex, colIndex)}
                           key={`${rowIndex}-${colIndex}`}
                           className={`aspect-square grid place-items-center ${isSquareSelected(rowIndex, colIndex)}`}
                        >
                           {piece && (
                              <img
                                 src={pieces[piece]}
                                 alt={piece}
                                 className={`h-full p-[3%] select-none ${(isCurrentPlayerPiece(piece) && gameState === 'playing' && !promotionChoice) ? 'cursor-pointer' : 'cursor-default'}`}
                                 draggable={false}
                              />
                           )}
                        </div>
                     ))
                  ))}
               </div>
               {/* Promotion Modal */}
               {promotionChoice && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
                     <div className="bg-neutral-100 p-4 rounded-lg flex gap-2 border-4 border-amber-600">
                        {promotionPieceTypes.map(pieceType => {
                           const pieceKey = `${currentPlayer.charAt(0)}_${pieceType}` as Piece;
                           return (
                              <div
                                 key={pieceKey}
                                 className="w-20 h-20 cursor-pointer hover:bg-neutral-300 p-1 rounded-md transition-colors"
                                 onClick={() => handlePromotion(pieceKey)}
                              >
                                 <img src={pieces[pieceKey]} alt={pieceKey} className="w-full h-full" />
                              </div>
                           );
                        })}
                     </div>
                  </div>
               )}
            </div>
            <div className="flex-1 min-w-[100px] bg-white shadow-md rounded-lg"></div>
         </div>
      </>
   )
}

export default Chess