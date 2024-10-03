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

const Prices = () => {
  const [clients, setClients] = useState(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    customAxios.get(`/clients?sort=true&page=${page}`).then(res => {
      setClients(res.data)
    })
  }, [page])


  return (
    <Main className={"grid gap-6 gap-y-16 items-start content-start"}>
      <section className="grid items-center justify-center gap-8 md:items-start md:grid-cols-2 md:justify-between">
        <Title text={"Facturacion"} className={"text-center md:text-start"} />
      </section>
      
      <div className="flex gap-x-16 justify-center self-end items-center text-white">
        {page > 1 && <Button className={"px-4 py-4"} onClick={() => setPage(p => p - 1)}><FaChevronLeft /></Button>}
        <p className="text-2xl">{page}</p>
        {clients?.length ? <Button className={"px-4 py-4"} onClick={() => setPage(p => p + 1)}><FaChevronRight /></Button> : null}
      </div>
    </Main>
  )
}

export default Prices