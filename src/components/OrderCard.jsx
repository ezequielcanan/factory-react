import moment from "moment"
import { BiCross } from "react-icons/bi"
import { MdClose } from "react-icons/md"
import { Link } from "react-router-dom"

const OrderCard = ({ order, articles = order?.articles, cross = false, crossAction = () => { }, text = "N°", pink = false, green = false, orange = false, red=false, name = true, link = `/orders/${order?._id}`, className = "", forCut = false }) => {
  let articlesString = ""
  const articlesForString = articles?.filter(a => forCut ? (order ? a.hasToBeCut && a.quantity > a.booked : true) : a)
  articlesForString?.forEach((article, i) => {
    articlesString += `${(article?.article?.description || article?.customArticle?.detail)?.toUpperCase()}${i != (articlesForString?.length - 1) ? " ///// " : ""}`
  })
  const needsStock = articles?.some(art => art?.booked != art?.quantity)
  let color = ""
  if (order?.suborders?.length) {
    color = "bg-purple-700"
  } else if (order?.finished || green) {
    color = "bg-green-600"
  } else if (order?.inPricing) {
    color = "bg-sky-600"
  } else if (!needsStock) {
    color = "bg-amber-300"
  } else if (orange || order?.workshop || order?.workshopOrder || order?.workshopOrders) {
    color = "bg-orange-600"
  } else {
    color = "bg-red-600"
  }

  if (red) color = "bg-red-600"
  if (pink) color = "bg-pink-500"

  return (
    <div className={"relative " + className}>
      <Link to={link}>
        <div className={`flex flex-col gap-2 ${color} ${color != "bg-amber-300" ? "text-white" : "text-black"} p-6 rounded`}>
          <div className="flex gap-x-2 items-center justify-between">
            <h3 className="text-lg font-bold underline underline-offset-2">{order ? `${text} ${order?.orderNumber}${name ? `: ${order?.client?.name}` : ""}` : text}</h3>
          </div>
          <p className="text-md">{articlesString}</p>
          {order && <>
            <p className="text-md">Fecha de pedido: {moment.utc(order?.date).format("DD-MM-YYYY")}</p>
            <p className="text-md">Fecha de entrega: {order?.deliveryDate ? moment.utc(order?.deliveryDate).format("DD-MM-YYYY") : ""}</p>
            {(order?.remainingDays || order?.remainingDays == 0) && <p className="text-md">Dias restantes: {order?.remainingDays}</p>}
          </>}
        </div>
      </Link>
      {cross ? <MdClose className={`!text-3xl absolute top-5 right-5 cursor-pointer ${color != "bg-amber-300" ? "text-white" : "text-black"}`} onClick={(e) => (e.stopPropagation(), crossAction(order))} /> : null}
    </div>
  )
}

export default OrderCard