import { FaPlus } from "react-icons/fa6"
import Button from "../components/Button"
import Main from "../containers/Main"
import { Link } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import customAxios from "../config/axios.config"
import ArticlesContainer from "../containers/ArticlesContainer"
import Title from "../components/Title"
import { FaFileExcel } from "react-icons/fa"
import { userIncludesRoles } from "../utils/utils"
import { UserContext } from "../context/UserContext"

const Articles = () => {
  const {userData} = useContext(UserContext)
  const [society, setSociety] = useState(!userIncludesRoles(userData, "cattown") ? {value: "Ambos negocios", all: true} : {value: "Cattown"})

  return (
    <Main className={"grid gap-6 items-start"}>
      <section className="grid items-center justify-center gap-8 md:items-start md:grid-cols-2 md:justify-between">
        <Title text={"Articulos"} className={"text-center md:text-start"}/>
        <div className="flex items-center gap-4 md:justify-end justify-center flex-wrap">
          <a href={`${import.meta.env.VITE_REACT_API_URL}/api/pdf/articles${!society?.all ? "?society="+society?.value : ""}`} download><Button className={"flex items-center gap-x-6 bg-green-700 hover:!bg-green-800"}><FaFileExcel /></Button></a>
          <Link to={"/articles/new"} className="justify-self-end"><Button className={"text-xl font-bold px-4 flex gap-x-4 items-center"}>Agregar articulo <FaPlus/></Button></Link>
        </div>
      </section>
      <ArticlesContainer containerClassName={"w-full"} societyState={society} setSocietyState={setSociety}/>
    </Main>
  )
}

export default Articles