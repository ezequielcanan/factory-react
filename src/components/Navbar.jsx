import { motion } from "framer-motion"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { FaBagShopping, FaScissors } from "react-icons/fa6"
import NavItem from "./NavItem"
import { MdSell } from "react-icons/md"
import { FaUsers } from "react-icons/fa"
import { GiHamburgerMenu } from "react-icons/gi"
import { useContext, useState } from "react"
import { BiLogOut } from "react-icons/bi"
import Button from "../components/Button"
import customAxios from "../config/axios.config.js"
import { UserContext } from "../context/UserContext.jsx"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [width, setWidth] = useState(window.innerWidth)
  const {setUser} = useContext(UserContext)
  const navigate = useNavigate()
  const toggleOpen = () => setIsOpen(o => !o)

  const navVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  document.addEventListener("resize", () => {
    setWidth(window.innerWidth)
  })

  const largeBreakpoint = width < 1024

  return (
    <header className={`flex items-center justify-between py-6 h-[100px] sm:gap-x-16 fixed z-20 w-full text-white bg-black`}>
      <NavLink to={"/"} className="text-white font-bold text-3xl px-8">Fabrica</NavLink>
      <motion.nav animate={(!largeBreakpoint) ? "visible" : ((isOpen) ? "visible" : "hidden")} variants={navVariants} className={`h-full ${(!isOpen) ? "hidden" : "absolute top-[100px] h-screen w-screen bg-black/90 pt-[100px]"} px-8 lg:flex items-center gap-x-8`}>
        <ul className={`${(!isOpen) ? "hidden" : "flex flex-col gap-y-16 items-center"} lg:flex items-center w-full gap-x-8`}>
          <NavItem path={"/articles"} setIsOpen={setIsOpen}>Stock <FaBagShopping /></NavItem>
          <NavItem path={"/clients"} setIsOpen={setIsOpen}>Clientes <FaUsers /></NavItem>
          <NavItem path={"/orders"} setIsOpen={setIsOpen}>Pedidos <MdSell /></NavItem>
          <NavItem path={"/cuts"} setIsOpen={setIsOpen}>Cortes <FaScissors /></NavItem>
          <Button className={"bg-red-700 hover:bg-red-800 !text-2xl text-white text-sm rounded-md"} onClick={() => (setUser(false), customAxios.defaults.headers.common['Authorization'] = "", localStorage.setItem("token", ""), navigate("/"))}><BiLogOut/></Button>
        </ul>
      </motion.nav>
      <div className="inline-block lg:hidden text-4xl cursor-pointer px-8">
        <GiHamburgerMenu onClick={toggleOpen}/>
      </div>
    </header>
  )
}

export default Navbar