import Main from "../containers/Main"
import Title from "../components/Title"
import { Link } from "react-router-dom"
import Button from "../components/Button"
import { FaCartPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { useEffect, useState } from "react"
import customAxios from "../config/axios.config"
import OrderCard from "../components/OrderCard"
import moment from "moment"
import SelectInput from "../components/SelectInput"
import Table from "../components/Table"
import { Oval } from "react-loader-spinner"
import { FaArrowRight, FaFileExcel } from "react-icons/fa6"
import Input from "../components/Input"

const Prices = ({buys=false}) => {
  const [clients, setClients] = useState(null)
  const [filterClients, setFilterClients] = useState(null)
  const [search, setSearch] = useState(null)
  const [filterMode, setFilterMode] = useState(false)
  const [amountFilter, setAmountFilter] = useState(null)
  const [colorValues, setColorValues] = useState(null)

  const endpoint = buys ? "debts" : "prices"

  useEffect(() => {
    customAxios.get(`/payments/balance${buys ? "?buys=true" : ""}`).then(res => {
      setClients(res?.data)
      setFilterClients(res?.data)
      const max = Math.max(...res?.data.map(item => item?.balance))
      const min = Math.min(...res?.data.map(item => item?.balance))

      setColorValues([max, min])
    })
  }, [buys])

  const onChangeFilter = (e, search = true) => {
    if (search) {
      setSearch(e?.target?.value)
    } else {
      setAmountFilter(String(e?.target?.value))
    }
  }

  useEffect(() => {
    let finalClients = clients
    if (search) {
      finalClients = finalClients.filter(client => client?.name?.toLowerCase()?.includes(search))
    }

    if (amountFilter?.length) {
      finalClients = finalClients.filter(client => !filterMode ? client?.balance > Number(amountFilter) : client?.balance < Number(amountFilter))
    }

    setFilterClients(finalClients)
  }, [search, filterMode, amountFilter])

  const tableFields = [
    { value: "excel", showsFunc: true, param: true, shows: (val, row) => <Link to={`/${endpoint}/${row?._id}`}><FaArrowRight className="text-xl cursor-pointer" /></Link> },
    { value: "name", showsFunc: true, shows: (val) => val.toUpperCase() },
    { value: "balance", showsFunc: true, shows: (val) => val.toFixed(2) },
  ]

  return (
    <Main className={"grid gap-6 gap-y-16 items-start content-start text-white"}>
      <section className="grid items-center justify-center gap-8 md:items-start md:grid-cols-2 md:justify-between">
        <Title text={!buys ? "Facturacion" : "Deudas"} className={"text-center md:text-start"} />
        <div className="flex justify-evenly flex-wrap gap-4">
          <Input placeholder={"Buscar..."} onChange={onChangeFilter} className={"w-full"} />
          <Button onClick={() => setFilterMode(!filterMode)}>Balance {!filterMode ? "mayor que" : "menor que"}</Button>
          <Input placeholder={"Monto"} type={"number"} onChange={(e) => onChangeFilter(e, false)} className={"w-full"} />
        </div>
      </section>
      <h3 className="text-2xl font-bold md:justify-self-start justify-self-center">Deuda {!buys ? "a favor" : "en contra"} total: {clients?.reduce((acc,client) => acc+client?.balance,0)?.toFixed(2)}</h3>
      {(clients && colorValues) ? (
        <Table fields={tableFields} headers={["Ver", "Cliente", "Deuda"]} rows={filterClients} containerClassName="min-w-[250]" colorScale minValue={colorValues[1]} maxValue={colorValues[0]}/>
      ) : (
        <Oval className="text-3xl" />
      )}
    </Main>
  )
}

export default Prices