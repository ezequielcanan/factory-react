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

const ClientPayments = () => {
  const [client, setClient] = useState(null)
  const [reload, setReload] = useState(false)
  const {register, handleSubmit, reset} = useForm()
  const { cid } = useParams()

  useEffect(() => {
    customAxios.get(`/payments/balance/${cid}`).then(res => {
      setClient(res.data)
    })
  }, [reload])

  const onSubmit = handleSubmit(async data => {
    await customAxios.post(`/payments`, {...data, amount: Number(data?.amount), client: cid})
    reset()
    setReload(!reload)
  })

  const tableFields = [
    { value: "date", showsFunc: true, shows: (val) => moment.utc(val).format("DD-MM-YYYY") },
    { value: "amount"},
  ]
  console.log(client)
  return (
    <Main className={"grid gap-6 gap-y-16 items-start content-start text-white"}>
      <section className="grid items-center justify-center gap-8 md:items-start md:grid-cols-2 md:justify-between">
        <Title text={`Facturacion ${client ? client?.name : ""}`} className={"text-center md:text-start"} />
      </section>
      {client ? (
        <>
          <section className="flex flex-col gap-8">
            <p className="text-3xl text-center md:text-start">Deuda a favor: ${client?.balance}</p>
            <form className="flex flex-wrap items-center gap-4" onSubmit={onSubmit}>
              <Label>Agregar Pago</Label>
              <Input register={register("amount")} type="number" />
              <Input register={register("date")} type="date" />
              <Button><TiTick/></Button>
            </form>
            <Table fields={tableFields} headers={["Fecha", "Monto"]} rows={client?.payments}/>
          </section>
          <section className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-auto content-start grid-flow-row">
            {client?.orders?.length ? (
              client?.orders.map(o => {
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