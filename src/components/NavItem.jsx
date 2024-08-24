import { NavLink } from "react-router-dom"

const NavItem = ({path, className, children}) => {
  return (
    <li className="w-full font-bold">
      <NavLink to={path} className={({ isActive }) => `!w-full rounded px-4 py-2 !h-full gap-4 text-lg flex justify-between items-center duration-300 ${!isActive ? "bg-nav text-white" : "bg-white text-nav"} ${className}`}>{children}</NavLink>
    </li>
  )
}

export default NavItem