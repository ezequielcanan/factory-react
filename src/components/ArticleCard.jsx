import { motion } from "framer-motion"
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa"
import { FaMinus, FaPlus } from "react-icons/fa6"
import customAxios from "../config/axios.config"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const ArticleCard = ({article, onClickArticle, stockNoControl}) => {
  const [articleCard, setArticleCard] = useState(article)
  const navigate = useNavigate()

  const onClickStockButton = async (change) => {
    const newStock = Number(articleCard.stock) + change
    const newArticle = await customAxios.put(`/articles/stock/${article?._id}?stock=${newStock}`)
    setArticleCard(newArticle?.data)
  }

  const changeQuantity = (qty) => setArticleCard({...articleCard, quantity: articleCard?.quantity + qty})

  return (
    <motion.div onClick={() => onClickArticle ? onClickArticle(articleCard, setArticleCard) : navigate(`/articles/${article?._id}`)} initial={{opacity: 0}} transition={{duration: 0.5}} animate={{opacity: 1}} className="flex flex-col text-white cursor-pointer hover:bg-primary duration-300 rounded-lg bg-secondary justify-items-center overflow-hidden">
      <img src={`${import.meta.env.VITE_REACT_API_URL}/files/articles/${articleCard?._id}/thumbnail.${"png" || "jpg" || "jpeg" || "gif"}`} alt="No hay imagen" className="font-bold h-80 object-cover object-center"/>
      <div className={`flex flex-col gap-y-4 w-full p-4 text-xl`}>
        <h3 className="text-2xl">{articleCard.description}</h3>
        <div className="flex gap-8 items-center">
          <p>Stock: {articleCard.stock}</p>
          {!stockNoControl ? <div className="flex gap-4">
            <FaPlusCircle onClick={(e) => (e.stopPropagation(), onClickStockButton(1))}/>
            <FaMinusCircle onClick={(e) => (e.stopPropagation(), onClickStockButton(-1))}/>
          </div> : (
            null
          )}
        </div>
        {articleCard?.quantity ? <div className="flex gap-2 sm:gap-8 flex-col sm:flex-row sm:items-center">
          <p>Cantidad: {articleCard?.quantity}</p>
          <div className="flex gap-4">
            <FaMinusCircle onClick={(e) => (e.stopPropagation(), changeQuantity(-1))}/>
            <FaPlusCircle onClick={(e) => (e.stopPropagation(), changeQuantity(1))}/>
          </div>
        </div> : null}
      </div>
    </motion.div>
  )
}

export default ArticleCard