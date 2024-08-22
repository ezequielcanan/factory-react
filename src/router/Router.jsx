import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useContext } from "react"
import { UserContext } from "../context/UserContext"
import Login from "../pages/Login"


const Router = () => {
  const {getUser, setUser} = useContext(UserContext)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default Router