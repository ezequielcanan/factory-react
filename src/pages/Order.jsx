import { useEffect, useState, useRef } from "react"
import Main from "../containers/Main"
import customAxios from "../config/axios.config"
import { useNavigate, useParams } from "react-router-dom"
import { Oval } from "react-loader-spinner"
import ArticleCard from "../components/ArticleCard"
import Table from "../components/Table"
import { FaCross, FaFilePdf, FaFileUpload, FaMinusCircle, FaPlusCircle, FaTrashAlt } from "react-icons/fa"
import Input from "../components/Input"
import Button from "../components/Button"
import Swal from "sweetalert2"
import { MdClose } from "react-icons/md"
import ArticlesContainer from "../containers/ArticlesContainer"
import Label from "../components/Label"
import { measurements, uploadFile, userIncludesRoles } from "../utils/utils"
import OrderCard from "../components/OrderCard"
import { useContext } from "react"
import { UserContext } from "../context/UserContext"
import { useForm } from "react-hook-form"
import moment from "moment"
import SelectInput from "../components/SelectInput"
import { FaListCheck } from "react-icons/fa6"
import ConfirmCut from "../containers/ConfirmCut"
import { HiDuplicate } from "react-icons/hi"

const Order = ({ buys = false }) => {
  const { userData } = useContext(UserContext)
  const [order, setOrder] = useState(null)
  const [cut, setCut] = useState(null)
  const [file, setFile] = useState(null)
  const [bordadoFile, setBordadoFile] = useState(null)
  const { register, handleSubmit, reset } = useForm()
  const [reload, setReload] = useState(false)
  const [lastReload, setLastReload] = useState(false)
  const [cutArticles, setCutArticles] = useState(null)
  const [pricesList, setPricesList] = useState([])
  const [dateOne, setDateOne] = useState("")
  const [dateTwo, setDateTwo] = useState("")
  const [info, setInfo] = useState("")
  const [transfer, setTransfer] = useState("")
  const [bordadoType, setBordadoType] = useState({ value: "Bordado" })
  const [measurement, setMeasurement] = useState(measurements[0])
  const [edit, setEdit] = useState(false)
  const newSuborderRef = useRef(null)
  const navigate = useNavigate()
  const { oid } = useParams()

  const endpoint = !buys ? "orders" : "buy-orders"

  useEffect(() => {
    customAxios.get(`/${endpoint}/${oid}`).then((res) => {
      setOrder(!buys ? {
        ...res?.data?.order, articles: res?.data?.order?.articles?.map(art => {
          return { bookedQuantity: art.booked, custom: art?.customArticle ? true : false, ...art, ...art?.article, ...art?.customArticle, price: art?.price || 0 }
        })
      } : {
        ...res?.data, articles: res?.data?.articles?.map(art => {
          return { custom: art?.customArticle ? true : false, ...art, ...art?.article, ...art?.customArticle, price: art?.price || 0 }
        })
      })
      setCut(res?.data?.cut)
      setLastReload(reload)
    })
  }, [reload, oid])

  const onClickControls = async (article, property, qty) => {
    if (property == "quantity" && (Number(article?.quantity) + Number(qty)) >= 0) {
      await customAxios.put(`/${endpoint}/quantity/${oid}/${article?._id}/${Number(article?.quantity) + Number(qty)}${article?.custom ? "?custom=true" : ""}`)
      setReload(!reload)
    } else if (property == "bookedQuantity" && (Number(article?.bookedQuantity) + Number(qty)) >= 0) {
      await customAxios.put(`/orders/booked/${oid}/${article?._id}/${Number(article?.bookedQuantity) + Number(qty)}${article?.custom ? "?custom=true" : ""}`)
      setReload(!reload)
    }
  }

  const onClickHasToBeCut = async (article) => {
    await customAxios.put(`/orders/cut-state/${oid}/${article?._id}${article?.custom ? "?custom=true" : ""}`)
    setReload(!reload)
  }

  const onChangePrice = async (price, article) => {
    await customAxios.put(`/${endpoint}/price/${oid}/${article?._id}?price=${price}${article?.custom ? "&custom=true" : ""}`)
    setReload(!reload)
  }

  const onConfirmPrices = async () => {
    setEdit(!edit)
    setReload(!reload)
  }

  const onFinishOrder = async () => {
    await customAxios.put(`/orders/finish/${oid}`)
    navigate(`/prices/order/${oid}`)
  }


  const deleteOrder = async () => {
    Swal.fire({
      title: `<strong>CUIDADO: Vas a borrar ${!buys ? "el pedido" : "la compra"}</strong>`,
      icon: "warning",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: `
        Confirmar
      `,
      cancelButtonText: `
        Cancelar
      `,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await customAxios.delete(`/${endpoint}/${oid}`)
        navigate(`/${endpoint}`)
      }
    });
  }

  const onPassToPricing = async () => {
    Swal.fire({
      title: "<strong>Bultos:</strong>",
      icon: "info",
      input: "number",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: `
        Confirmar
      `,
      cancelButtonText: `
        Cancelar
      `,
    }).then(async (result) => {
      if (result.isConfirmed && result?.value) {
        await customAxios.put(`/orders/${oid}?property=inPricing&value=true`)
        await customAxios.put(`/orders/${oid}?property=packages&value=${result?.value || 0}`)
        setReload(!reload)
      }
    });
  }

  const deleteArticle = async (article) => {
    await customAxios.delete(`/${endpoint}/articles/${oid}/${article?.article ? article?.article?._id : article?.customArticle?._id}${article?.custom ? "?custom=true" : ""}`)
    setReload(!reload)
  }

  const addArticle = async (article, custom) => {
    if (article) {
      await customAxios.post(`/${endpoint}/articles/${oid}/${article?._id}`)
      setReload(!reload)
    } else {
      await handleSubmit(async data => {
        const result = await customAxios.post("/articles/custom", [!buys ? { ...data, quantity: 0, common: false, bordadoType: bordadoType?.value || "Bordado" } : { ...data, quantity: 0, measurement: measurement?.value }])
        const cid = result?.data[0]?._id
        const filePath = `/articles/custom/${cid}`
        reset()
        file && await uploadFile(file[1], filePath, "thumbnail.png")
        bordadoFile && await uploadFile(bordadoFile[1], filePath, "bordado.png")

        await customAxios.post(`/${endpoint}/articles/${oid}/${cid}?custom=true`)
      })()
      setReload(!reload)
    }
  }

  const changeCustomArticleFile = (file, bordado = false) => {
    const uploadedFile = file
    const reader = new FileReader();
    reader.onload = (e) => {
      !bordado ? setFile([e?.target?.result, uploadedFile]) : setBordadoFile([e?.target?.result, uploadedFile])
    };
    reader.readAsDataURL(uploadedFile)
  }

  const tableFields = [
    { value: "description" },
    { value: "quantity", controls: true, onClickControls: onClickControls },
    { value: "bookedQuantity", controls: !order?.budget, onClickControls: onClickControls },
    { value: "hasToBeCut", showsFunc: true, shows: (val) => val ? "Si" : "No", clickeable: true, onClick: onClickHasToBeCut },
    {
      value: "price", showsFunc: true, param: true, shows: (val, row) => {
        return (userIncludesRoles(userData, "prices") ? <Input type="number" value={row?.price || ""} disabled={!edit} id={"tablePrice" + row?._id} onChange={(e) => onChangePrice(e?.target?.value, row)} className={"!py-0 !px-0 rounded-none focus:!bg-transparent w-[100px]"} containerClassName={"!border-0 rounded-none"} /> : null)
      }
    },
    { value: "subtotal", showsFunc: true, param: true, shows: (val, row) => userIncludesRoles(userData, "prices") ? ((row?.price * row?.quantity) || 0) : null },
    { value: "delete", showsFunc: true, param: true, shows: (val, row) => <MdClose className="text-xl cursor-pointer" onClick={() => deleteArticle(row)} /> },
  ]

  const onDeleteSuborder = async (suborder) => {
    await customAxios.delete(`/orders/suborders/${order?._id}/${suborder?._id}`)
    setReload(!reload)
  }

  const onClickAddSuborder = async () => {
    const suborder = (await customAxios.post(`/orders/suborders/${order?._id}/${newSuborderRef?.current?.value}${userIncludesRoles(userData, "cattown") ? "?cattown=true" : ""}`)).data
    newSuborderRef.current.value = ""
    setReload(!reload)
  }

  const onChangeDeliveryDate = async (e) => {
    await customAxios.put(`/orders/${oid}?property=deliveryDate&value=${moment(e?.target?.value, "YYYY-MM-DD")}`)
    setReload(!reload)
  }

  const onPassToOrder = async () => {
    await customAxios.put(`/orders/${oid}?property=budget&value=false`)

    const commonArticles = order?.articles?.filter(a => a?.common || a?.article)

    let newOrder = { ...order }
    await Promise.all(commonArticles.map(async article => {
      const booked = article?.totalBooked
      const stock = article?.stock
      const stockDifference = (stock - booked)
      const bookedQuantity = (stockDifference >= article?.quantity) ? article?.quantity : stockDifference

      const result = await customAxios.put(`/orders/booked/${oid}/${article?._id}/${bookedQuantity}`)
      newOrder = result?.data
    }))


    let count = 0
    const arts = newOrder?.articles?.map(a => {
      if (a.quantity > a.booked) {
        count++
        return {
          cutQuantity: a.quantity - a.booked,
          ...a
        }
      }
    })

    if (count) {
      setCutArticles(arts.filter(a => a))
    } else {
      setReload(!reload)
    }
  }

  const onConfirmCutOrder = async () => {
    await customAxios.put(`/orders/articles/${oid}`)

    setCutArticles(null)
    setReload(!reload)
  }

  const duplicateOrder = async () => {
    const newOrder = { ...order, cloned: true }
    newOrder.articles = newOrder?.articles?.map(art => {
      if (art?.custom) {
        art.customArticle = art?.customArticle?._id
      } else {
        art.article = art?.article?._id
      }
      return art
    })

    if (newOrder.suborders) {
      newOrder.suborders = newOrder.suborders?.map(o => {
        o = o?._id
        return o
      })
    }

    newOrder.client = newOrder.client?._id
    delete newOrder._id
    delete newOrder.orderNumber
    const result = await customAxios.post("/orders", newOrder)
    navigate(`/orders/${result?.data?._id}`)
  }

  const cancelCut = async () => {
    setCutArticles(null)
    setReload(!reload)
  }

  const setInputState = (e, setState) => {
    setState(e?.target?.value)
  }

  const toggleMode = async () => {
    await customAxios.put(`/${endpoint}/${order?._id}?property=mode&value=${!order?.mode}`)
    setReload(!reload)
  }

  const onReceiveBuyOrder = async () => {
    await customAxios.put(`/${endpoint}/${order?._id}?property=received&value=true`)
    await customAxios.put(`/${endpoint}/${order?._id}?property=receivedDate&value=${moment()}`)
    navigate(`/debts/order/${order?._id}`)
  }

  const onPassToOrdered = async () => {
    await customAxios.put(`/${endpoint}/${order?._id}?property=ordered&value=true`)
    setReload(!reload)
  }

  const headerText = buys ? "Insumos" : "Articulos"
  const tableHeaders = ["Articulo", "Cantidad", "Reservado", "Cortar Restantes", "Precio Unitario", "Subtotal", "Borrar"]

  if (buys) {
    tableHeaders.splice(2, 2)
    tableHeaders[0] = "Insumo"
    tableFields.splice(2, 2)
  }

  const greenButton = "bg-green-700 hover:bg-green-800"

  return (
    <Main className={"grid lg:grid-cols-2 gap-y-8 md:gap-y-16 gap-x-16 overflow-x-hidden content-start text-white"}>
      {(order && !cutArticles) ? (
        <>
          <h2 className="text-4xl justify-self-center lg:justify-self-start font-bold">{!buys ? (!order?.budget ? "Pedido" : "Presupuesto") : "Compra"} N° {order?.orderNumber}</h2>
          <div className="flex gap-8 flex-wrap items-center justify-center lg:justify-end">
            <div className="flex items-center flex-wrap self-start gap-8">
              {!buys && <HiDuplicate className="text-2xl cursor-pointer" onClick={duplicateOrder} />}
              <FaTrashAlt className="text-2xl cursor-pointer" onClick={deleteOrder} />
              {order?.budget && <a href={`${import.meta.env.VITE_REACT_API_URL}/api/pdf/budget/${oid}?dateOne=${dateOne}&dateTwo=${dateTwo}&transfer=${transfer}&info=${info}`} download className="text-2xl"><FaListCheck /></a>}
              {buys && <>
                <a href={`${import.meta.env.VITE_REACT_API_URL}/api/pdf/2/${oid}?buy=true`} download className="text-2xl"><FaFilePdf /></a>
                <Button onClick={toggleMode}>Cuenta {order?.mode ? "1" : "2"}</Button>
              </>}
              <Button className={`justify-self-center lg:justify-self-end ${!buys ? (!order?.budget && (!order?.finished && (order?.inPricing ? greenButton : "bg-sky-600 hover:bg-sky-700"))) : (!order?.received && greenButton)}`} onClick={!buys ? (!order.budget ? (!order?.finished ? (order?.inPricing ? onFinishOrder : onPassToPricing) : () => navigate(`/prices/order/${oid}`)) : onPassToOrder) : (order?.ordered ? onReceiveBuyOrder : onPassToOrdered)}>{!buys ? (!order?.budget ? (order?.finished ? "Finalizado" : (!order?.inPricing ? "Pasar a facturacion" : "Facturar")) : "Confirmar pedido") : (order?.ordered ? !order?.received ? "Recibir" : "Recibido" : "Pedir")}</Button>
            </div>
            {order?.budget && <div className="flex flex-col gap-4">
              <Input type="number" value={transfer} onChange={e => setInputState(e, setTransfer)} placeholder="% TRANSFERENCIA" />
              <Input type="number" value={dateOne} onChange={e => setInputState(e, setDateOne)} placeholder="PLAZO 1" />
              <Input type="number" value={dateTwo} onChange={e => setInputState(e, setDateTwo)} placeholder="PLAZO 2" />
              <Input placeholder="INFO EXTRA" value={info} onChange={e => setInputState(e, setInfo)} textarea className="w-full resize-none" />
            </div>}
          </div>
          <section className="flex flex-col gap-16">
            <div className="flex flex-col gap-8">
              <h3 className="text-3xl">{!buys ? "Cliente" : "Proveedor"}: {order?.client?.name}</h3>
              {!buys && <div className="flex items-center gap-4">
                <Label>Fecha de entrega:</Label>
                <Input defaultValue={moment(order?.deliveryDate).format("YYYY-MM-DD")} type={"date"} onChange={onChangeDeliveryDate} />
              </div>}
              <p className="text-xl">Telefono: {order?.client?.phone}</p>
              <p className="text-xl">Email: {order?.client?.email}</p>
              <p className="text-xl">Cuit: {order?.client?.cuit}</p>
              <p className="text-xl">Direccion: {order?.client?.address}</p>
              <p className="text-xl">Referencia: {order?.client?.detail}</p>
              <p className="text-xl">Expreso: {order?.client?.expreso}</p>
              <p className="text-xl">Direccion de expreso: {order?.client?.expresoAddress}</p>
            </div>
            <p className="text-xl max-w-full text-wrap">Informacion extra / Anotaciones: {order?.extraInfo}</p>
            {!order?.suborders?.length ? (
              <>
                <div className="grid gap-8 max-w-full">
                  <div className="flex flex-wrap justify-between items-center gap-8">
                    <h3 className="text-3xl">Detalles del pedido</h3>
                    <Button onClick={edit ? onConfirmPrices : () => setEdit(!edit)} className={"rounded-none border-2 border-white bg-third"}>{!edit ? "Editar precios" : "Actualizar"}</Button>
                  </div>
                  <Table fields={tableFields} headers={tableHeaders} rows={order?.articles} />
                </div>
                <ArticlesContainer materials={buys} containerClassName={"max-h-[800px] overflow-y-scroll md:!grid-cols-2 text-black auto-rows-auto"} filterClassName="md:!col-span-2 !flex-col md:!flex-col xl:!flex-col" filterCClassName="xl:!grid-cols-1" pageClassName={"md:!col-span-2 lg:!col-span-2 xl:!col-span-2"} stockControl={false} onClickArticle={addArticle} stockNoControl />
                <div className="grid grid-cols-1 bg-third p-4 rounded-lg sm:grid-cols-2 w-full gap-4">
                  <Input className={"resize-none w-full h-full"} textarea register={register("detail")} placeholder={"Producto"} />
                  {!buys ?
                    <>
                      <Input className={"resize-none w-full h-full"} textarea register={register("size")} placeholder={"Talle"} />
                      <SelectInput selectedOption={bordadoType} setSelectedOption={setBordadoType} options={[{ value: "Bordado" }, { value: "Estampado" }]} containerClassName={"w-auto text-black"} />
                      <Input className={"resize-none w-full h-full"} textarea register={register("bordado")} placeholder={bordadoType?.value} />
                      <Input className={"resize-none w-full h-full"} textarea register={register("ubicacion")} placeholder={"Ubicacion"} />
                      <Input className={"resize-none w-full h-full"} textarea register={register("details")} placeholder={"Detalle tecnico"} containerClassName={"md:col-span-2"} />
                    </> : <>
                      <SelectInput selectedOption={measurement} setSelectedOption={setMeasurement} options={[...measurements]} containerClassName={"w-auto text-black"} />
                    </>}
                  <Label htmlFor={"file"} className={`${file ? "max-h-[150px] border-4 border-nav" : "w-full h-full border-dashed rounded-lg border-nav border-4 py-8"} col-span-1 flex items-center overflow-hidden self-center justify-center `}>
                    {!file ? <FaFileUpload className="text-7xl" /> : <img src={file[0]} alt="Seleccionar imagen" className="w-full h-full object-cover" />}
                    <Input type="file" className="hidden" id={"file"} accept="image/*" name={"file"} onChange={e => changeCustomArticleFile(e?.target?.files[0])} containerClassName={"hidden"} />
                  </Label>
                  {!buys && <Label htmlFor={"bfile"} className={`${bordadoFile ? "max-h-[150px] border-4 border-nav" : "w-full h-full border-dashed rounded-lg border-nav border-4 py-8"} col-span-1 flex items-center overflow-hidden self-center justify-center `}>
                    {!bordadoFile ? <FaFileUpload className="text-7xl" /> : <img src={bordadoFile[0]} alt="Seleccionar imagen" className="w-full h-full object-cover" />}
                    <Input type="file" className="hidden" id={"bfile"} accept="image/*" name={"bfile"} onChange={e => changeCustomArticleFile(e?.target?.files[0], true)} containerClassName={"hidden"} />
                  </Label>}
                  <div className="md:col-span-2">
                    <Button onClick={() => addArticle(false, true)}>Agregar</Button>
                  </div>
                </div>
              </>
            ) : null}
          </section>
          <section className="grid lg:grid-cols-2 gap-6 content-start">
            {!order?.suborders?.length ? (
              <>
                <h3 className="lg:col-span-2 text-xl self-start">{headerText} de linea</h3>
                {order?.articles?.filter(a => a.article)?.length && lastReload == reload ? order?.articles?.filter(a => a.article)?.map(article => {
                  return <ArticleCard key={article?._id + reload} article={article} customArticle={article?.customArticle} onClickArticle={(a, b) => { }} hoverEffect={false} bookedQuantity quantityLocalNoControl quantityNoControl stockNoControl />
                }) : <p>No hay {headerText.toLowerCase()} de linea</p>}
                <h3 className="lg:col-span-2 mt-16 text-xl">{headerText} personalizados</h3>
                {order?.articles?.filter(a => a.customArticle)?.length && lastReload == reload ? order?.articles?.filter(a => a.customArticle)?.map(article => {
                  return <ArticleCard key={article?._id + reload} article={article} customArticle={article?.customArticle} onClickArticle={(a, b) => { }} hoverEffect={false} bookedQuantity quantityLocalNoControl quantityNoControl stockNoControl />
                }) : <p>No hay {headerText.toLowerCase()} personalizados</p>}
              </>
            ) : (
              <>
                <h3 className="lg:col-span-2 text-xl self-start">Parciales</h3>
                {order?.suborders?.map(s => {
                  let articlesString = ""
                  const articlesForString = s?.articles?.filter(a => a)
                  articlesForString?.forEach((article, i) => {
                    articlesString += `${(article?.article?.description || article?.customArticle?.detail)?.toUpperCase()}${i != (articlesForString?.length - 1) ? " ///// " : ""}`
                  })
                  s = { ...s, remainingDays: moment(s?.deliveryDate).diff(moment(), "days"), articlesString }
                  return <OrderCard order={s} key={s?._id} cross crossAction={onDeleteSuborder} />
                })}
                <div className="flex gap-x-4 lg:col-span-2">
                  <Input placeholder="N° de pedido" ref={newSuborderRef} className={"w-full"} />
                  <Button className={"px-4 py-2"} onClick={onClickAddSuborder}>Agregar</Button>
                </div>
              </>
            )}
          </section>
        </>
      ) : (
        !cutArticles ? (
          <Oval className="text-3xl" />
        ) : (
          <ConfirmCut order={cutArticles} onConfirmCutOrder={onConfirmCutOrder} cancelFunc={cancelCut} />
        )
      )}
    </Main>
  )
}

export default Order