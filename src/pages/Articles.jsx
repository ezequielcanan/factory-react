import { FaPlus } from "react-icons/fa6"
import Button from "../components/Button"
import Main from "../containers/Main"
import { Link } from "react-router-dom"

const Articles = () => {
  return (
    <Main className={"grid grid-cols-4 items-start"}>
      <section className="col-span-4 flex justify-between">
        <h2 className="font-bold text-5xl text-white">Articulos</h2>
        <Link to={"/articles/new"}><Button className={"text-xl font-bold px-4 flex gap-x-4 items-center"}>Nuevo articulo <FaPlus/></Button></Link>
      </section>
    </Main>
  )
}

export default Articles