import Main from "../containers/Main"
import Title from "../components/Title"
import { Link } from "react-router-dom"
import Button from "../components/Button"
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import customAxios from "../config/axios.config"
import moment from "moment"
import OrderCard from "../components/OrderCard"
import { FaChevronDown, FaChevronUp } from "react-icons/fa"

const Cuts = () => {
  const [cuts, setCuts] = useState(null)
  const [finishedCuts, setFinishedCuts] = useState(null)
  const [showFinished, setShowFinished] = useState(false)

  useEffect(() => {
    customAxios.get("/cuts").then(res => {
      setCuts(res.data)
    })
  }, [])

  useEffect(() => {
    customAxios.get("/cuts/finished").then(res => {
      setFinishedCuts(res.data)
    })
  }, [])

  return <Main className={"grid gap-6 items-start content-start"}>
    <section className="grid items-center justify-center gap-8 md:items-start md:grid-cols-2 md:justify-between">
      <Title text={"Ordenes de corte"} className={"text-center md:text-start"} />
    </section>
    <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-auto my-8">
      {cuts?.length ? cuts.map(cut => {
        return <OrderCard name={false} order={cut.order} link={`/cuts/${cut?._id}`} text="CORTE N°" forCut />
      }) : (
        <p className="text-white text-2xl">No hay ordenes de corte vigentes</p>
      )}
    </section>
    <Button className="text-white mb-0 mt-0 justify-self-start flex items-center gap-4" onClick={() => setShowFinished(a => !a)}>Ordenes de corte finalizadas {!showFinished ? <FaChevronDown /> : <FaChevronUp/>}</Button>
    <AnimatePresence>
      {(showFinished) ? (
        <motion.section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-auto overflow-hidden" initial={{ height: 0 }} transition={{ duration: 0.5 }} exit={{ height: 0 }} animate={{ height: "auto" }}>
          {finishedCuts.length ? finishedCuts.map(cut => {
            return <OrderCard name={false} order={cut.order} articles={cut?.items} link={`/cuts/${cut?._id}`} text="CORTE N°" forCut />
          }) : <p className="text-white text-2xl">No hay ordenes de corte finalizadas</p>}
        </motion.section>
      ) : null}
    </AnimatePresence>
  </Main>
}

export default Cuts