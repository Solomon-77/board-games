import { pieces, promotionPieceTypes } from "../core";
import type { Piece, Player } from "../core";

type PromotionModalProps = {
   currentPlayer: Player;
   handlePromotion: (piece: Piece) => void;
};

export const PromotionModal = ({ currentPlayer, handlePromotion }: PromotionModalProps) => {
   return (
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
   );
};