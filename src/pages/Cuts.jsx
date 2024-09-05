import Main from "../containers/Main"
import Title from "../components/Title"
import { Link } from "react-router-dom"
import Button from "../components/Button"
import { useEffect, useState } from "react"
import customAxios from "../config/axios.config"
import moment from "moment"

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
        return <Link to={`/cuts/${cut?._id}`}>
          <div className="flex flex-col gap-8 bg-secondary text-white p-6 rounded" key={cut?._id}>
            <h3 className="text-2xl font-bold">PEDIDO N° {cut?.order?.orderNumber}: {cut?.order?.client?.name}</h3>
            <p className="text-xl">Articulos de linea: {cut?.order?.articles?.filter(a => a.common && a.booked < a.quantity)?.length}</p>
            <p className="text-xl">Articulos personalizados: {cut?.order?.articles?.filter(a => !a.common && a.booked < a.quantity)?.length}</p>
            <p className="text-xl">Fecha de pedido: {moment.utc(cut?.order?.date).format("DD-MM-YYYY")}</p>
            <p className="text-xl">Fecha de entrega: {cut?.order?.deliveryDate ? moment.utc(cut?.order?.deliveryDate).format("DD-MM-YYYY") : ""}</p>
            {cut?.order?.remainingDays > 0 && <p className="text-xl">Dias restantes: {cut?.order.remainingDays}</p>}
          </div>
        </Link>
      }) : (
        <p className="text-white text-2xl">No hay ordenes de corte</p>
      )}
    </section>
  </Main>
}

export default Cuts