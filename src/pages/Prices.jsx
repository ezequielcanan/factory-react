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

const Prices = () => {
  const [clients, setClients] = useState(null)

  useEffect(() => {
    customAxios.get(`/payments/balance`).then(res => {
      setClients(res.data)
    })
  }, [])

  const tableFields = [
    { value: "name", showsFunc: true, shows: (val) => val.toUpperCase() },
    { value: "balance"},
    { value: "excel", showsFunc: true, param: true, shows: (val, row) => <Link to={`/prices/${row?._id}`}><FaArrowRight className="text-xl cursor-pointer" /></Link> },
  ]

  return (
    <Main className={"grid gap-6 gap-y-16 items-start content-start text-white"}>
      <section className="grid items-center justify-center gap-8 md:items-start md:grid-cols-2 md:justify-between">
        <Title text={"Facturacion"} className={"text-center md:text-start"} />
      </section>
      {clients ? (
        <Table fields={tableFields} headers={["Cliente", "Deuda", "Ver"]} rows={clients}/>
      ) : (
        <Oval className="text-3xl" />
      )}
    </Main>
  )
}

export default Prices