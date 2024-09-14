import Main from "../containers/Main"
import Title from "../components/Title"
import { Link } from "react-router-dom"
import Button from "../components/Button"
import { FaCartPlus } from "react-icons/fa"
import { useEffect, useState } from "react"
import customAxios from "../config/axios.config"
import OrderCard from "../components/OrderCard"
import moment from "moment"
import SelectInput from "../components/SelectInput"

const Orders = () => {
  const societies = [{ value: "Arcan" }, { value: "Cattown" }]
  const [orders, setOrders] = useState(null)
  const [society, setSociety] = useState(societies[0])

  useEffect(() => {
    if (society) {
      customAxios.get(`/orders?society=${society?.value}`).then(res => {
        setOrders(res.data?.map(order => {
          return { ...order, remainingDays: moment(order?.deliveryDate).diff(moment(), "days") }
        }))
      })
    }
  }, [society])


  return (
    <Main className={"grid gap-6 gap-y-16 items-start content-start"}>
      <section className="grid items-center justify-center gap-8 md:items-start md:grid-cols-2 md:justify-between">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <Title text={"Pedidos"} className={"text-center md:text-start"} />
          <SelectInput selectedOption={society} setSelectedOption={setSociety} options={societies} className={"!py-2"} />
        </div>
        <Link to={"/orders/new"} className="justify-self-end"><Button className={"text-xl font-bold px-4 flex gap-x-4 items-center"}>Nuevo Pedido <FaCartPlus /></Button></Link>
      </section>
      <section className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-auto content-start">
        {orders?.length ? (
          orders.map(o => {
            return <OrderCard key={o?._id} order={o} />
          })
        ) : (
          <p className="text-white text-2xl">No hay pedidos</p>
        )}
      </section>
    </Main>
  )
}

export default Orders