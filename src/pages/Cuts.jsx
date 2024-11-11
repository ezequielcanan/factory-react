import Main from "../containers/Main"
import Title from "../components/Title"
import { Link } from "react-router-dom"
import Button from "../components/Button"
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import customAxios from "../config/axios.config"
import moment from "moment"
import OrderCard from "../components/OrderCard"
import { FaArrowRight, FaChevronDown, FaChevronUp, FaPlus } from "react-icons/fa"
import Input from "../components/Input"
import Table from "../components/Table"
import { LuPin, LuPinOff } from "react-icons/lu"

const Cuts = () => {
  const [cuts, setCuts] = useState(null)
  const [finishedCuts, setFinishedCuts] = useState(null)
  const [filteredCuts, setFilteredCuts] = useState(null)
  const [showFinished, setShowFinished] = useState(false)
  const [reload, setReload] = useState(false)
  const [choseColors, setChoseColors] = useState([])

  useEffect(() => {
    const choseColorsStrArray = choseColors.map((col, i) => `${!i ? "?" : "&"}${colors?.find(c => c.value == col)?.param}=${col}`).toString().replaceAll(",", "")
    customAxios.get(`/cuts${choseColorsStrArray}`).then(res => {
      const ods = res.data?.map(cut => {
        let articlesString = ""
        let articlesForString = (cut?.items?.length ? cut?.items : (cut?.order ? cut?.order?.articles : cut?.manualItems))?.filter(a => a)
        articlesForString = articlesForString?.filter(a => cut?.order ? a.hasToBeCut && a.quantity > a.booked : true)
        articlesForString?.forEach((article, i) => {
          articlesString += `${(article?.article?.description || article?.customArticle?.detail)?.toUpperCase()}${i != (articlesForString?.length - 1) ? " ///// " : ""}`
        })
        return { ...cut, articlesString }
      })

      setCuts(ods)
      setFilteredCuts(ods)
    })
  }, [reload, choseColors])

  const onChangeSearch = e => {
    setFilteredCuts(cuts.filter(cut => cut.articlesString?.toLowerCase().includes(e?.target?.value?.toLowerCase())))
  }

  useEffect(() => {
    customAxios.get("/cuts/finished").then(res => {
      setFinishedCuts(res.data.map(cut => {
        let articlesString = ""
        const articlesForString = cut?.workshopArticles?.filter(a => a)
        articlesForString?.forEach((article, i) => {
          articlesString += `${(article?.article?.description || article?.customArticle?.detail)?.toUpperCase()}${i != (articlesForString?.length - 1) ? " ///// " : ""}`
        })
        return { ...cut, articlesString }
      }))
    })
  }, [])

  const colors = [
    { text: "Pendiente", color: "bg-red-600", value: 1, param: "one" },
    { text: "Cortado", color: "bg-pink-500", value: 2, param: "two" },
    { text: "En taller", color: "bg-orange-600", value: 3, param: "three" },
  ]

  const ordersFields = [
    { value: "razon", showsFunc: true, param: true, shows: (val, cut) => cut?.order ? "CORTE N°" + cut?.order?.orderNumber : cut?.detail },
    { value: "articlesString" },
    { value: "order", showsFunc: true, shows: (val) => val?.date ? moment.utc(val?.date).format("DD-MM-YYYY") : "" },
    { value: "order", showsFunc: true, shows: (val) => val?.deliveryDate ? moment.utc(val?.deliveryDate).format("DD-MM-YYYY") : "" },
    { value: "ver", showsFunc: true, param: true, shows: (val, row) => <Link to={`/cuts/${row?._id}`}><FaArrowRight className="text-xl cursor-pointer" /></Link> },
    {
      value: "priority", showsFunc: true, param: true, shows: (val, row) => {
        return val ? (
          <LuPin className="cursor-pointer text-xl" onClick={async () => {
            await customAxios.put(`/cuts/${row?._id}?property=priority&value=0`)
            setReload(!reload)
          }} />
        ) : (
          <LuPinOff className="cursor-pointer text-xl" onClick={async () => {
            await customAxios.put(`/cuts/${row?._id}?property=priority&value=1`)
            setReload(!reload)
          }} />
        )
      }
    },
  ]

  return <Main className={"grid gap-6 items-start content-start"}>
    <section className="grid items-center justify-center gap-8 md:items-start md:grid-cols-3 md:justify-between">
      <Title text={"Ordenes de corte"} className={"text-center md:text-start"} />
      <Input onChange={onChangeSearch} className="w-full" placeholder="Buscar..." />
      <Link className="justify-between justify-self-center md:justify-self-end font-bold" to={`/cuts/new`}><Button className={"flex gap-4 items-center px-4 py-2"}>Nuevo corte <FaPlus /></Button></Link>
      <div className="flex gap-4 flex-wrap justify-center md:justify-between text-white lg:col-span-3 text-xl md:col-span-3">
        {colors.map(col => {
          const isChose = choseColors?.some(c => c == col?.value)
          return <p className={`${col?.color} px-4 py-2 cursor-pointer duration-300 ${isChose ? "brightness-150" : ""}`} onClick={() => isChose ? setChoseColors(choseColors.filter(c => c != col?.value)) : setChoseColors([...choseColors, col?.value])} key={col?.text}>{col?.text}</p>
        })}
      </div>
    </section>
    <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-auto my-8">
      {filteredCuts?.length ? /*filteredCuts.map(cut => {
        return <OrderCard name={false} order={cut?.order && {...cut.order, workshop: cut?.workshopOrder}} pink={(cut?.cut && !cut?.workshopOrders?.length) ? true : false} orange={cut?.workshopOrders?.length ? true : false} articles={cut?.items?.length ? cut?.items : (cut?.order ? cut?.order?.articles : cut?.manualItems)} link={`/cuts/${cut?._id}`} text={cut?.order ? "CORTE N°" : cut?.detail} forCut />
      })*/
        <Table fields={ordersFields} headers={["Razon", "Articulos", "Fecha de pedido", "Fecha de entrega", "Ver", "Fijar"]} rows={filteredCuts} containerClassName="lg:col-span-4 md:col-span-2 col-span-1 text-white" stylesFunc={(cut) => {
          const order = cut?.order
          let articles = cut?.items?.length ? cut?.items : (cut?.order ? cut?.order?.articles : cut?.manualItems)
          const needsStock = articles?.some(art => art?.booked != art?.quantity)
          let pink = cut?.cut && !cut?.workshopOrders?.length ? true : false
          let orange = cut?.workshopOrders?.length ? true : false
          let color = ""
          if (order?.suborders?.length) {
            color = "bg-purple-700"
          } else if (order?.finished) {
            color = "bg-green-600"
          } else if (order?.inPricing) {
            color = "bg-sky-600"
          } else if (!needsStock) {
            color = "bg-amber-300 !text-black"
          } else if (orange || order?.workshop || order?.workshopOrder || order?.workshopOrders) {
            color = "bg-orange-600"
          } else {
            color = "bg-red-600"
          }

          if (pink) color = "bg-pink-500"


          return color
        }} />
        : (
          <p className="text-white text-2xl">No hay ordenes de corte</p>
        )}
    </section>
    <Button className="text-white mb-0 mt-0 justify-self-start flex items-center gap-4" onClick={() => setShowFinished(a => !a)}>Ordenes de corte finalizadas {!showFinished ? <FaChevronDown /> : <FaChevronUp />}</Button>
    <AnimatePresence>
      {(showFinished) ? (
        <motion.section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-auto overflow-hidden" initial={{ height: 0 }} transition={{ duration: 0.5 }} exit={{ height: 0 }} animate={{ height: "auto" }}>
          {finishedCuts.length ? /*finishedCuts.map(cut => {
            return <OrderCard name={false} order={cut.order} green articles={cut?.workshopArticles} link={`/cuts/${cut?._id}`} text={cut?.order ? "CORTE N°" : cut?.detail} forCut />
          })*/
            <Table fields={ordersFields} headers={["Razon", "Articulos", "Fecha de pedido", "Fecha de entrega", "Ver", "Fijar"]} rows={finishedCuts} containerClassName="lg:col-span-4 md:col-span-2 col-span-1 text-white" stylesFunc={() => "bg-green-600"} /> : <p className="text-white text-2xl">No hay ordenes de corte finalizadas</p>}
        </motion.section>
      ) : null}
    </AnimatePresence>
  </Main>
}

export default Cuts