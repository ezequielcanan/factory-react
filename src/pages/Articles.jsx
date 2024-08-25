import { FaPlus } from "react-icons/fa6"
import Button from "../components/Button"
import Main from "../containers/Main"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import customAxios from "../config/axios.config"
import ArticlesContainer from "../containers/ArticlesContainer"
import Title from "../components/Title"

const Articles = () => {
  return (
    <Main className={"grid gap-6 items-start"}>
      <section className="grid items-center justify-center gap-8 md:items-start md:grid-cols-2 md:justify-between">
        <Title text={"Articulos"} className={"text-center md:text-start"}/>
        <Link to={"/articles/new"} className="justify-self-end"><Button className={"text-xl font-bold px-4 flex gap-x-4 items-center"}>Nuevo articulo <FaPlus/></Button></Link>
      </section>
      <ArticlesContainer containerClassName={"w-full"}/>
    </Main>
  )
}

export default Articles