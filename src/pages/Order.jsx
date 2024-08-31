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
        return {...art, ...art?.article}
      })})
      setCut(res?.data?.cut)
    })
  }, [])

  return (
    <Main className={"grid md:grid-cols-2 gap-6 content-start text-white"}>
      {(order) ? (
        <>
          <h2 className="text-4xl md:col-span-2 font-bold">Pedido N° {order?.orderNumber}</h2>
          <section className="grid grid-cols-2 gap-6">
            {order?.articles?.map(article => {
              return <ArticleCard article={article} stockNoControl/>
            })}
          </section>
        </>
      ) : (
        <Oval className="text-3xl"/>
      )}
    </Main>
  )
}

export default Order