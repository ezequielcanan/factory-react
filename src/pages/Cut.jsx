import { useEffect, useState } from "react"
import Main from "../containers/Main"
import customAxios from "../config/axios.config"
import { useParams } from "react-router-dom"
import { Oval } from "react-loader-spinner"
import ArticleCard from "../components/ArticleCard"
import Title from "../components/Title"

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
        <section className="grid lg:grid-cols-2 gap-8">
          <Title text={"Orden de corte"} className={"lg:col-span-2"}/>
          <div className="grid lg:grid-cols-2 gap-4">
            <h3 className="lg:col-span-2 text-2xl text-white">Articulos de linea</h3>
            {cut?.articles?.filter(a => a.common)?.map(article => {
              let articleCard = {...article}
              articleCard.quantity = Number(articleCard.quantity) - Number(articleCard.booked)
              articleCard = {...articleCard, ...articleCard.article}
              return <ArticleCard article={articleCard} stockNoShow stockNoControl quantityNoControl forCut bookedQuantity hoverEffect={false} />
            })}
          </div>
          <div className="grid lg:grid-cols-2 gap-4">
            <h3 className="lg:col-span-2 text-2xl text-white">Articulos personalizados</h3>
            {cut?.articles?.filter(a => !a.common)?.map(article => {
              let articleCard = {...article}
              articleCard.quantity = Number(articleCard.quantity) - Number(articleCard.booked)
              articleCard = {...articleCard, ...articleCard.customArticle}
              return <ArticleCard article={articleCard} stockNoShow stockNoControl quantityNoControl forCut bookedQuantity hoverEffect={false} />
            })}
          </div>
        </section>
      ) : (
        <Oval/>
      )}
    </Main>
  )
}

export default Cut