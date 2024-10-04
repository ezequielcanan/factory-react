import { useNavigate, useParams } from "react-router-dom"
import Main from "../containers/Main"
import { useEffect, useState } from "react"
import customAxios from "../config/axios.config"
import Title from "../components/Title"
import Button from "../components/Button"
import ArticleCard from "../components/ArticleCard"
import moment from "moment"
import Label from "../components/Label"
import Input from "../components/Input"
import { Oval } from "react-loader-spinner"

const WorkshopOrder = () => {
  const [workshopOrder, setWorkshopOrder] = useState(null)
  const navigate = useNavigate()
  const { oid } = useParams()

  useEffect(() => {
    customAxios.get(`/workshop-order/${oid}`).then(res => {
      setWorkshopOrder(res?.data)
    })
  }, [])

  const changePrice = async (e) => {
    await customAxios.put(`/workshop-order/${oid}`, { price: e?.target?.value })
  }

  const receiveFromWorkShop = async () => {
    await customAxios.put(`/workshop-order/receive/${oid}`)
    workshopOrder?.cut?.order ? navigate(`/orders/${workshopOrder?.cut?.order?._id}`) : navigate(`/articles`)
  }

  return (
    <Main className={"grid grid-cols-1 items-center content-start lg:grid-cols-2 gap-y-16 gap-8"}>
      {workshopOrder ? (
        <>
          <Title text={`Taller: ${workshopOrder?.workshop?.name}`} />
          {!workshopOrder?.deliveryDate ? <Button className="font-bold p-4 px-6 lg:justify-self-end" onClick={receiveFromWorkShop}>Recibido</Button> : <p className="font-bold text-white text-2xl lg:justify-self-end">Recibido: {moment(workshopOrder?.deliveryDate).format("DD-MM-YYYY")}</p>}
          <div className="flex flex-col items-start text-white gap-y-4 lg:col-span-2">
            <p className="text-2xl">Corte N°: {workshopOrder?.cut?.order?.orderNumber}</p>
            <p className="text-2xl">Fecha de salida: {moment(workshopOrder?.date).format("DD-MM-YYYY")}</p>
            <p className="text-2xl">Direccion: {workshopOrder?.workshop?.address}</p>
            <p className="text-2xl">Telefono: {workshopOrder?.workshop?.phone}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4 self-start content-start text-white">
            <h3 className="md:col-span-2 text-2xl text-white">Articulos de linea</h3>
            {(workshopOrder?.deliveryDate ? (workshopOrder?.cut?.items?.length ? workshopOrder?.cut?.items : workshopOrder?.cut?.manualItems) : (workshopOrder?.cut?.order?.articles || workshopOrder?.cut?.manualItems))?.filter(a => workshopOrder?.cut?.order ? (a.common && a.hasToBeCut && (a.quantity > a.booked)) : true)?.length ? (workshopOrder?.deliveryDate ? (workshopOrder?.cut?.items?.length ? workshopOrder?.cut?.items : workshopOrder?.cut?.manualItems) : (workshopOrder?.cut?.order?.articles || workshopOrder?.cut?.manualItems))?.filter(a => workshopOrder?.cut?.order ? (a.common && a.hasToBeCut && (a.quantity > a.booked)) : true)?.map(article => {
              let articleCard = { ...article }
              articleCard.quantity = workshopOrder?.cut?.order ? (Number(articleCard.quantity) - Number(articleCard.booked)) : Number(articleCard?.quantity)
              articleCard = { ...articleCard, ...articleCard.article }
              return <ArticleCard article={articleCard} stockNoShow stockNoControl quantityNoControl quantityLocalNoControl forCut bookedQuantity hoverEffect={false} />
            }) : <p>No hay articulos de linea</p>}
          </div>
          <div className="grid md:grid-cols-2 gap-4 self-start content-start text-white">
            <h3 className="md:col-span-2 text-2xl text-white">Articulos personalizados</h3>
            {(workshopOrder?.deliveryDate ? workshopOrder?.cut?.items : workshopOrder?.cut?.order?.articles)?.filter(a => !a.common && a.hasToBeCut && (a.quantity > a.booked))?.length ? (workshopOrder?.deliveryDate ? workshopOrder?.cut?.items : workshopOrder?.cut?.order?.articles)?.filter(a => !a.common && a.hasToBeCut && (a.quantity > a.booked))?.map(article => {
              let articleCard = { ...article }
              articleCard.quantity = Number(articleCard.quantity) - Number(articleCard.booked)
              articleCard = { ...articleCard, ...articleCard.customArticle }
              return <ArticleCard article={articleCard} stockNoShow stockNoControl quantityNoControl quantityLocalNoControl forCut bookedQuantity customArticle hoverEffect={false} />
            }) : <p>No hay articulos personalizados</p>}
          </div>
        </>
      ) : (
        <Oval />
      )}
    </Main>
  )
}

export default WorkshopOrder