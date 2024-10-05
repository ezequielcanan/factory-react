import { useEffect, useState, useRef } from "react"
import Main from "../containers/Main"
import customAxios from "../config/axios.config"
import { useNavigate, useParams } from "react-router-dom"
import { Oval } from "react-loader-spinner"
import ArticleCard from "../components/ArticleCard"
import Table from "../components/Table"
import { FaCross, FaFileUpload, FaMinusCircle, FaPlusCircle, FaTrashAlt } from "react-icons/fa"
import Input from "../components/Input"
import Button from "../components/Button"
import Swal from "sweetalert2"
import { MdClose } from "react-icons/md"
import ArticlesContainer from "../containers/ArticlesContainer"
import Label from "../components/Label"
import { uploadFile, userIncludesRoles } from "../utils/utils"
import OrderCard from "../components/OrderCard"
import { useContext } from "react"
import { UserContext } from "../context/UserContext"
import { useForm } from "react-hook-form"

const Order = () => {
  const {userData} = useContext(UserContext)
  const [order, setOrder] = useState(null)
  const [cut, setCut] = useState(null)
  const [file, setFile] = useState(null)
  const {register, handleSubmit, reset} = useForm()
  const [reload, setReload] = useState(false)
  const [lastReload, setLastReload] = useState(false)
  const [pricesList, setPricesList] = useState([])
  const [edit, setEdit] = useState(false)
  const newSuborderRef = useRef(null)
  const navigate = useNavigate()
  const { oid } = useParams()

  useEffect(() => {
    customAxios.get(`/orders/${oid}`).then((res) => {
      setOrder({
        ...res?.data?.order, articles: res?.data?.order?.articles?.map(art => {
          return { bookedQuantity: art.booked, custom: art?.customArticle ? true : false, ...art, ...art?.article, ...art?.customArticle }
        })
      })
      setCut(res?.data?.cut)
      setLastReload(reload)
    })
  }, [reload, oid])

  const onClickControls = async (article, property, qty) => {
    if (property == "quantity" && (Number(article?.quantity) + Number(qty)) >= 0) {
      await customAxios.put(`/orders/quantity/${oid}/${article?._id}/${Number(article?.quantity) + Number(qty)}${article?.custom ? "?custom=true" : ""}`)
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

  const onChangePrice = (price, article) => {
    setPricesList([...pricesList, { ...article, price: price }])
  }

  const onConfirmPrices = async () => {
    await Promise.all(pricesList.map(async change => {
      await customAxios.put(`/orders/price/${oid}/${change?._id}?price=${change?.price}${change?.custom ? "&custom=true" : ""}`)
    }))
    setEdit(!edit)
    setReload(!reload)
  }

  const onFinishOrder = async () => {
    await customAxios.put(`/orders/finish/${oid}`)
    navigate(`/prices/order/${oid}`)
  }

  const deleteOrder = async () => {
    Swal.fire({
      title: "<strong>CUIDADO: Vas a borrar el pedido</strong>",
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
        await customAxios.delete(`/orders/${oid}`)
        navigate("/orders")
      }
    });
  }

  const deleteArticle = async (article) => {
    await customAxios.delete(`/orders/articles/${oid}/${article?.article ? article?.article?._id : article?.customArticle?._id}${article?.custom ? "?custom=true" : ""}`)
    setReload(!reload)
  }

  const addArticle = async (article, custom) => {
    if (article) {
      await customAxios.post(`/orders/articles/${oid}/${article?._id}`)
      setReload(!reload)
    } else {
      await handleSubmit(async data => {
        const result = await customAxios.post("/articles/custom", [{ ...data, quantity: 0, common: false }])
        const cid = result?.data[0]?._id
        const filePath = `/articles/custom/${cid}`
        reset()
        await uploadFile(file[1], filePath, "thumbnail.png")
        
        await customAxios.post(`/orders/articles/${oid}/${cid}?custom=true`)
      })()
      setReload(!reload)
    }
  }

  const changeCustomArticleFile = (file) => {
    const uploadedFile = file
    const reader = new FileReader();
    reader.onload = (e) => {
      setFile([e?.target?.result, uploadedFile])
    };
    reader.readAsDataURL(uploadedFile)
  }

  const tableFields = [
    { value: "description" },
    { value: "quantity", controls: true, onClickControls: onClickControls },
    { value: "bookedQuantity", controls: true, onClickControls: onClickControls },
    { value: "hasToBeCut", showsFunc: true, shows: (val) => val ? "Si" : "No", clickeable: true, onClick: onClickHasToBeCut },
    {
      value: "price", showsFunc: true, param: true, shows: (val, row) => {
        return (userIncludesRoles(userData, "prices") ? <Input type="number" defaultValue={val || ""} disabled={!edit} onChange={(e) => onChangePrice(e?.target?.value, row)} className={"!py-0 !px-0 rounded-none focus:!bg-transparent w-[100px]"} containerClassName={"!border-0 rounded-none"} /> : null)
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

  return (
    <Main className={"grid lg:grid-cols-2 gap-y-8 md:gap-y-16 gap-x-16 overflow-x-hidden content-start text-white"}>
      {(order) ? (
        <>
          <h2 className="text-4xl justify-self-center lg:justify-self-start font-bold">Pedido N° {order?.orderNumber}</h2>
          <div className="flex gap-8 flex-wrap items-center justify-center lg:justify-end">
            <FaTrashAlt className="text-2xl cursor-pointer" onClick={deleteOrder} />
            <Button className={`justify-self-center lg:justify-self-end ${!order?.finished && "bg-green-700 hover:bg-green-800"}`} onClick={!order?.finished ? onFinishOrder : () => navigate(`/prices/order/${oid}`)}>{order?.finished ? "Facturado" : "Pasar a facturacion"}</Button>
          </div>
          <section className="flex flex-col gap-16">
            <div className="flex flex-col gap-8">
              <h3 className="text-3xl">Cliente: {order?.client?.name}</h3>
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
                    <Button onClick={edit ? onConfirmPrices : () => setEdit(!edit)} className={"rounded-none border-2 border-white bg-third"}>{!edit ? "Editar precios" : "Confirmar"}</Button>
                  </div>
                  <Table fields={tableFields} headers={["Articulo", "Cantidad", "Reservado", "Cortar Restantes", "Precio Unitario", "Subtotal", "Borrar"]} rows={order?.articles} />
                </div>
                <ArticlesContainer containerClassName={"max-h-[600px] overflow-y-auto md:!grid-cols-2 text-black"} filterClassName="md:!col-span-2 !flex-col md:!flex-col xl:!flex-col" filterCClassName="xl:!grid-cols-1" pageClassName={"md:!col-span-2 lg:!col-span-2 xl:!col-span-2"} stockControl={false} onClickArticle={addArticle} stockNoControl />
                <div className="grid grid-cols-1 bg-third p-4 rounded-lg sm:grid-cols-2 w-full gap-4">
                  <Input className={"resize-none w-full h-full"} textarea register={register("detail")} placeholder={"Producto"}/>
                  <Input className={"resize-none w-full h-full"} textarea register={register("size")} placeholder={"Talle"}/>
                  <Input className={"resize-none w-full h-full"} textarea register={register("bordado")} placeholder={"Bordado"}/>
                  <Input className={"resize-none w-full h-full"} textarea register={register("ubicacion")} placeholder={"Ubicacion"}/>
                  <Input className={"resize-none w-full h-full"} textarea register={register("details")} placeholder={"Detalle tecnico"} containerClassName={"md:col-span-2"}/>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={"file"} className={`${file ? "max-h-[150px] border-4 border-nav" : "w-full h-full border-dashed rounded-lg border-nav border-4 py-8"} col-span-1 flex items-center overflow-hidden self-center justify-center `}>
                      {!file ? <FaFileUpload className="text-7xl" /> : <img src={file[0]} alt="Seleccionar imagen" className="w-full h-full object-cover" />}
                      <Input type="file" className="hidden" id={"file"} accept="image/*" name={"file"} onChange={e => changeCustomArticleFile(e?.target?.files[0])} containerClassName={"hidden"} />
                    </Label>
                    <Button onClick={() => addArticle(false, true)}>Agregar</Button>
                  </div>
                </div>
              </>
            ) : null}
          </section>
          <section className="grid lg:grid-cols-2 gap-6 content-start">
            {!order?.suborders?.length ? (
              <>
                <h3 className="lg:col-span-2 text-xl self-start">Articulos de linea</h3>
                {order?.articles?.filter(a => a.article)?.length && lastReload == reload ? order?.articles?.filter(a => a.article)?.map(article => {
                  return <ArticleCard key={article?._id + reload} article={article} customArticle={article?.customArticle} onClickArticle={(a, b) => { }} hoverEffect={false} bookedQuantity quantityLocalNoControl quantityNoControl stockNoControl />
                }) : <p>No hay articulos de linea</p>}
                <h3 className="lg:col-span-2 mt-16 text-xl">Articulos personalizados</h3>
                {order?.articles?.filter(a => a.customArticle)?.length && lastReload == reload ? order?.articles?.filter(a => a.customArticle)?.map(article => {
                  return <ArticleCard key={article?._id + reload} article={article} customArticle={article?.customArticle} onClickArticle={(a, b) => { }} hoverEffect={false} bookedQuantity quantityLocalNoControl quantityNoControl stockNoControl />
                }) : <p>No hay articulos personalizados</p>}
              </>
            ) : (
              <>
                <h3 className="lg:col-span-2 text-xl self-start">Parciales</h3>
                {order?.suborders?.map(s => {
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
        <Oval className="text-3xl" />
      )}
    </Main>
  )
}

export default Order