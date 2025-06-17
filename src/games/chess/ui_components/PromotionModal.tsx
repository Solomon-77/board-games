import { useChessStore } from "../core_logic/chessStore";
import { pieces, promotionPieceTypes } from "../core_logic/constants";
import type { Piece } from "../core_logic/types";
import { handlePromotion } from "../core_logic/utils/handlePromotion";

const PromotionModal = () => {
   const currentPlayer = useChessStore((state) => state.currentPlayer)

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
   )
}

export default PromotionModal