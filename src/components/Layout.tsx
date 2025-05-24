import { Outlet } from "react-router-dom"
import Nav from "./Nav"
import Footer from "./Footer"


const Layout = () => {
   return (
      <div className="bg-white h-screen flex flex-col">
         <div className="border-b border-neutral-200">
            <Nav />
         </div>
         <div className="flex-1 bg-neutral-100">
            <Outlet />
         </div>
         <div>
            <Footer/>
         </div>
      </div>
   )
}

export default Layout