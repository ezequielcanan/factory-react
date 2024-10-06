import Main from "../containers/Main"
import Title from "../components/Title"
import { Link } from "react-router-dom"
import Button from "../components/Button"
import { FaCartPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { useContext, useEffect, useState } from "react"
import customAxios from "../config/axios.config"
import OrderCard from "../components/OrderCard"
import moment from "moment"
import SelectInput from "../components/SelectInput"
import { userIncludesRoles } from "../utils/utils"
import { UserContext } from "../context/UserContext"
import Input from "../components/Input"

const Orders = () => {
  const { userData } = useContext(UserContext)
  const societies = userIncludesRoles(userData, "cattown") ? [{ value: "Cattown" }] : [{ value: "Arcan" }, { value: "Cattown" }]
  const [orders, setOrders] = useState(null)
  const [filterOrders, setFilterOrders] = useState(null) 
  const [society, setSociety] = useState(societies[0])
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (society) {
      customAxios.get(`/orders?society=${society?.value}&page=${page}`).then(res => {
        const ods = res.data?.map(order => {
          let articlesString = ""
          const articlesForString = order?.articles?.filter(a => a)
          articlesForString?.forEach((article, i) => {
            articlesString += `${(article?.article?.description || article?.customArticle?.detail)?.toUpperCase()}${i != (articlesForString?.length - 1) ? " ///// " : ""}`
          })
          return { ...order, remainingDays: moment(order?.deliveryDate).diff(moment(), "days"), articlesString }
        })

        setOrders(ods)
        setFilterOrders(ods)
      })
    }
  }, [society, page])


  const onChangeSearch = (e) => {
    setFilterOrders(orders.filter(order => order.client?.name?.toLowerCase().includes(e?.target?.value) || order.articlesString?.toLowerCase().includes(e?.target?.value)))
  }

  return (
    <Main className={"grid gap-6 gap-y-16 items-start content-start"}>
      <section className="grid items-center justify-center gap-8 md:items-start lg:grid-cols-3 md:justify-between">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <Title text={"Pedidos"} className={"text-center md:text-start"} />
          <SelectInput selectedOption={society} setSelectedOption={setSociety} options={societies} className={"!py-2"} />
        </div>
        <Input placeholder={"Buscar..."} className={"w-full"} onChange={onChangeSearch}/>
        <Link to={"/orders/new"} className="justify-self-end"><Button className={"text-xl font-bold px-4 flex gap-x-4 items-center"}>Nuevo Pedido <FaCartPlus /></Button></Link>
        <div className="flex gap-4 flex-wrap justify-center md:justify-between text-white lg:col-span-3 text-xl">
          <p className="bg-red-600 px-4 py-2">En corte</p>
          <p className="bg-orange-600 px-4 py-2">En taller</p>
          <p className="bg-amber-300 text-black px-4 py-2">Para separar</p>
          <p className="bg-sky-600 px-4 py-2">Separado</p>
          <p className="bg-green-600 px-4 py-2">Facturado</p>
          <p className="bg-purple-700 px-4 py-2">Pedido agrupado</p>
        </div>
      </section>
      <section className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-auto content-start grid-flow-row">
        {filterOrders?.length ? (
          filterOrders.map(o => {
            return <OrderCard key={o?._id} order={o} />
          })
        ) : (
          <p className="text-white text-2xl">No hay pedidos</p>
        )}
      </section>
      <div className="flex gap-x-16 justify-center self-end items-center text-white">
        {page > 1 && <Button className={"px-4 py-4"} onClick={() => setPage(p => p - 1)}><FaChevronLeft /></Button>}
        <p className="text-2xl">{page}</p>
        {orders?.length ? <Button className={"px-4 py-4"} onClick={() => setPage(p => p + 1)}><FaChevronRight /></Button> : null}
      </div>
    </Main>
  )
}

export default Orders