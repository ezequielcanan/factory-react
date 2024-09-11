import { HashRouter, Routes, Route, Navigate } from "react-router-dom"
import { useContext } from "react"
import { UserContext } from "../context/UserContext"
import Login from "../pages/Login"
import NotFound from "../pages/NotFound"
import Navbar from "../components/Navbar"
import Home from "../pages/Home"
import Articles from "../pages/Articles"
import NewArticle from "../pages/NewArticle"
import Clients from "../pages/Clients"
import NewClient from "../pages/NewClient"
import EditArticle from "../pages/EditArticle"
import EditClient from "../pages/EditClient"
import Orders from "../pages/Orders"
import NewOrder from "../pages/NewOrder"
import Order from "../pages/Order"
import Cuts from "../pages/Cuts"
import Cut from "../pages/Cut"
import Workshops from "../pages/Workshops"
import NewWorkshop from "../pages/NewWorkshop"
import EditWorkshop from "../pages/EditWorkshop"
import CutToWorkshop from "../pages/CutToWorkshop"
import WorkshopOrders from "../pages/WorkshopOrders"
import WorkshopOrder from "../pages/WorkshopOrder"


const Router = () => {
  const {getUser, setUser} = useContext(UserContext)
  return (
    <HashRouter>
      {getUser() && (
        <Navbar/>
      )}
      <Routes>
        {!getUser() ? (
          <>
          <Route path="/login" element={<Login/>}/>
          <Route path="*" element={<Navigate to={"/login"}/>}/>
          </>
        ) : (
          <>
            <Route path="*" element={<NotFound/>}/>
            <Route path="/" element={<Home/>}/>
            <Route path="/articles" element={<Articles/>}/>
            <Route path="/articles/new" element={<NewArticle/>}/>
            <Route path="/articles/:aid" element={<EditArticle/>}/>
            <Route path="/clients" element={<Clients/>}/>
            <Route path="/clients/new" element={<NewClient/>}/>
            <Route path="/clients/:cid" element={<EditClient/>}/>
            <Route path="/orders" element={<Orders/>}/>
            <Route path="/orders/:oid" element={<Order/>}/>
            <Route path="/orders/new" element={<NewOrder/>}/>
            <Route path="/cuts" element={<Cuts/>}/>
            <Route path="/cuts/:cid" element={<Cut/>}/>
            <Route path="/cuts/:cid/workshop" element={<CutToWorkshop/>}/>
            <Route path="/workshops" element={<Workshops/>}/>
            <Route path="/workshops/new" element={<NewWorkshop/>}/>
            <Route path="/workshops/:wid" element={<EditWorkshop/>}/>
            <Route path="/workshop-orders" element={<WorkshopOrders/>}/>
            <Route path="/workshop-orders/:oid" element={<WorkshopOrder/>}/>
          </>
        )}
      </Routes>
    </HashRouter>
  )
}

export default Router