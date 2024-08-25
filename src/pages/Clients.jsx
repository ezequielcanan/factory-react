import Main from "../containers/Main"
import Button from "../components/Button"
import { Link } from "react-router-dom"
import { FaUserPlus } from "react-icons/fa"
import ClientsContainer from "../containers/ClientsContainer"
import Title from "../components/Title"

const Clients = () => {
  return (
    <Main className={"grid gap-6"}>
      <section className="grid items-center justify-center gap-8 md:items-start md:grid-cols-2 md:justify-between">
        <Title text={"Clientes"} className={"text-center md:text-start"}/>
        <Link to={"/clients/new"} className="justify-self-end"><Button className={"text-xl font-bold px-4 flex gap-x-4 items-center"}>Agregar Cliente <FaUserPlus /></Button></Link>
      </section>
      <ClientsContainer/>
    </Main>
  )
}

export default Clients