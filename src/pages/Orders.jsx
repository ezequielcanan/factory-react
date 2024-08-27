import Main from "../containers/Main"
import Title from "../components/Title"
import { Link } from "react-router-dom"
import Button from "../components/Button"
import { FaCartPlus } from "react-icons/fa"

const Orders = () => {
  return (
    <Main className={"grid gap.6"}>
      <section className="grid items-center justify-center gap-8 md:items-start md:grid-cols-2 md:justify-between">
        <Title text={"Pedidos"} className={"text-center md:text-start"}/>
        <Link to={"/orders/new"} className="justify-self-end"><Button className={"text-xl font-bold px-4 flex gap-x-4 items-center"}>Nuevo Pedido <FaCartPlus /></Button></Link>
      </section>
    </Main>
  )
}

export default Orders