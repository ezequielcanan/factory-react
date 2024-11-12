import { AnimatePresence, motion } from "framer-motion"
import Button from "../components/Button"
import OrderCard from "../components/OrderCard"
import Title from "../components/Title"
import customAxios from "../config/axios.config"
import Main from "../containers/Main"
import { useState, useEffect } from "react"
import { FaArrowRight, FaChevronDown, FaChevronUp } from "react-icons/fa"
import { LuPin, LuPinOff } from "react-icons/lu"
import { Link } from "react-router-dom"
import Table from "../components/Table"
import moment from "moment"
import { data } from "autoprefixer"

const WorkshopOrders = () => {
  const [workshopOrders, setWorkshopOrders] = useState(null)
  const [showFinished, setShowFinished] = useState(false)
  const [reload, setReload] = useState(false)

  useEffect(() => {
    customAxios.get("/workshop-order").then(res => {
      setWorkshopOrders(res.data)
    })
  }, [reload])

  const ordersFields = [
    { value: "razon", showsFunc: true, param: true, shows: (val, order) => order?.cut?.order ? `${order?.workshop?.name} CORTE N°${order?.cut?.order?.orderNumber}` : order?.cut?.detail },
    {
      value: "articlesString", showsFunc: true, param: true, shows: (val, order) => {
        let articlesString = ""
        const articlesForString = order?.articles?.filter(a => order?.cut?.order ? a.hasToBeCut && a.quantity > a.booked : true)
        articlesForString?.forEach((article, i) => {
          articlesString += `${(article?.article?.description || article?.customArticle?.detail)?.toUpperCase()}${i != (articlesForString?.length - 1) ? " ///// " : ""}`
        })
        return articlesString
      }
    },
    { value: "order", showsFunc: true, param: true, shows: (x, val) => val?.cut?.order?.date ? moment.utc(val?.cut?.order?.date).format("DD-MM-YYYY") : "" },
    { value: "order", showsFunc: true, param: true, shows: (x, val) => val?.cut?.order?.deliveryDate ? moment.utc(val?.cut?.order?.deliveryDate).format("DD-MM-YYYY") : "" },
    { value: "ver", showsFunc: true, param: true, shows: (val, row) => <Link to={`/workshop-orders/${row?._id}`}><FaArrowRight className="text-xl cursor-pointer" /></Link> },
    {
      value: "priority", showsFunc: true, param: true, shows: (val, row) => {
        return val ? (
          <LuPin className="cursor-pointer text-xl" onClick={async () => {
            await customAxios.put(`/workshop-order/${row?._id}`, {priority: 0})
            setReload(!reload)
          }} />
        ) : (
          <LuPinOff className="cursor-pointer text-xl" onClick={async () => {
            await customAxios.put(`/workshop-order/${row?._id}`, {priority: 1})
            setReload(!reload)
          }} />
        )
      }
    },
  ]

  const finishedOrders = workshopOrders?.filter(order => order?.articles?.every(art => Number(art?.quantity || 0) - Number(art?.booked || 0) == (art?.received || 0)))
  const notFinished = workshopOrders?.filter(order => !order?.articles?.every(art => Number(art?.quantity || 0) - Number(art?.booked || 0) == (art?.received || 0)))

  return <Main className={"grid gap-6 gap-y-16 items-start content-start"}>
    <section className="grid items-center justify-center gap-8 md:items-start md:grid-cols-2 md:justify-between">
      <Title text={"Cortes en talleres"} className={"text-center md:text-start"} />
    </section>
    <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-auto">
      {notFinished?.length ? /*notFinished?.map(order => {
        return <OrderCard name={false} red order={order?.cut?.order} articles={order?.articles} link={`/workshop-orders/${order?._id}`} text={order?.cut?.order ? `${order?.workshop?.name} CORTE N°` : order?.cut?.detail} forCut/>
      })*/
        <Table fields={ordersFields} headers={["Razon", "Articulos", "Fecha de pedido", "Fecha de entrega", "Ver", "Fijar"]} rows={notFinished} containerClassName="lg:col-span-4 md:col-span-2 col-span-1 text-white" stylesFunc={() => "bg-red-600"} /> : (
          <p className="text-white text-2xl">No hay cortes en talleres</p>
        )}
    </section>
    <Button className="text-white mb-0 mt-0 justify-self-start flex items-center gap-4" onClick={() => setShowFinished(a => !a)}>Cortes en talleres finalizados {!showFinished ? <FaChevronDown /> : <FaChevronUp />}</Button>
    <AnimatePresence>
      {(showFinished) ? (
        <motion.section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-auto overflow-hidden" initial={{ height: 0 }} transition={{ duration: 0.5 }} exit={{ height: 0 }} animate={{ height: "auto" }}>
          {finishedOrders?.length ? <Table fields={ordersFields} headers={["Razon", "Articulos", "Fecha de pedido", "Fecha de entrega", "Ver", "Fijar"]} rows={finishedOrders} containerClassName="lg:col-span-4 md:col-span-2 col-span-1 text-white" stylesFunc={() => "bg-green-600"} /> : <p className="text-white text-2xl">No hay ordenes de talleres finalizadas</p>}
        </motion.section>
      ) : null}
    </AnimatePresence>
  </Main>
}

export default WorkshopOrders