import { useContext, useEffect, useState } from "react"
import Main from "../containers/Main"
import { motion } from "framer-motion"
import customAxios from "../config/axios.config"
import { Oval } from "react-loader-spinner"
import moment from "moment"
import Resume from "../components/Resume"
import OrderCard from "../components/OrderCard"
import Title from "../components/Title"
import { UserContext } from "../context/UserContext"
import { userIncludesRoles } from "../utils/utils"
import SelectInput from "../components/SelectInput"

const Home = () => {
  const [orders, setOrders] = useState([])
  const {userData} = useContext(UserContext)
  const societies = userIncludesRoles(userData, "cattown") ? [{ value: "Cattown" }] : [{ value: "Arcan" }, { value: "Cattown" }]
  const [society, setSociety] = useState(societies[0])

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
      <section className="lg:col-span-3 md:col-span-2 col-span-1 grid md:grid-cols-2 gap-8 justify-items-center items-center md:justify-items-start">
        <Title text={"Resumen"}/>
        <SelectInput selectedOption={society} setSelectedOption={setSociety} options={societies} className={"!p-8"} containerClassName={"!w-[200px] md:justify-self-end"}/>
      </section>
      <h2 className="lg:col-span-3 md:col-span-2 col-span-1 text-white text-3xl font-bold">Ventas</h2>
      <Resume society={society}/>
      <Resume month title="Ultimo mes" society={society}/>
      <Resume controls society={society}/>
      <h2 className="lg:col-span-3 md:col-span-2 col-span-1 text-white text-3xl font-bold mt-16">Compras</h2>
      <Resume buys/>
      <Resume month title="Ultimo mes" buys/>
      <Resume controls buys/>
      {/*<div className="lg:col-span-3 md:col-span-2 col-span-1 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-auto content-start grid-flow-row">
        {orders?.map((order, i) => {
          return <OrderCard key={order?._id} order={order}/>
        })}
      </div>*/}
    </Main>
  )
}

export default Home