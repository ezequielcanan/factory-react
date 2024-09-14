import Main from "../containers/Main"
import Title from "../components/Title"
import { Link } from "react-router-dom"
import Button from "../components/Button"
import { useEffect, useState } from "react"
import customAxios from "../config/axios.config"
import moment from "moment"
import OrderCard from "../components/OrderCard"

const Cuts = () => {
  const [cuts, setCuts] = useState(null)

  useEffect(() => {
    customAxios.get("/cuts").then(res => {
      setCuts(res.data)
    })
  }, [])

  return <Main className={"grid gap-6 gap-y-16 items-start content-start"}>
    <section className="grid items-center justify-center gap-8 md:items-start md:grid-cols-2 md:justify-between">
      <Title text={"Ordenes de corte"} className={"text-center md:text-start"} />
    </section>
    <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-auto">
      {cuts?.length ? cuts.map(cut => {
        return <OrderCard name={false} order={cut.order} link={`/cuts/${cut?._id}`} text="CORTE N°"/>
      }) : (
        <p className="text-white text-2xl">No hay ordenes de corte</p>
      )}
    </section>
  </Main>
}

export default Cuts