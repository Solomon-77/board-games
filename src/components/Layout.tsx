import { Outlet } from "react-router-dom"
import Nav from "./Nav"


const Layout = () => {
   return (
      <div className="bg-white h-screen flex flex-col">
         <div className="border-b border-neutral-200">
            <Nav />
         </div>
         <div className="flex-1 bg-neutral-100">
            <Outlet />
         </div>
      </div>
   )
}

export default Layout