import { useNavigate } from "react-router-dom"
import Button from "../components/Button"
import ArticleRow from "../components/ArticleRow"

const ConfirmCut = ({onConfirmCutOrder, order, cancelFunc = () => navigate("/orders")}) => {
  const navigate = useNavigate()
  return <>
    <div className="grid md:grid-cols-2 gap-y-8 justify-between items-center">
      <h2 className="text-4xl font-bold text-white text-center md:text-start">Confirmar corte de articulos</h2>
      <div className="flex flex-col sm:flex-row gap-6 justify-self-center md:justify-self-end">
        <Button onClick={onConfirmCutOrder}>Confirmar corte</Button>
        <Button className={"bg-red-600 hover:bg-red-800"} onClick={cancelFunc}>Cancelar corte</Button>
      </div>
    </div>
    <div className="flex flex-col gap-4 text-white">
      {order?.length ? order.map(article => {
        const cutQuantity = article?.cutQuantity
        article = article.article || article?.customArticle
        article.quantity = cutQuantity
        return (
          <ArticleRow article={article} key={"cutrow" + article?._id} />
        )
      }) : null}
    </div>

  </>
}

export default ConfirmCut