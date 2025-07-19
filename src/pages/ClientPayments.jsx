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

const ClientPayments = ({buys = false}) => {
  const [client, setClient] = useState(null)
  const [reload, setReload] = useState(false)
  const [paymentsInfo, setPaymentsInfo] = useState("")
  const { register, handleSubmit, reset } = useForm()
  const { cid } = useParams()

  useEffect(() => {
    customAxios.get(`/payments/balance/${cid}${buys ? "?buys=true" : ""}`).then(res => {
      setClient(res.data)
      setPaymentsInfo(res?.data?.paymentsInfo)
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

  const endpoint = buys ? "debts" : "prices"

  const tableFields = [
    { value: "date", showsFunc: true, shows: (val) => moment.utc(val).format("DD-MM-YYYY") },
    { value: "detail" },
    { value: "amount" },
    { value: "delete", showsFunc: true, param: true, shows: (val, row) => <MdClose className="text-xl cursor-pointer" onClick={() => deletePayment(row)} /> },
  ]

  const onChangePaymentsInfo = async () => {
    await customAxios.put(`/clients/${cid}`, {paymentsInfo})
    setReload(!reload)
  }

  return (
    <Main className={"grid gap-6 gap-y-16 items-start content-start text-white"}>
      <section className="grid items-center justify-center gap-8 md:items-start md:grid-cols-2 md:justify-between">
        <Title text={`${!buys ? "Facturacion" : "Deuda"} ${client ? client?.name : ""}`} className={"text-center md:text-start !text-4xl"} />
        <a className="md:justify-self-end justify-self-center" href={`${import.meta.env.VITE_REACT_API_URL}/api/pdf/cc/${client?._id}${buys ? "?buys=true" : ""}`} download><Button className={"flex items-center gap-x-6"}>Cuenta Corriente <FaFileExcel /></Button></a>
      </section>
      {client ? (
        <>
          <section className="grid gap-8">
            <p className="text-3xl text-center md:text-start">Deuda {!buys ? "a favor" : "en contra"}: ${client?.balance?.toFixed(2)}</p>
            <form className="grid sm:flex flex-wrap items-center gap-4" onSubmit={onSubmit}>
              <Label>Agregar Pago</Label>
              <Input register={register("amount")} type="number" placeholder={"Monto"} step={0.01}/>
              <Input register={register("detail")} type="string" placeholder={"Observaciones"} />
              <Input register={register("date")} type="date" />
              <Button className={"justify-self-start"}><TiTick /></Button>
            </form>
            <div className="grid md:flex items-center flex-wrap gap-4">
              <Input textarea placeholder="Observaciones" defaultValue={paymentsInfo} containerClassName="md:justify-self-start" className="resize-none h-[100px] min-w-[300px]" onChange={e => setPaymentsInfo(e?.target?.value)}/>
              <Button onClick={onChangePaymentsInfo}>Confirmar</Button>
            </div>
            <Table fields={tableFields} headers={["Fecha", "Observaciones", "Monto", "Borrar"]} rows={client?.payments} containerClassName="max-h-[500px] w-full" />
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
                return <OrderCard key={o?._id} order={o} green link={`/${endpoint}/order/${o?._id}`} />
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