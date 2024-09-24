import { NavLink } from "react-router-dom"

const NavItem = ({path, className, setIsOpen, children}) => {
  return (
    <li className="w-full sm:w-[200px] font-bold">
      <NavLink to={path} onClick={() => setIsOpen(false)} className={({ isActive }) => `!w-full px-4 py-2 !h-full gap-4 text-lg flex justify-between items-center duration-300 ${!isActive ? "hover:bg-important bg-nav text-white" : "bg-white text-nav"} ${className}`}>{children}</NavLink>
    </li>
  )
}

export default NavItem