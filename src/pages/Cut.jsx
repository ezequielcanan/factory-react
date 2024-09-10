import { useEffect, useState } from "react"
import Main from "../containers/Main"
import customAxios from "../config/axios.config"
import { Link, useParams } from "react-router-dom"
import { Oval } from "react-loader-spinner"
import ArticleCard from "../components/ArticleCard"
import Title from "../components/Title"
import Button from "../components/Button"
import { BiTransferAlt } from "react-icons/bi"

const Cut = () => {
  const [cut, setCut] = useState(null)
  const {cid} = useParams()

  useEffect(() => {
    customAxios.get(`/cuts/${cid}`).then(res => {
      setCut({...res?.data, articles: res?.data?.order?.articles?.filter(a => a.hasToBeCut && a.quantity > a.booked)})
    })
  }, [])
  
  return (
    <Main>
      {cut ? (
        <section className="grid xl:grid-cols-2 gap-y-16 gap-8">
          <Title text={"Orden de corte"} className={""}/>
          <Link to={`/cuts/${cid}/workshop`} className="justify-self-end"><Button className={"flex items-center gap-2"}>Pasar a un taller <BiTransferAlt/></Button></Link>
          <div className="grid md:grid-cols-2 gap-4 content-start text-white">
            <h3 className="md:col-span-2 text-2xl text-white">Articulos de linea</h3>
            {cut?.articles?.filter(a => a.common)?.length ? cut?.articles?.filter(a => a.common)?.map(article => {
              let articleCard = {...article}
              articleCard.quantity = Number(articleCard.quantity) - Number(articleCard.booked)
              articleCard = {...articleCard, ...articleCard.article}
              return <ArticleCard article={articleCard} stockNoShow stockNoControl quantityNoControl forCut bookedQuantity hoverEffect={false} />
            }) : <p>No hay articulos de linea</p>}
          </div>
          <div className="grid md:grid-cols-2 gap-4 content-start text-white">
            <h3 className="md:col-span-2 text-2xl text-white">Articulos personalizados</h3>
            {cut?.articles?.filter(a => !a.common)?.length ? cut?.articles?.filter(a => !a.common)?.map(article => {
              let articleCard = {...article}
              articleCard.quantity = Number(articleCard.quantity) - Number(articleCard.booked)
              articleCard = {...articleCard, ...articleCard.customArticle}
              return <ArticleCard article={articleCard} stockNoShow stockNoControl quantityNoControl forCut bookedQuantity customArticle hoverEffect={false} />
            }) : <p>No hay articulos personalizados</p>}
          </div>
        </section>
      ) : (
        <Oval/>
      )}
    </Main>
  )
}

export default Cut