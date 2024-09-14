import OrderCard from "../components/OrderCard"
import Title from "../components/Title"
import customAxios from "../config/axios.config"
import Main from "../containers/Main"
import { useState, useEffect } from "react"

const WorkshopOrders = () => {
  const [workshopOrders, setWorkshopOrders] = useState(null)

  useEffect(() => {
    customAxios.get("/workshop-order").then(res => {
      setWorkshopOrders(res.data)
    })
  }, [])

  return <Main className={"grid gap-6 gap-y-16 items-start content-start"}>
    <section className="grid items-center justify-center gap-8 md:items-start md:grid-cols-2 md:justify-between">
      <Title text={"Cortes en talleres"} className={"text-center md:text-start"} />
    </section>
    <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-auto">
      {workshopOrders?.length ? workshopOrders.map(order => {
        return <OrderCard name={false} order={order?.cut?.order} link={`/workshop-orders/${order?._id}`} text="CORTE N°"/>
      }) : (
        <p className="text-white text-2xl">No hay cosas en talleres</p>
      )}
    </section>
  </Main>
}

export default WorkshopOrders