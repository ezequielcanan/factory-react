import { motion } from "framer-motion"
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa"
import { FaMinus, FaPlus } from "react-icons/fa6"
import customAxios from "../config/axios.config"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { getArticleImg } from "../utils/utils"

const ArticleCard = ({ article, articles = [], setArticles = () => { }, onClickArticle, stockNoControl, quantityNoControl, hoverEffect = true, customArticle = false, bookedQuantity = false }) => {
  const [articleCard, setArticleCard] = useState(article)
  const navigate = useNavigate()

  const onClickStockButton = async (change) => {
    const newStock = Number(articleCard.stock) + change
    const newArticle = await customAxios.put(`/articles/stock/${article?._id}?stock=${newStock}`)
    setArticleCard(newArticle?.data)
  }

  const changeQuantity = (qty) => {
    const newQuantity = articleCard?.quantity + qty
    const articleIndex = articles.findIndex(a => a?._id == articleCard?._id)
    articles.splice(articleIndex, 1)
    const newArticleCard = { ...articleCard, quantity: newQuantity }
    const newArticles = [...articles, newArticleCard]
    setArticles(newArticles.filter(a => a.quantity > 0))
    setArticleCard(newArticleCard)
  }

  return (
    <motion.div onClick={() => onClickArticle ? onClickArticle(articleCard, setArticleCard) : navigate(`/articles/${article?._id}`)} initial={{ opacity: 0 }} transition={{ duration: 0.5 }} animate={{ opacity: 1 }} className={`flex flex-col text-white ${hoverEffect && "hover:bg-primary cursor-pointer"} duration-300 rounded-lg bg-secondary justify-items-center overflow-hidden`}>
      <img src={getArticleImg(articleCard?._id, customArticle)} alt="No hay imagen" className="font-bold h-80 object-cover object-center" />
      <div className={`flex flex-col gap-y-4 w-full p-4 text-xl`}>
        <h3 className="text-2xl">{articleCard.description || articleCard.detail}</h3>
        {!customArticle &&
          <>
            <div className="flex gap-8 items-center">
              <p>Stock: {articleCard.stock}</p>
              {!stockNoControl ? <div className="flex gap-4">
                <FaPlusCircle onClick={(e) => (e.stopPropagation(), onClickStockButton(1))} />
                <FaMinusCircle onClick={(e) => (e.stopPropagation(), onClickStockButton(-1))} />
              </div> : (
                null
              )}
            </div>
            <p>Reservado en pedidos: {articleCard.booked || 0}</p>
          </>}
        {(bookedQuantity && !customArticle) && <p>Reservado en este pedido: {articleCard.bookedQuantity || 0}</p>}
        {articleCard?.quantity ? <div className="flex gap-2 sm:gap-8 flex-col sm:flex-row sm:items-center">
          <p>Cantidad: {articleCard?.quantity}</p>
          {!quantityNoControl && <div className="flex gap-4">
            <FaMinusCircle onClick={(e) => (e.stopPropagation(), changeQuantity(-1))} />
            <FaPlusCircle onClick={(e) => (e.stopPropagation(), changeQuantity(1))} />
          </div>}
        </div> : null}
      </div>
    </motion.div>
  )
}

export default ArticleCard