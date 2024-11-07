import { AnimatePresence, motion } from "framer-motion"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { FaBagShopping, FaListCheck, FaMoneyBill, FaScissors } from "react-icons/fa6"
import NavItem from "./NavItem"
import { MdSell } from "react-icons/md"
import { FaCalendar, FaCalendarCheck, FaHammer, FaUsers } from "react-icons/fa"
import { GiHamburgerMenu } from "react-icons/gi"
import { useContext, useState, useEffect } from "react"
import { BiLogOut } from "react-icons/bi"
import Button from "../components/Button"
import customAxios from "../config/axios.config.js"
import { UserContext } from "../context/UserContext.jsx"
import { GrUserWorker } from "react-icons/gr"
import { userIncludesRoles } from "../utils/utils.js"
import { PiNutFill } from "react-icons/pi"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [width, setWidth] = useState(window.innerWidth)
  const { setUser, userData } = useContext(UserContext)
  const navigate = useNavigate()
  const toggleOpen = () => setIsOpen(o => !o)


  const navVariants = {
    hidden: {
      height: 0,
      opacity: 0,
      overflow: "hidden", // Evitar mostrar contenido cuando está oculto
      transition: {
        height: { duration: 0.5 }, // Controlar la duración del cambio de altura
        opacity: { duration: 0.3 }, // Animación más rápida para la opacidad
      },
    },
    visible: {
      height: "auto", // Framer Motion maneja la altura automática
      opacity: 1,
      transition: {
        height: { duration: 0.5 }, // Duración de la animación de altura
        opacity: { duration: 0.3 }, // Animación de opacidad
      },
    },
    exit: {
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: 0.5 }, // Duración de la animación de cierre
        opacity: { duration: 0.3 }, // Transición suave de opacidad
      },
    }
  };

  document.addEventListener("resize", () => {
    setWidth(window.innerWidth)
  })


  return (
    <header className={`flex items-center justify-between py-6 h-[100px] sm:gap-x-16 fixed z-20 w-full text-white bg-black`}>
      <NavLink to={"/"} className="text-white font-bold text-3xl px-8">Fabrica</NavLink>
      <AnimatePresence>
        {isOpen && (
          <motion.nav animate={((isOpen) ? "visible" : "hidden")} exit="exit" initial="hidden" variants={navVariants} className={`${(!isOpen) ? "hidden" : "sm:w-auto w-full bg-black/90 absolute sm:right-[30px] top-[100px] sm:top-[120px]"} px-4 sm:px-0 items-center gap-x-8`}>
            <ul className={`${(!isOpen) ? "hidden" : "flex flex-col gap-y-8 sm:h-auto h-screen sm:gap-y-0 items-center"} items-center w-full gap-x-8`}>
              {(userIncludesRoles(userData, "prices")) && <NavItem path={"/prices"} setIsOpen={setIsOpen}>Facturacion <FaMoneyBill /></NavItem>}
              {(userIncludesRoles(userData, "articles")) && <NavItem path={"/articles"} setIsOpen={setIsOpen}>Stock <FaBagShopping /></NavItem>}
              {(userIncludesRoles(userData, "orders")) && <NavItem path={"/orders"} setIsOpen={setIsOpen}>Pedidos <MdSell /></NavItem>}
              {(userIncludesRoles(userData, "clients")) && <NavItem path={"/clients"} setIsOpen={setIsOpen}>Clientes <FaUsers /></NavItem>}
              {(userIncludesRoles(userData, "cuts")) && <NavItem path={"/cuts"} setIsOpen={setIsOpen}>Cortes <FaScissors /></NavItem>}
              {(userIncludesRoles(userData, "workshops")) && <>
                <NavItem path={"/workshops"} setIsOpen={setIsOpen}>Talleres <GrUserWorker /></NavItem>
                <NavItem path={"/workshop-orders"} className={"text-nowrap"} setIsOpen={setIsOpen}>En Taller <FaHammer /></NavItem>
              </>}
              {(userIncludesRoles(userData, "logistics")) && <NavItem path={"/logistics"} setIsOpen={setIsOpen}>Logistica <FaCalendarCheck /></NavItem>}
              {(userIncludesRoles(userData, "budgets")) && <NavItem path={"/budgets"} setIsOpen={setIsOpen}>Presupuestos <FaListCheck /></NavItem>}
              {(userIncludesRoles(userData, "materials")) && <NavItem path={"/materials"} setIsOpen={setIsOpen}>Insumos <PiNutFill /></NavItem>}
              {(userIncludesRoles(userData)) && <NavItem path={"/users"} setIsOpen={setIsOpen}>Usuarios <FaUsers /></NavItem>}
              <Button className={"bg-red-600 hover:bg-red-700 text-white !rounded-none !w-full px-4 py-2 gap-4 text-lg flex justify-between items-center duration-300"} onClick={() => (setUser(false), customAxios.defaults.headers.common['Authorization'] = "", localStorage.setItem("token", ""), navigate("/"))}>Cerrar sesion <BiLogOut /></Button>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
      <div className="inline-block text-4xl cursor-pointer px-8">
        <GiHamburgerMenu onClick={toggleOpen} />
      </div>
    </header>
  )
}

export default Navbar