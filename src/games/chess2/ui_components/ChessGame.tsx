import { useState } from "react"
import type { Board } from "../core_logic/types"
import { createBoard } from "../core_logic/utils/create_board"
import { pieces } from "../core_logic/constants"

const ChessGame = () => {
   const [board, setBoard] = useState<Board>(createBoard)

   return (
      <>
         <div className="grid grid-cols-8 max-w-[512px] w-full rounded-lg shadow-md overflow-hidden">
            {board.map((row, rowIndex) => (
               row.map((piece, colIndex) => (
                  <div
                     key={`${rowIndex}_${colIndex}`}
                     // onClick={}
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