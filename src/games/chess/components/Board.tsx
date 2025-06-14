import { pieces } from "../core";
import type { Board as BoardType, GameState, Piece, Player, Position } from "../core";

type BoardProps = {
   board: BoardType;
   selectedPiece: Position;
   clickAndMovePiece: (row: number, col: number) => void;
   isCurrentPlayerPiece: (piece: Piece, player: Player) => boolean;
   currentPlayer: Player;
   gameState: GameState;
   promotionChoice: Position;
};

export const Board = ({ board, selectedPiece, clickAndMovePiece, isCurrentPlayerPiece, currentPlayer, gameState, promotionChoice }: BoardProps) => {

   function getSquareColor(row: number, col: number): string {
      const isLight = (row + col) % 2 === 0;
      const isSelected = selectedPiece?.row === row && selectedPiece?.col === col;
      if (isSelected) {
         return isLight ? 'bg-neutral-300' : 'bg-amber-900';
      } else {
         return isLight ? 'bg-white' : 'bg-amber-800';
      }
   }

   return (
      <div className="grid grid-cols-8 max-w-[512px] w-full rounded-lg shadow-md overflow-hidden">
         {board.map((row, rowIndex) => (
            row.map((piece, colIndex) => (
               <div
                  onClick={() => clickAndMovePiece(rowIndex, colIndex)}
                  key={`${rowIndex}-${colIndex}`}
                  className={`aspect-square grid place-items-center ${getSquareColor(rowIndex, colIndex)}`}
               >
                  {piece && (
                     <img
                        src={pieces[piece]}
                        alt={piece}
                        className={`h-full p-[3%] select-none ${(isCurrentPlayerPiece(piece, currentPlayer) && gameState === 'playing' && !promotionChoice)
                              ? 'cursor-pointer'
                              : 'cursor-default'
                           }`}
                        draggable={false}
                     />
                  )}
               </div>
            ))
         ))}
      </div>
   );
};