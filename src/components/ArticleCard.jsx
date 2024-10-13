import { motion } from "framer-motion"
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa"
import { FaMinus, FaPlus } from "react-icons/fa6"
import customAxios from "../config/axios.config"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { getArticleImg } from "../utils/utils"
import Input from "./Input"

const ArticleCard = ({ article, articles = [], setArticles = () => { }, className = "", receivingNoControl = true, quantityLocalNoControl = false, onClickArticle, stockNoShow = false, forCut = false, stockNoControl, quantityNoControl, hoverEffect = true, customArticle = false, bookedQuantity = false }) => {
  const [articleCard, setArticleCard] = useState(article)
  const navigate = useNavigate()

  const onClickStockButton = async (change) => {
    const newStock = Number(articleCard.stock) + change
    const newArticle = await customAxios.put(`/articles/stock/${article?._id}?stock=${newStock}`)
    setArticleCard(newArticle?.data)
  }

  const changeQuantity = (qty, direct=false, property = "quantity") => {
    const newQuantity = !direct ? (articleCard?.[property] || 0) + qty : (qty || 0)
    const articleIndex = articles.findIndex(a => a?._id == articleCard?._id || a?.article?._id == articleCard?.article?._id)
    articles.splice(articleIndex, 1)
    const newArticleCard = { ...articleCard, [property]: newQuantity }
    const newArticles = [...articles, newArticleCard]
    setArticles(newArticles.filter(a => property == "quantity" ? a[property] > 0 : a))
    setArticleCard(newArticleCard)
  }
  return (
    <motion.div onClick={() => onClickArticle ? onClickArticle(articleCard, setArticleCard) : (!forCut && navigate(`/articles/${article?._id}`))} initial={{ opacity: 0 }} transition={{ duration: 0.5 }} animate={{ opacity: 1 }} className={`flex flex-col text-white min-h-[400px] ${hoverEffect && "hover:bg-primary cursor-pointer"} duration-300 rounded-lg bg-secondary justify-items-center justify-between overflow-hidden ${className}`}>
      <img src={getArticleImg(articleCard?._id, customArticle)} alt="No hay imagen" className="font-bold max-h-[300px] !h-full object-cover object-center" />
      <div className={`flex flex-col gap-y-4 w-full p-4 text-sm`}>
        <h3 className="text-xl">{articleCard.description || articleCard.detail} - {articleCard?.size}</h3>
        {!customArticle &&
          <>
            <div className="flex gap-8 items-center">
              {!stockNoShow && <p>Stock: {articleCard.stock}</p>}
              {!stockNoControl ? <div className="flex gap-4">
                <FaPlusCircle onClick={(e) => (e.stopPropagation(), onClickStockButton(1))} />
                <FaMinusCircle onClick={(e) => (e.stopPropagation(), onClickStockButton(-1))} />
              </div> : (
                null
              )}
            </div>
            {!bookedQuantity && 
              <>
                <p>Reservado en pedidos: {articleCard.booked || 0}</p>
                <p>Disponibles: {(articleCard.stock - articleCard?.booked) || 0}</p>
              </>}
          </>}
        {(bookedQuantity && !customArticle && !forCut) && <p>Reservado en este pedido: {articleCard.bookedQuantity || 0}</p>}
        {articleCard?.quantity ? <div className="flex gap-2 sm:gap-6 flex-col sm:flex-row sm:items-center">
          <div className="flex gap-2 items-center">
            <p>Cantidad: {quantityLocalNoControl && articleCard?.quantity}</p>
            {!quantityLocalNoControl && <Input onClick={e => e.stopPropagation()} onChange={e => (e.stopPropagation(), changeQuantity(parseInt(e?.target?.value), true))} step="1" type="number" value={articleCard?.quantity} className={"text-sm w-[50px] !px-1 !py-1 "} containerClassName={"rounded-none"}/>}
          </div>
          {!quantityNoControl && <div className="flex gap-4">
            <FaMinusCircle onClick={(e) => (e.stopPropagation(), changeQuantity(-1))} />
            <FaPlusCircle onClick={(e) => (e.stopPropagation(), changeQuantity(1))} />
          </div>}
        </div> : null}
        {(articleCard?.received || !receivingNoControl) ? <div className="flex gap-2 sm:gap-6 flex-col sm:flex-row sm:items-center">
          <div className="flex gap-2 items-center">
            <p>Recibido: {receivingNoControl ? articleCard?.received : null}</p>
            {!receivingNoControl && <Input onClick={e => e.stopPropagation()} onChange={e => (e.stopPropagation(), changeQuantity(parseInt(e?.target?.value), true, "receiving"))} step="1" type="number" value={articleCard?.receiving || 0} className={"text-sm w-[50px] !px-1 !py-1 "} containerClassName={"rounded-none"}/>}
          </div>
          {!receivingNoControl && <div className="flex gap-4">
            <FaMinusCircle onClick={(e) => (e.stopPropagation(), changeQuantity(-1, false, "receiving"))} />
            <FaPlusCircle onClick={(e) => (e.stopPropagation(), changeQuantity(1, false, "receiving"))} />
          </div>}
        </div> : null}
        {customArticle?.bordado ? (
          <p>Bordado: {customArticle?.bordado}</p>
        ) : null}
        {customArticle?.ubicacion ? (
          <p>Ubicacion: {customArticle?.ubicacion}</p>
        ) : null}
        {customArticle?.details ? (
          <p>Detalle tecnico: {customArticle?.details}</p>
        ) : null}
      </div>
    </motion.div>
  )
}

export default ArticleCard