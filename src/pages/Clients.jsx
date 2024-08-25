import Main from "../containers/Main"
import Button from "../components/Button"
import { Link } from "react-router-dom"
import { FaUserPlus } from "react-icons/fa"
import ClientsContainer from "../containers/ClientsContainer"

const Clients = () => {
  return (
    <Main className={"grid gap-6"}>
      <section className="flex justify-between h-max">
        <h2 className="font-bold text-5xl text-white">Clientes</h2>
        <Link to={"/clients/new"}><Button className={"text-xl font-bold px-4 flex gap-x-4 items-center"}>Agregar Cliente <FaUserPlus /></Button></Link>
      </section>
      <ClientsContainer/>
    </Main>
  )
}

export default Clients