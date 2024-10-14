import { useState, useEffect, useContext } from "react"
import customAxios from "../config/axios.config"
import { useParams } from "react-router-dom"
import Main from "../containers/Main"
import Table from "../components/Table"
import { Oval } from "react-loader-spinner"
import Title from "../components/Title"
import Button from "../components/Button"
import { FaFileExcel, FaFilePdf } from "react-icons/fa"
import Label from "../components/Label"
import Input from "../components/Input"
import { userIncludesRoles } from "../utils/utils"
import { UserContext } from "../context/UserContext"

const Price = () => {
  const { userData } = useContext(UserContext)
  const [order, setOrder] = useState(null)
  const [reload, setReload] = useState(false)
  const [edit, setEdit] = useState(false)
  const { oid } = useParams()

  useEffect(() => {
    customAxios.get(`/orders/${oid}`).then((res) => {
      setOrder({
        ...res?.data?.order, articles: res?.data?.order?.articles?.map(art => {
          return { bookedQuantity: art.booked, custom: art?.customArticle ? true : false, ...art, ...art?.article, ...art?.customArticle, price: art?.price || 0 }
        })
      })
    })
  }, [reload])

  const multiply = (order?.mode ? 1.21 : 1)

  const tableFields = [
    { value: "description" },
    { value: "quantity" },
    {
      value: "price", showsFunc: true, param: true, shows: (val, row) => {
        return (userIncludesRoles(userData, "prices") ? <Input type="number" key={row?._id + "price"} defaultValue={val || 0} disabled={!edit} onChange={(e) => onChangePrice(e?.target?.value, row)} className={"!py-0 !px-0 rounded-none focus:!bg-transparent w-[100px]"} containerClassName={"!border-0 rounded-none"} /> : null)
      }
    },
    { value: "iva", showsFunc: true, param: true, shows: (val, row) => (((row?.price * row?.quantity) || 0) * (multiply - 1)).toFixed(2) },
    { value: "subtotal", showsFunc: true, param: true, shows: (val, row) => ((row?.price * row?.quantity) || 0) * multiply },
  ]

  const onChangePrice = async (price, article) => {
    await customAxios.put(`/orders/price/${oid}/${article?._id}?price=${price}${article?.custom ? "&custom=true" : ""}`)
  }

  const onConfirmPrices = async () => {
    setEdit(!edit)
    setReload(!reload)
  }

  const toggleMode = async () => {
    await customAxios.put(`/orders/mode/${oid}`)
    setReload(!reload)
  }

  return (
    <Main className={"grid gap-8 content-start"}>
      <section className="grid md:grid-cols-2 content-start gap-8">
        <Title text={`Facturacion: N° ${order?.orderNumber} - ${order?.client?.name}`} className={"md:text-start text-center text-3xl"} />
        <Button className={"md:justify-self-end self-start px-4 py-2"} onClick={toggleMode}>Modo: {order?.mode ? "Cuenta 1" : "Cuenta 2"}</Button>
      </section>
      {order ? (
        <>
          <section className="grid gap-8 max-w-full text-white">
            <div className="flex flex-col gap-8">
              <h3 className="text-2xl">Total: ${order?.articles?.reduce((acc, art) => acc + ((art?.price ? (art?.price * art?.quantity) : 0) * multiply), 0)}</h3>
            </div>
            <div className="flex flex-wrap justify-between items-center gap-8">
              <h3 className="text-xl">Detalles del pedido</h3>
              {!order?.suborders?.length && <Button onClick={edit ? onConfirmPrices : () => setEdit(!edit)} className={"rounded-none border-2 border-white bg-third"}>{!edit ? "Editar precios" : "Actualizar"}</Button>}
            </div>
            <Table fields={tableFields} headers={["Articulo", "Cantidad", "Precio Unitario", "Iva", "Subtotal"]} rows={order?.articles} />
            <div className="flex flex-wrap items-center gap-4">
              <a href={`${import.meta.env.VITE_REACT_API_URL}/api/pdf/${order?.mode ? "1" : "2"}/${oid}`} download><Button className={"flex items-center gap-x-6"}>Cuenta <FaFilePdf /></Button></a>
            </div>
          </section>
        </>
      ) : (
        <Oval className="text-3xl" />
      )}
    </Main>
  )
}

export default Price