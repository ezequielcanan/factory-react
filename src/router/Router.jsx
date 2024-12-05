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
import Users from "../pages/Users"
import { userIncludesRoles } from "../utils/utils"
import Prices from "../pages/Prices"
import Price from "../pages/Price"
import NewCut from "../pages/NewCut"
import ClientPayments from "../pages/ClientPayments"
import Logistics from "../pages/Logistics"
import NewActivity from "../pages/NewActivity"
import NewBuyOrder from "../pages/NewBuyOrder"


const Router = () => {
  const { getUser, userData } = useContext(UserContext)
  return (
    <HashRouter>
      {getUser() && (
        <Navbar />
      )}
      <Routes>
        {!getUser() ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to={"/login"} />} />
          </>
        ) : (
          <>
            <Route path="*" element={<NotFound />} />
            {userIncludesRoles(userData) ? <>
              <Route path="/" element={<Home />} />
              <Route path="/users" element={<Users />} />
            </> : null}
            {userIncludesRoles(userData, "articles") ? <>
              <Route path="/articles" element={<Articles />} />
              <Route path="/articles/new" element={<NewArticle />} />
              <Route path="/articles/:aid" element={<EditArticle />} />
            </> : null}
            {userIncludesRoles(userData, "orders") ? <>
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:oid" element={<Order />} />
              <Route path="/orders/new" element={<NewOrder />} />
            </> : null}
            {userIncludesRoles(userData, "budgets") ? <>
              <Route path="/budgets" element={<Orders budgets/>} />
              <Route path="/budgets/new" element={<NewOrder budgets/>} />
            </> : null}
            {userIncludesRoles(userData, "clients") ? <>
              <Route path="/clients" element={<Clients />} />
              <Route path="/clients/new" element={<NewClient />} />
              <Route path="/clients/:cid" element={<EditClient />} />
            </> : null}
            {userIncludesRoles(userData, "cuts") ? <>
              <Route path="/cuts" element={<Cuts />} />
              <Route path="/cuts/new" element={<NewCut />} />
              <Route path="/cuts/:cid" element={<Cut />} />
              <Route path="/cuts/:cid/workshop" element={<CutToWorkshop />} />
            </> : null}
            {userIncludesRoles(userData, "workshops") ? <>
              <Route path="/workshops" element={<Workshops />} />
              <Route path="/workshops/new" element={<NewWorkshop />} />
              <Route path="/workshops/:wid" element={<EditWorkshop />} />
              <Route path="/workshop-orders" element={<WorkshopOrders />} />
              <Route path="/workshop-orders/:oid" element={<WorkshopOrder />} />
            </> : null}
            {userIncludesRoles(userData, "prices") ? <>
              <Route path="/prices" element={<Prices />} />
              <Route path="/prices/:cid" element={<ClientPayments />} />
              <Route path="/prices/order/:oid" element={<Price />} />
            </> : null}
            {userIncludesRoles(userData, "prices") ? <>
              <Route path="/debts" element={<Prices buys/>} />
              <Route path="/debts/:cid" element={<ClientPayments buys/>} />
              <Route path="/debts/order/:oid" element={<Price buys/>} />
            </> : null}
            {userIncludesRoles(userData, "logistics") ? <>
              <Route path="/logistics" element={<Logistics />} />
              <Route path="/logistics/new" element={<NewActivity />} />
            </> : null}
            {userIncludesRoles(userData, "materials") ? <>
              <Route path="/materials" element={<Articles materials/>} />
              <Route path="/materials/new" element={<NewArticle materials/>} />
              <Route path="/materials/:aid" element={<EditArticle materials/>} />
            </> : null}
            {userIncludesRoles(userData, "suppliers") ? <>
              <Route path="/suppliers" element={<Clients suppliers/>} />
              <Route path="/suppliers/new" element={<NewClient suppliers/>} />
              <Route path="/suppliers/:cid" element={<EditClient suppliers/>} />
            </> : null}
            {userIncludesRoles(userData, "buy-orders") ? <>
              <Route path="/buy-orders" element={<Orders buys/>} />
              <Route path="/buy-orders/:oid" element={<Order buys/>} />
              <Route path="/buy-orders/new" element={<NewBuyOrder />} />
            </> : null}
          </>
        )}
      </Routes>
    </HashRouter>
  )
}

export default Router