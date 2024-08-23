import Button from "./Button"
import customAxios from "../config/axios.config"
import { Link, NavLink } from "react-router-dom"
import { FaBagShopping, FaScissors } from "react-icons/fa6"
import NavItem from "./NavItem"
import { MdSell } from "react-icons/md"

const Navbar = () => {
  return (
    <header className="flex items-center justify-between px-8 py-6 h-[100px] gap-x-16 fixed z-20 w-full text-white bg-black/80">
      <NavLink to={"/"} className="text-white font-bold text-3xl">Fabrica</NavLink>
      <nav className="h-full flex items-center gap-x-8">
        <ul className="flex items-center w-full gap-x-8">
          <NavItem path={"/articles"}>Stock <FaBagShopping /></NavItem>
          <NavItem path={"/orders"}>Pedidos <MdSell /></NavItem>
          <NavItem path={"/cuts"}>Cortes <FaScissors /></NavItem>
        </ul>
        {/*<Button className={"bg-red-700 hover:bg-red-800 text-white text-sm rounded-md"} onClick={() => (customAxios.defaults.headers.common['Authorization'] = "", localStorage.setItem("token", ""))}>Cerrar sesion</Button>*/}
      </nav>
    </header>
  )
}

export default Navbar