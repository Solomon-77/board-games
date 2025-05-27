import { useState } from "react"

const createBoard = () => {
   return Array(8).fill(null).map(() => Array(8).fill(null))
}

const Chess = () => {
   const [board] = useState(createBoard)

   function getSquareColor(rowIndex: number, colIndex: number) {
      return (rowIndex + colIndex) % 2 === 0 ? 'bg-white' : 'bg-gray-800'
   }

   return (
      <div className="max-w-[1250px] mx-auto p-4 flex flex-col items-center">

         {/* title */}
         <h1 className="font-semibold text-xl mb-4">Chess Game</h1>

         {/* display chess board */}
         <div className="grid grid-cols-8 w-full max-w-[512px] rounded-lg overflow-hidden shadow-md">
            {board.map((row, rowIndex) => (
               row.map((_, colIndex) => (
                  <div
                     key={`${rowIndex} ${colIndex}`}
                     className={`aspect-square ${getSquareColor(rowIndex, colIndex)}`}
                  >
                  </div>
               ))
            ))}
         </div>

      </div>
   );
}

export default Chess