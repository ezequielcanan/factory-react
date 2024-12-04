import { useEffect, useState } from "react"
import Main from "../containers/Main"
import { useParams } from "react-router-dom"
import customAxios from "../config/axios.config"
import Title from "../components/Title"
import { Oval } from "react-loader-spinner"
import OrderCard from "../components/OrderCard"
import Label from "../components/Label"
import Input from "../components/Input"
import Button from "../components/Button"
import Table from "../components/Table"
import { TiTick } from "react-icons/ti"
import { useForm } from "react-hook-form"
import moment from "moment"
import { FaFileExcel } from "react-icons/fa"
import { MdClose } from "react-icons/md"

const ClientPayments = () => {
  const [client, setClient] = useState(null)
  const [reload, setReload] = useState(false)
  const { register, handleSubmit, reset } = useForm()
  const { cid } = useParams()

  useEffect(() => {
    customAxios.get(`/payments/balance/${cid}`).then(res => {
      setClient(res.data)
    })
  }, [reload])

  const onSubmit = handleSubmit(async data => {
    await customAxios.post(`/payments`, { ...data, amount: Number(data?.amount), client: cid })
    reset()
    setReload(!reload)
  })

  const deletePayment = async (payment) => {
    await customAxios.delete(`/payments/${payment?._id}`)
    setReload(!reload)
  }

  const tableFields = [
    { value: "date", showsFunc: true, shows: (val) => moment.utc(val).format("DD-MM-YYYY") },
    { value: "detail" },
    { value: "amount" },
    { value: "delete", showsFunc: true, param: true, shows: (val, row) => <MdClose className="text-xl cursor-pointer" onClick={() => deletePayment(row)} /> },
  ]

  return (
    <Main className={"grid gap-6 gap-y-16 items-start content-start text-white"}>
      <section className="grid items-center justify-center gap-8 md:items-start md:grid-cols-2 md:justify-between">
        <Title text={`Facturacion ${client ? client?.name : ""}`} className={"text-center md:text-start"} />
        <a className="md:justify-self-end justify-self-center" href={`${import.meta.env.VITE_REACT_API_URL}/api/pdf/cc/${client?._id}`} download><Button className={"flex items-center gap-x-6"}>Cuenta Corriente <FaFileExcel /></Button></a>
      </section>
      {client ? (
        <>
          <section className="flex flex-col gap-8">
            <p className="text-3xl text-center md:text-start">Deuda a favor: ${client?.balance}</p>
            <form className="flex flex-wrap items-center gap-4" onSubmit={onSubmit}>
              <Label>Agregar Pago</Label>
              <Input register={register("amount")} type="number" placeholder={"Monto"} step={0.01}/>
              <Input register={register("detail")} type="string" placeholder={"Observaciones"} />
              <Input register={register("date")} type="date" />
              <Button><TiTick /></Button>
            </form>
            <Table fields={tableFields} headers={["Fecha", "Observaciones", "Monto", "Borrar"]} rows={client?.payments} containerClassName="max-h-[500px]" />
          </section>
          <section className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-auto content-start grid-flow-row">
            {client?.orders?.length ? (
              client?.orders.map(o => {
                let articlesString = ""
                const articlesForString = o?.articles?.filter(a => a)
                articlesForString?.forEach((article, i) => {
                  articlesString += `${(article?.article?.description || article?.customArticle?.detail)?.toUpperCase()}${i != (articlesForString?.length - 1) ? " ///// " : ""}`
                })
                o = { ...o, remainingDays: moment(o?.deliveryDate).diff(moment(), "days"), articlesString }
                return <OrderCard key={o?._id} order={o} green link={`/prices/order/${o?._id}`} />
              })
            ) : (
              <p className="text-white text-2xl">No hay pedidos</p>
            )}
          </section>
        </>
      ) : (
        <Oval className="text-3xl" />
      )}
    </Main>
  )
}

export default ClientPayments