import { Link } from "react-router-dom"
import Title from "../components/Title"
import Main from "../containers/Main"
import { FaUserPlus } from "react-icons/fa6"
import Button from "../components/Button"
import WorkshopsContainer from "../containers/WorkshopsContainer"

const Workshops = () => {
  return (
    <Main className={"grid gap-6 gap-y-16 content-start"}>
      <section className="grid items-center justify-center gap-8 md:items-start md:grid-cols-2 md:justify-between">
        <Title text={"Talleres"} className={"text-center md:text-start"}/>
        <Link to={"/workshops/new"} className="justify-self-end"><Button className={"text-xl font-bold px-4 flex gap-x-4 items-center"}>Agregar Taller <FaUserPlus /></Button></Link>
      </section>
      <WorkshopsContainer/>
    </Main>
  )
}

export default Workshops