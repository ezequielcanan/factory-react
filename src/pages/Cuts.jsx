import Main from "../containers/Main"
import Title from "../components/Title"
import { Link } from "react-router-dom"
import Button from "../components/Button"
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import customAxios from "../config/axios.config"
import moment from "moment"
import OrderCard from "../components/OrderCard"
import { FaChevronDown, FaChevronUp, FaPlus } from "react-icons/fa"
import Input from "../components/Input"

const Cuts = () => {
  const [cuts, setCuts] = useState(null)
  const [finishedCuts, setFinishedCuts] = useState(null)
  const [filteredCuts, setFilteredCuts] = useState(null)
  const [showFinished, setShowFinished] = useState(false)
  const [search, setSearch] = useState(null)

  useEffect(() => {
    customAxios.get("/cuts").then(res => {
      const ods = res.data?.map(cut => {
        let articlesString = ""
        const articlesForString = (cut?.items?.length ? cut?.items : (cut?.order ? cut?.order?.articles : cut?.manualItems))?.filter(a => a)
        articlesForString?.forEach((article, i) => {
          articlesString += `${(article?.article?.description || article?.customArticle?.detail)?.toUpperCase()}${i != (articlesForString?.length - 1) ? " ///// " : ""}`
        })
        return { ...cut, articlesString }
      })

      setCuts(ods)
      setFilteredCuts(ods)
    })
  }, [])

  const onChangeSearch = e => {
    setFilteredCuts(cuts.filter(cut => cut.articlesString?.toLowerCase().includes(e?.target?.value?.toLowerCase())))
  }

  useEffect(() => {
    customAxios.get("/cuts/finished").then(res => {
      setFinishedCuts(res.data)
    })
  }, [])

  return <Main className={"grid gap-6 items-start content-start"}>
    <section className="grid items-center justify-center gap-8 md:items-start md:grid-cols-3 md:justify-between">
      <Title text={"Ordenes de corte"} className={"text-center md:text-start"} />
      <Input onChange={onChangeSearch} className="w-full" placeholder="Buscar..."/>
      <Link className="justify-between justify-self-center md:justify-self-end font-bold" to={`/cuts/new`}><Button className={"flex gap-4 items-center px-4 py-2"}>Nuevo corte <FaPlus/></Button></Link>
    </section>
    <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-auto my-8">
      {filteredCuts?.length ? filteredCuts.map(cut => {
        return <OrderCard name={false} order={cut?.order && {...cut.order, workshop: cut?.workshopOrder}} pink={(cut?.cut && !cut?.workshopOrders?.length) ? true : false} orange={cut?.workshopOrders?.length ? true : false} articles={cut?.items?.length ? cut?.items : (cut?.order ? cut?.order?.articles : cut?.manualItems)} link={`/cuts/${cut?._id}`} text={cut?.order ? "CORTE N°" : cut?.detail} forCut />
      }) : (
        <p className="text-white text-2xl">No hay ordenes de corte</p>
      )}
    </section>
    <Button className="text-white mb-0 mt-0 justify-self-start flex items-center gap-4" onClick={() => setShowFinished(a => !a)}>Ordenes de corte finalizadas {!showFinished ? <FaChevronDown /> : <FaChevronUp/>}</Button>
    <AnimatePresence>
      {(showFinished) ? (
        <motion.section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-auto overflow-hidden" initial={{ height: 0 }} transition={{ duration: 0.5 }} exit={{ height: 0 }} animate={{ height: "auto" }}>
          {finishedCuts.length ? finishedCuts.map(cut => {
            return <OrderCard name={false} order={cut.order} green articles={cut?.workshopArticles} link={`/cuts/${cut?._id}`} text={cut?.order ? "CORTE N°" : cut?.detail} forCut />
          }) : <p className="text-white text-2xl">No hay ordenes de corte finalizadas</p>}
        </motion.section>
      ) : null}
    </AnimatePresence>
  </Main>
}

export default Cuts