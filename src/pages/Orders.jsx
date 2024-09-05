import Main from "../containers/Main"
import Title from "../components/Title"
import { Link } from "react-router-dom"
import Button from "../components/Button"
import { FaCartPlus } from "react-icons/fa"
import { useEffect, useState } from "react"
import customAxios from "../config/axios.config"
import OrderCard from "../components/OrderCard"
import moment from "moment"

const Orders = () => {
  const [orders, setOrders] = useState(null)

  useEffect(() => {
    customAxios.get("/orders").then(res => {
      setOrders(res.data?.map(order => {
        return {...order, remainingDays: moment(order?.deliveryDate).diff(moment(), "days")}
      }))
    })
  }, [])


  return (
    <Main className={"grid gap-6 gap-y-16 items-start content-start"}>
      <section className="grid items-center justify-center gap-8 md:items-start md:grid-cols-2 md:justify-between">
        <Title text={"Pedidos"} className={"text-center md:text-start"}/>
        <Link to={"/orders/new"} className="justify-self-end"><Button className={"text-xl font-bold px-4 flex gap-x-4 items-center"}>Nuevo Pedido <FaCartPlus /></Button></Link>
      </section>
      <section className="grid grid-cols-4 gap-6 auto-rows-auto">
        {orders?.length ? (
          orders.map(o => {
            return <OrderCard key={o?._id} order={o}/>
          })
        ) : (
          <p className="text-white text-2xl">No hay pedidos</p>
        )}
      </section>
    </Main>
  )
}

export default Orders