import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useContext } from "react"
import { UserContext } from "../context/UserContext"


const Router = () => {
  const {getUser, setUser} = useContext(UserContext)

  return (
    <BrowserRouter>
      <Routes>
        <Route path=""/>
      </Routes>
    </BrowserRouter>
  )
}

export default Router