import Main from "../containers/Main"
import Title from "../components/Title"
import { Link } from "react-router-dom"
import Button from "../components/Button"
import { FaArrowRight, FaCartPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { useContext, useEffect, useState } from "react"
import customAxios from "../config/axios.config"
import OrderCard from "../components/OrderCard"
import moment from "moment"
import SelectInput from "../components/SelectInput"
import { userIncludesRoles } from "../utils/utils"
import { UserContext } from "../context/UserContext"
import Input from "../components/Input"
import Table from "../components/Table"
import { LuPin, LuPinOff } from "react-icons/lu"

const Orders = ({ budgets = false, buys = false }) => {
  const { userData } = useContext(UserContext)
  const societies = userIncludesRoles(userData, "cattown") ? [{ value: "Cattown" }] : [{ value: "Arcan" }, { value: "Cattown" }]
  const [orders, setOrders] = useState(null)
  const [filterOrders, setFilterOrders] = useState(null)
  const [society, setSociety] = useState(societies[0])
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [choseColors, setChoseColors] = useState([])
  const [reload, setReload] = useState(false)

  const colors = [
    { text: "En corte", color: "bg-red-600", value: 1, param: "one" },
    { text: "En taller", color: "bg-orange-600", value: 2, param: "two" },
    { text: "Para separar", color: "bg-amber-300 text-black", value: 3, param: "three" },
    { text: "Separado", color: "bg-sky-600", value: 4, param: "four" },
    { text: "Facturado", color: "bg-green-600", value: 5, param: "five" },
    { text: "Pedido agrupado", color: "bg-purple-700", value: 6, param: "six" }
  ]

  const modeOption = budgets ? "budgets" : (buys ? "buys" : "normal")

  const modeOptions = {
    normal: [`orders?society=${society?.value}&`, "", "grid md:grid-cols-2", "Pedidos", "orders", "Nuevo Pedido"],
    budgets: [`orders?society=${society?.value}&`, "&budgets=true", "flex flex-wrap", "Presupuestos", "budgets", "Nuevo Presupuesto"],
    buys: ["buy-orders?", "", "grid md:grid-cols-2", "Compras", "buy-orders", "Nueva Compra"]
  }

  useEffect(() => {
    if (society) {
      const choseColorsStrArray = choseColors.map((col, i) => `&${colors?.find(c => c.value == col)?.param}=${col}`).toString().replaceAll(",", "")
      customAxios.get(`/${modeOptions[modeOption][0]}page=${page}${search && `&search=${search}`}${modeOptions[modeOption][1]}${choseColorsStrArray}`).then(res => {
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
  }, [society, page, search, choseColors, budgets, buys, reload])


  const onChangeSearch = (e) => {
    setSearch(e?.target?.value)
    //setFilterOrders(orders.filter(order => order.client?.name?.toLowerCase().includes(e?.target?.value) || order.articlesString?.toLowerCase().includes(e?.target?.value)))
  }

  const ordersHeaders = [ "Ver", "Fijar", "N°", "Cliente", "Articulos", "Fecha de pedido", "Fecha de entrega", "Dias restantes"]

  const ordersFields = [
    { value: "ver", showsFunc: true, param: true, shows: (val, row) => <Link to={`/${!buys ? "orders" : "buy-orders"}/${row?._id}`}><FaArrowRight className="text-xl cursor-pointer" /></Link> },
    {
      value: "priority", showsFunc: true, param: true, shows: (val, row) => {
        return val ? (
          <LuPin className="cursor-pointer text-xl" onClick={async () => {
            await customAxios.put(`/${!buys ? "orders" : "buy-orders"}/${row?._id}?property=priority&value=0`)
            setReload(!reload)
          }}/>
        ) : (
          <LuPinOff className="cursor-pointer text-xl" onClick={async () => {
            await customAxios.put(`/${!buys ? "orders" : "buy-orders"}/${row?._id}?property=priority&value=1`)
            setReload(!reload)
          }}/>
        )
      }
    },
    { value: "orderNumber" },
    { value: "client", showsFunc: true, shows: (val) => val?.name.toUpperCase() },
    { value: "articlesString", showsFunc: true, shows: (val) => val?.toUpperCase() },
    { value: "date", showsFunc: true, shows: (val) => val ? moment.utc(val).format("DD-MM-YYYY") : "" },
    { value: "deliveryDate", showsFunc: true, shows: (val) => val ? moment.utc(val).format("DD-MM-YYYY") : "" },
    { value: "remainingDays" },
  ]

  if (buys) {
    ordersFields.splice(4,2)
    ordersHeaders.splice(4,2)
  }

  return (
    <Main className={"grid gap-6 gap-y-16 items-start content-start"}>
      <section className="grid items-center justify-center gap-8 md:items-start lg:grid-cols-3 md:justify-between">
        <div className={`${modeOptions[modeOption][2]} gap-6 items-center`}>
          <Title text={modeOptions[modeOption][3]} className={"text-center md:text-start"} />
          {!buys && <SelectInput selectedOption={society} setSelectedOption={setSociety} options={societies} className={"!py-2"} />}
        </div>
        <Input placeholder={"Buscar..."} className={"w-full"} onChange={onChangeSearch} />
        <Link to={`/${modeOptions[modeOption][4]}/new`} className="justify-self-end"><Button className={"text-xl font-bold px-4 flex gap-x-4 items-center"}>{modeOptions[modeOption][5]} <FaCartPlus /></Button></Link>
        {(!budgets && !buys) && <div className="flex gap-4 flex-wrap justify-center md:justify-between text-white lg:col-span-3 text-xl">
          {colors.map(col => {
            const isChose = choseColors?.some(c => c == col?.value)
            return <p className={`${col?.color} px-4 py-2 cursor-pointer duration-300 ${isChose ? "brightness-150" : ""}`} onClick={() => isChose ? setChoseColors(choseColors.filter(c => c != col?.value)) : setChoseColors([...choseColors, col?.value])} key={col?.text}>{col?.text}</p>
          })}
        </div>}
      </section>
      <section className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-auto content-start grid-flow-row">
        {filterOrders?.length ? (
          <Table fields={ordersFields} headers={ordersHeaders} rows={filterOrders} containerClassName="xl:col-span-4 lg:col-span-3 md:col-span-2 col-span-1 text-white" stylesFunc={(order) => {
            const needsStock = order?.articles?.some(art => art?.booked != art?.quantity)
            let color = ""
            if (order?.suborders?.length) {
              color = "bg-purple-700"
            } else if (order?.finished || order?.received) {
              color = "bg-green-600"
            } else if (order?.inPricing) {
              color = "bg-sky-600"
            } else if (!needsStock) {
              color = "bg-amber-300 !text-black"
            } else if (order?.workshop || order?.workshopOrder || order?.workshopOrders) {
              color = "bg-orange-600"
            } else {
              color = "bg-red-600"
            }

            return color
          }} />
        ) : (
          <p className="text-white text-2xl">No hay {modeOptions[modeOption][3].toLowerCase()}</p>
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