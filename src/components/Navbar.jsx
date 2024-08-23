import Button from "./Button"
import customAxios from "../config/axios.config"
import { Link, NavLink } from "react-router-dom"
import { FaBagShopping } from "react-icons/fa6"

const Navbar = () => {
  return (
    <header className="flex flex-col items-center p-4 gap-y-16 fixed z-20 !w-[10%] text-white bg-primary h-screen">
      <p className="text-white text-2xl">Fabrica</p>
      <nav className="w-full">
        <ul className="flex flex-col items-center w-full gap-y-8">
          <li className="w-full font-bold">
            <NavLink to="/articles" className={({isActive}) => `!w-full rounded px-4 py-2 !h-full flex justify-between items-center border-2 border-white duration-300 ${!isActive ? "bg-primary text-white" : "bg-white text-primary"}`}>Stock <FaBagShopping/></NavLink>
          </li>
        </ul>
      </nav>
      <Button className={"bg-red-700 hover:bg-red-800 text-white text-sm rounded-md w-full"} onClick={() => (customAxios.defaults.headers.common['Authorization'] = "", localStorage.setItem("token", ""))}>Cerrar sesion</Button>
    </header>
  )
}

export default Navbar