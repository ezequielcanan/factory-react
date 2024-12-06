import { useState, useEffect, useContext } from "react"
import customAxios from "../config/axios.config"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import Main from "../containers/Main"
import Table from "../components/Table"
import { Oval } from "react-loader-spinner"
import Title from "../components/Title"
import Button from "../components/Button"
import { FaFileExcel, FaFilePdf, FaFileUpload } from "react-icons/fa"
import Label from "../components/Label"
import Input from "../components/Input"
import { uploadFile, userIncludesRoles } from "../utils/utils"
import { UserContext } from "../context/UserContext"
import moment from "moment"

const Price = ({ buys = false }) => {
  const { userData } = useContext(UserContext)
  const [order, setOrder] = useState(null)
  const [reload, setReload] = useState(false)
  const [billNumber, setBillNumber] = useState("")
  const [billDate, setBillDate] = useState("")
  const [billFile, setBillFile] = useState(null)
  const [edit, setEdit] = useState(false)
  const navigate = useNavigate()
  const { oid } = useParams()
  const endpoint = !buys ? "orders" : "buy-orders"

  const filePath = `/${buys ? "buy-orders" : "orders"}/${oid}/bill`

  useEffect(() => {
    customAxios.get(`/${endpoint}/${oid}`).then(async (res) => {
      setOrder(!buys ? {
        ...res?.data?.order, articles: res?.data?.order?.articles?.map(art => {
          return { bookedQuantity: art.booked, custom: art?.customArticle ? true : false, ...art, ...art?.article, ...art?.customArticle, price: art?.price || 0 }
        })
      } : {
        ...res?.data, articles: res?.data?.articles?.map(art => {
          return { custom: art?.customArticle ? true : false, ...art, ...art?.article, ...art?.customArticle, price: art?.price || 0 }
        })
      })
      setBillNumber((!buys ? res?.data?.order?.billNumber : res?.data?.billNumber) || "")
      setBillDate(moment(!buys ? res?.data?.order?.billDate : res?.data?.billDate).format("YYYY-MM-DD") || "")
      const files = (await customAxios.get(`/upload/check?path=${filePath}`))?.data?.files
      files?.length && setBillFile(files[0])
    })
  }, [reload])

  const multiply = (order?.mode ? 1.21 : 1)

  const tableFields = [
    {
      value: "description", showsFunc: true, param: true, shows: (val, row) => {
        return (row?.description || row?.detail) + (row?.size ? " - " + row?.size : "")
      }
    },
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
    await customAxios.put(`/${endpoint}/price/${oid}/${article?._id}?price=${price}${article?.custom ? "&custom=true" : ""}`)
  }

  const onConfirmPrices = async () => {
    setEdit(!edit)
    setReload(!reload)
  }

  const toggleMode = async () => {
    //await customAxios.put(`/orders/mode/${oid}`)
    await customAxios.put(`/${endpoint}/${order?._id}?property=mode&value=${!order?.mode}`)
    setReload(!reload)
  }

  const backToOrders = async () => {
    if (!buys) {
      await customAxios.put(`/${endpoint}/${oid}?property=inPricing&value=false`)
      await customAxios.put(`/${endpoint}/${oid}?property=bultos&value=0`)
      await customAxios.put(`/${endpoint}/${oid}?property=finished&value=false`)
    } else {
      await customAxios.put(`/${endpoint}/${oid}?property=received&value=false`)
    }
    navigate(`/${endpoint}/${oid}`)
  }

  const changeBillFile = async (e) => {
    await customAxios.delete(`/upload/clear?path=${filePath}`)

    const sendFile = e?.target?.files[0]
    await uploadFile(sendFile, filePath, sendFile.name)
    setReload(!reload)
  }

  const changeBillInfo = async () => {
    await customAxios.put(`/${endpoint}/${oid}?property=billNumber&value=${billNumber}`)
    billDate && await customAxios.put(`/${endpoint}/${oid}?property=billDate&value=${moment(billDate, "YYYY-MM-DD")}`)
    setReload(!reload)
  }

  return (
    <Main className={"grid gap-8 content-start"}>
      <section className="grid md:grid-cols-2 content-start gap-8 max-w-screen">
        <div className="grid gap-y-8 max-w-full">
          <Title text={`${!buys ? "Facturacion" : "Compras"}: N° ${order?.orderNumber} - ${order?.client?.name}`} className={"md:text-start w-full text-center break-normal !text-4xl"} />
          <div className="grid  items-center gap-4 items-center md:justify-start md:justify-items-start justify-center w-full">
            <Input placeholder={"Número de factura"} defaultValue={billNumber} containerClassName={"justify-self-start max-w-full"} onChange={(e) => setBillNumber(e?.target?.value)} />
            <Input defaultValue={billDate} type="date" containerClassName={"justify-self-start max-w-full"} onChange={(e) => setBillDate(e?.target?.value)} />
            <Button onClick={changeBillInfo}>Confirmar</Button>
            <Label className={`${billFile ? "max-h-[150px] border-4 border-nav" : "py-8 border-dashed rounded-lg border-nav border-4 "} px-2 col-span-1 flex items-center overflow-hidden self-center justify-center h-full w-full`}>
              {!billFile ? <FaFileUpload className="text-2xl" /> : <div className="flex flex-col items-center">
                <a target="_blank" rel="noopener noreferrer" className="w-full h-full py-4 px-2 text-center border-b-2 border-white" onClick={(e) => e.stopPropagation()} href={`${import.meta.env.VITE_REACT_API_URL}/files${filePath}/${billFile}`}>{billFile}</a>
                <p className="py-4">Cambiar Archivo</p>
              </div>}
              <Input type="file" className="hidden" onChange={changeBillFile} containerClassName={"hidden"} />
            </Label>
          </div>
        </div>
        <div className="grid gap-y-8 w-full max-w-full">
          <Button className={"md:justify-self-end justify-self-center self-start px-4 py-2"} onClick={toggleMode}>Modo: {order?.mode ? "Cuenta 1" : "Cuenta 2"}</Button>
          <Button className={"md:justify-self-end justify-self-center self-start px-4 py-2 bg-amber-300 hover:bg-amber-500 hover:!text-white rounded-none border-2 border-black !text-black"} onClick={backToOrders}>Pasar a {!buys ? "pedidos" : "compras"}</Button>
        </div>
      </section>
      {order ? (
        <>
          <section className="grid gap-8 max-w-full w-full text-white">
            <div className="flex flex-col gap-8">
              <h3 className="text-2xl">Total: ${order?.articles?.reduce((acc, art) => acc + ((art?.price ? (art?.price * art?.quantity) : 0) * multiply), 0)}</h3>
              {!buys && <p className="text-xl">Bultos: {order?.packages}</p>}
            </div>
            <div className="flex flex-wrap justify-between items-center gap-8">
              <h3 className="text-xl">Detalles {!buys ? "del pedido" : "de la compra"}</h3>
              {!order?.suborders?.length && <Button onClick={edit ? onConfirmPrices : () => setEdit(!edit)} className={"rounded-none border-2 border-white bg-third"}>{!edit ? "Editar precios" : "Actualizar"}</Button>}
            </div>
            <Table fields={tableFields} headers={[!buys ? "Articulo" : "Insumo", "Cantidad", "Precio Unitario", "Iva", "Subtotal"]} rows={order?.articles} />
            <div className="flex flex-wrap items-center gap-4">
              <a href={`${import.meta.env.VITE_REACT_API_URL}/api/pdf/${!buys ? (order?.mode ? "1" : "2") : "2"}/${oid}${buys ? "?buy=true" : ""}`} download><Button className={"flex items-center gap-x-6"}>Cuenta <FaFilePdf /></Button></a>
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