import { useEffect, useState } from "react"
import Main from "../containers/Main"
import customAxios from "../config/axios.config"
import { useParams } from "react-router-dom"
import { Oval } from "react-loader-spinner"
import ArticleCard from "../components/ArticleCard"
import Table from "../components/Table"
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa"
import Input from "../components/Input"

const Order = () => {
  const [order, setOrder] = useState(null)
  const [cut, setCut] = useState(null)
  const [reload, setReload] = useState(false)
  const [lastReload, setLastReload] = useState(false)
  const {oid} = useParams()

  useEffect(() => {
    customAxios.get(`/orders/${oid}`).then((res) => {
      setOrder({...res?.data?.order, articles: res?.data?.order?.articles?.map(art => {
        return {bookedQuantity: art.booked, custom: art?.customArticle ? true : false, ...art, ...art?.article, ...art?.customArticle}
      })})
      setCut(res?.data?.cut)
      setLastReload(reload)
    })
  }, [reload])

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

  const tableFields = [
    {value: "description"},
    {value: "quantity", controls: true, onClickControls: onClickControls},
    {value: "bookedQuantity", controls: true, onClickControls: onClickControls},
    {value: "hasToBeCut", showsFunc: true, shows: (val) => val ? "Si" : "No", clickeable: true, onClick: onClickHasToBeCut},
    {value: "unitPrice", showsFunc: true, shows: (val) => {
      return <Input defaultValue={val} className={"!py-0 !px-0 rounded-none focus:bg-transparent w-[100px]"} containerClassName={"!border-0 rounded-none"}/>
    }},
    {value: "price"},
  ]

  return (
    <Main className={"grid lg:grid-cols-2 gap-y-8 md:gap-y-16 gap-x-16 overflow-x-hidden content-start text-white"}>
      {(order) ? (
        <>
          <h2 className="text-4xl lg:col-span-2 font-bold">Pedido N° {order?.orderNumber}</h2>
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
            <div className="grid gap-8 max-w-full">
              <h3 className="text-3xl">Detalles del pedido</h3>
              <Table fields={tableFields} headers={["Articulo", "Cantidad", "Reservado", "Cortar Restantes", "Precio Unitario", "Subtotal"]} rows={order?.articles}/>
            </div>
          </section>
          <section className="grid lg:grid-cols-2 gap-6">
            <h3 className="lg:col-span-2 text-xl">Articulos de linea</h3>
            {order?.articles?.filter(a => a.article)?.length && lastReload == reload ? order?.articles?.filter(a => a.article)?.map(article => {
              return <ArticleCard key={article?._id + reload} article={article} customArticle={article?.customArticle} onClickArticle={(a,b) => {}} hoverEffect={false} bookedQuantity quantityNoControl stockNoControl/>
            }) : <p>No hay articulos de linea</p>}
            <h3 className="lg:col-span-2 mt-16 text-xl">Articulos personalizados</h3>
            {order?.articles?.filter(a => a.customArticle)?.length && lastReload == reload ? order?.articles?.filter(a => a.customArticle)?.map(article => {
              return <ArticleCard key={article?._id + reload} article={article} customArticle={article?.customArticle} onClickArticle={(a,b) => {}} hoverEffect={false} bookedQuantity quantityNoControl stockNoControl/>
            }) : <p>No hay articulos personalizados</p>}
          </section>
        </>
      ) : (
        <Oval className="text-3xl"/>
      )}
    </Main>
  )
}

export default Order