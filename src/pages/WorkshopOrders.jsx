import { AnimatePresence, motion } from "framer-motion"
import Button from "../components/Button"
import OrderCard from "../components/OrderCard"
import Title from "../components/Title"
import customAxios from "../config/axios.config"
import Main from "../containers/Main"
import { useState, useEffect } from "react"
import { FaChevronDown, FaChevronUp } from "react-icons/fa"

const WorkshopOrders = () => {
  const [workshopOrders, setWorkshopOrders] = useState(null)
  const [showFinished, setShowFinished] = useState(false)

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
      {workshopOrders?.filter(order => !order?.cut?.items.length)?.length ? workshopOrders?.filter(order => !order?.cut?.items.length)?.map(order => {
        return <OrderCard name={false} order={order?.cut?.order} link={`/workshop-orders/${order?._id}`} text={`${order?.workshop?.name} CORTE N°`} forCut/>
      }) : (
        <p className="text-white text-2xl">No hay cortes en talleres</p>
      )}
    </section>
    <Button className="text-white mb-0 mt-0 justify-self-start flex items-center gap-4" onClick={() => setShowFinished(a => !a)}>Cortes en talleres finalizados {!showFinished ? <FaChevronDown /> : <FaChevronUp/>}</Button>
    <AnimatePresence>
      {(showFinished) ? (
        <motion.section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-auto overflow-hidden" initial={{ height: 0 }} transition={{ duration: 0.5 }} exit={{ height: 0 }} animate={{ height: "auto" }}>
          {workshopOrders?.filter(order => order?.cut?.items.length)?.length ? workshopOrders?.filter(order => order?.cut?.items.length)?.map(order => {
            return <OrderCard name={false} order={order?.cut.order} articles={order?.cut?.items} link={`/workshop-orders/${order?._id}`} text={`${order?.workshop?.name} CORTE N°`} forCut />
          }) : <p className="text-white text-2xl">No hay ordenes de talleres finalizadas</p>}
        </motion.section>
      ) : null}
    </AnimatePresence>
  </Main>
}

export default WorkshopOrders