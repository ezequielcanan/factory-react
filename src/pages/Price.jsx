import { useState, useEffect } from "react"
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

const Price = () => {
  const [order, setOrder] = useState(null)
  const { oid } = useParams()

  useEffect(() => {
    customAxios.get(`/orders/${oid}`).then((res) => {
      setOrder({
        ...res?.data?.order, articles: res?.data?.order?.articles?.map(art => {
          return { bookedQuantity: art.booked, custom: art?.customArticle ? true : false, ...art, ...art?.article, ...art?.customArticle }
        })
      })
    })
  }, [])

  const tableFields = [
    { value: "description" },
    { value: "quantity" },
    {
      value: "price", showsFunc: true, param: true, shows: (val, row) => {
        return val || 0
      }
    },
    { value: "subtotal", showsFunc: true, param: true, shows: (val, row) => (row?.price * row?.quantity) || 0 },
  ]

  const onChangePaidAmount = async (e) => {
    await customAxios.put(`/orders/paid/${oid}?paid=${e?.target?.value}`)
  }

  return (
    <Main className={"grid gap-8 content-start"}>
      <section>
        <Title text={`Facturacion: N° ${order?.orderNumber} - ${order?.client?.name}`} className={"md:text-start text-center text-3xl"}/>
      </section>
      {order ? (
        <>
          <section className="grid gap-8 max-w-full text-white">
            <div className="flex flex-col gap-8">
              <h3 className="text-2xl">Total: ${order?.articles?.reduce((acc, art) => acc+(art?.price ? (art?.price * art?.quantity) : 0), 0)}</h3>
            </div>
            <div className="flex flex-wrap justify-between items-center gap-8">
              <h3 className="text-xl">Detalles del pedido</h3>
            </div>
            <Table fields={tableFields} headers={["Articulo", "Cantidad", "Precio Unitario", "Subtotal"]} rows={order?.articles} />
            <div className="flex flex-wrap items-center gap-4">
              <a href={`${import.meta.env.VITE_REACT_API_URL}/api/pdf/1/${oid}`} download><Button className={"flex items-center gap-x-6"}>Cuenta <FaFilePdf/></Button></a>
              <a href={`${import.meta.env.VITE_REACT_API_URL}/api/pdf/cc/${order?.client?._id}`} download><Button className={"flex items-center gap-x-6"}>Cuenta Corriente <FaFileExcel/></Button></a>
            </div>
          </section>
        </>
      ) : (
        <Oval className="text-3xl"/>
      )}
    </Main>
  )
}

export default Price