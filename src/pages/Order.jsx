import { useEffect, useState } from "react"
import Main from "../containers/Main"
import customAxios from "../config/axios.config"
import { useParams } from "react-router-dom"
import { Oval } from "react-loader-spinner"
import ArticleCard from "../components/ArticleCard"

const Order = () => {
  const [order, setOrder] = useState(null)
  const [cut, setCut] = useState(null)
  const {oid} = useParams()

  useEffect(() => {
    customAxios.get(`/orders/${oid}`).then((res) => {
      console.log(res.data)
      setOrder({...res?.data?.order, articles: res?.data?.order?.articles?.map(art => {
        return {bookedQuantity: art.booked, ...art, ...art?.article, ...art?.customArticle}
      })})
      setCut(res?.data?.cut)
    })
  }, [])

  return (
    <Main className={"grid md:grid-cols-2 gap-y-8 md:gap-y-16 gap-x-16 content-start text-white"}>
      {(order) ? (
        <>
          <h2 className="text-4xl md:col-span-2 font-bold">Pedido N° {order?.orderNumber}</h2>
          <section className="flex flex-col gap-8">
            <h3 className="text-3xl">Cliente: {order?.client?.name}</h3>
            <p className="text-xl">Telefono: {order?.client?.phone}</p>
            <p className="text-xl">Email: {order?.client?.email}</p>
            <p className="text-xl">Cuit: {order?.client?.cuit}</p>
            <p className="text-xl">Direccion: {order?.client?.address}</p>
            <p className="text-xl">Referencia: {order?.client?.detail}</p>
          </section>
          <section className="grid grid-cols-2 gap-6">
            <h3 className="col-span-2 text-xl">Articulos de linea</h3>
            {order?.articles?.filter(a => a.article)?.length ? order?.articles?.filter(a => a.article)?.map(article => {
              return <ArticleCard article={article} customArticle={article?.customArticle} onClickArticle={(a,b) => {}} hoverEffect={false} bookedQuantity quantityNoControl stockNoControl/>
            }) : <p>No hay articulos de linea</p>}
            <h3 className="col-span-2 mt-16 text-xl">Articulos personalizados</h3>
            {order?.articles?.filter(a => a.customArticle)?.length ? order?.articles?.filter(a => a.customArticle)?.map(article => {
              return <ArticleCard article={article} customArticle={article?.customArticle} onClickArticle={(a,b) => {}} hoverEffect={false} bookedQuantity quantityNoControl stockNoControl/>
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