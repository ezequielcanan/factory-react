import Main from "../containers/Main"
import Button from "../components/Button"
import { Link } from "react-router-dom"
import { FaUserPlus } from "react-icons/fa"
import ClientsContainer from "../containers/ClientsContainer"
import Title from "../components/Title"

const Clients = ({suppliers=false}) => {
  return (
    <Main className={"grid gap-6 gap-y-16 content-start"}>
      <section className="grid items-center justify-center gap-8 md:items-start md:grid-cols-2 md:justify-between">
        <Title text={!suppliers ? "Clientes" : "Proveedores"} className={"text-center md:text-start"}/>
        <Link to={`/${!suppliers ? "clients" : "suppliers"}/new`} className="justify-self-end"><Button className={"text-xl font-bold px-4 flex gap-x-4 items-center"}>Agregar {!suppliers ? "Cliente" : "Proveedor"} <FaUserPlus /></Button></Link>
      </section>
      <ClientsContainer suppliers={suppliers}/>
    </Main>
  )
}

export default Clients