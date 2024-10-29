import { useEffect, useState } from "react"
import Main from "../containers/Main"
import { motion } from "framer-motion"
import customAxios from "../config/axios.config"
import { Oval } from "react-loader-spinner"
import moment from "moment"
import Resume from "../components/Resume"
import OrderCard from "../components/OrderCard"

const Home = () => {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    customAxios.get(`/orders?page=${1}&one=1&two=2&three=3`).then(res => {
      const ods = res.data?.map(order => {
        let articlesString = ""
        const articlesForString = order?.articles?.filter(a => a)
        articlesForString?.forEach((article, i) => {
          articlesString += `${(article?.article?.description || article?.customArticle?.detail)?.toUpperCase()}${i != (articlesForString?.length - 1) ? " ///// " : ""}`
        })
        return { ...order, remainingDays: moment(order?.deliveryDate).diff(moment(), "days"), articlesString }
      })

      setOrders(ods.slice(0,4))
    })
  }, [])

  return (
    <Main className={"grid grid-cols-1 content-start md:grid-cols-2 lg:grid-cols-3 gap-8"}>
      <Resume />
      <Resume month title="Ultimo mes" />
      <Resume controls />
      <div className="lg:col-span-3 md:col-span-2 col-span-1 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-auto content-start grid-flow-row">
        {orders?.map((order, i) => {
          return <OrderCard key={order?._id} order={order}/>
        })}
      </div>
    </Main>
  )
}

export default Home