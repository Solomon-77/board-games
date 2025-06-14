import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import ChessGame from './games/chess/ChessGame';
import Chess from './games/chess2';

const App = () => {
   return (
      <div className="">
         <BrowserRouter>
            <Routes>
               <Route element={<Layout />}>
                  <Route path='/' element={<Home />} />
                  <Route path='/chess' element={<ChessGame />} />
                  <Route path='/chess2' element={<Chess />} />
               </Route>
            </Routes>
         </BrowserRouter>
      </div>
   )
}

export default App