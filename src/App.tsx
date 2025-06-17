import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Chess from './games/chess'

const App = () => {
   return (
      <div className="">
         <BrowserRouter>
            <Routes>
               <Route element={<Layout />}>
                  <Route path='/' element={<Home />} />
                  <Route path='/chess' element={<Chess />} />
               </Route>
            </Routes>
         </BrowserRouter>
      </div>
   )
}

export default App