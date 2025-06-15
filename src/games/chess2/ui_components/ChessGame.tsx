import { useChessStore } from "../core_logic/chessStore"
import { pieces } from "../core_logic/constants"
import { clickAndMovePiece } from "../core_logic/utils/clickAndMovePiece"

const ChessGame = () => {
   const board = useChessStore((state) => state.board)

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
                           draggable={false}
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