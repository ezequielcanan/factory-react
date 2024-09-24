import moment from "moment"
import { Link } from "react-router-dom"

const OrderCard = ({ order, articles = order?.articles, text = "N°", green = false, name = true, link = `/orders/${order?._id}`, forCut = false }) => {
  let articlesString = ""
  const articlesForString = articles?.filter(a => forCut ? (a.hasToBeCut && a.quantity > a.booked) : a)
  articlesForString?.forEach((article, i) => {
    articlesString += `${(article?.article?.description || article?.customArticle?.detail)?.toUpperCase()}${i != (articlesForString?.length - 1) ? " ///// " : ""}`
  })
  const needsStock = articles.some(art => art?.booked != art?.quantity)
  let color = ""
  if (order?.finished || green) {
    color = "bg-green-600"
  } else if (!needsStock) {
    color = "bg-amber-300"
  } else if (order?.workshop || order?.workshopOrder) {
    color = "bg-orange-600"
  } else {
    color = "bg-red-600"
  }

  return (
    <Link to={link}>
      <div className={`flex flex-col gap-2 ${color} ${color != "bg-amber-300" ? "text-white" : "text-black"} p-6 rounded`}>
        <h3 className="text-lg font-bold underline underline-offset-2">{text} {order?.orderNumber}{name && `: ${order?.client?.name}`}</h3>
        <p className="text-md">{articlesString}</p>
        <p className="text-md">Fecha de pedido: {moment.utc(order?.date).format("DD-MM-YYYY")}</p>
        <p className="text-md">Fecha de entrega: {order?.deliveryDate ? moment.utc(order?.deliveryDate).format("DD-MM-YYYY") : ""}</p>
        {(order?.remainingDays || order.remainingDays == 0) && <p className="text-md">Dias restantes: {order.remainingDays}</p>}
      </div>
    </Link>
  )
}

export default OrderCard