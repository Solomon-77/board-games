import ChatWindow from "./ui_components/ChatWindow"
import ChessGame from "./ui_components/ChessGame"
import GameStatus from "./ui_components/GameStatus"

const Chess = () => {
   return (
      <>
         <div className="max-w-[1250px] mx-auto p-4 flex justify-center gap-4">
            <GameStatus />
            <ChessGame />
            <ChatWindow />
         </div>
      </>
   )
}

export default Chess