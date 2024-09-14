import moment from "moment"
import { Link } from "react-router-dom"

const OrderCard = ({ order, articles = order?.articles, text = "N°", name = true, link = `/orders/${order?._id}`, forCut = false }) => {
  let articlesString = ""
  const articlesForString = articles?.filter(a => forCut ? (a.hasToBeCut && a.quantity > a.booked) : a)
  articlesForString?.forEach((article, i) => {
    articlesString += `${(article?.article?.description || article?.customArticle?.detail)?.toUpperCase()}${i != (articlesForString?.length - 1) ? " - " : ""}`
  })
  return (
    <Link to={link}>
      <div className="flex flex-col gap-8 bg-secondary text-white p-6 rounded">
        <h3 className="text-2xl font-bold">{text} {order?.orderNumber}{name && `: ${order?.client?.name}`}</h3>
        <p className="text-xl">{articlesString}</p>
        <p className="text-xl">Fecha de pedido: {moment.utc(order?.date).format("DD-MM-YYYY")}</p>
        <p className="text-xl">Fecha de entrega: {order?.deliveryDate ? moment.utc(order?.deliveryDate).format("DD-MM-YYYY") : ""}</p>
        {order?.remainingDays > 0 && <p className="text-xl">Dias restantes: {order.remainingDays}</p>}
      </div>
    </Link>
  )
}

export default OrderCard