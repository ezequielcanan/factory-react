import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useContext } from "react"
import { UserContext } from "../context/UserContext"
import Login from "../pages/Login"
import NotFound from "../pages/NotFound"
import Navbar from "../components/Navbar"
import Home from "../pages/Home"


const Router = () => {
  const {getUser, setUser} = useContext(UserContext)
  return (
    <BrowserRouter>
      {getUser() && (
        <Navbar/>
      )}
      <Routes>
        {!getUser() && (
          <>
          <Route path="/login" element={<Login/>}/>
          <Route path="*" element={<Navigate to={"/login"}/>}/>
          </>
        )}
        <Route path="*" element={<NotFound/>}/>
        <Route path="/" element={<Home/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default Router