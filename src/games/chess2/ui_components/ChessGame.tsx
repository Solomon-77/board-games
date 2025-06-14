import { pieces } from "../core_logic/constants"
import { useChessState } from "../core_logic/useHooks"
import { useClickAndMovePiece } from "../core_logic/utils/useClickAndMovePiece"

const ChessGame = () => {
   const { board } = useChessState()
   const { clickAndMovePiece } = useClickAndMovePiece()

   return (
      <>
         <div className="grid grid-cols-8 max-w-[512px] w-full rounded-lg shadow-md overflow-hidden">
            {board.map((row, rowIndex) => (
               row.map((piece, colIndex) => (
                  <div
                     key={`${rowIndex}-${colIndex}`}
                     onClick={() => clickAndMovePiece(rowIndex, colIndex)}
                     className={`aspect-square grid place-items-center ${(rowIndex + colIndex) % 2 === 0 ? 'bg-white' : 'bg-amber-800'}`}
                  >
                     {piece && (
                        <img
                           src={pieces[piece]}
                           alt={piece}
                           className="h-full p-[3%] select-none"
                        />
                     )}
                  </div>
               ))
            ))}
         </div>
      </>
   )
}

export default ChessGame