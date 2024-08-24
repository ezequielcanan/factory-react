import { FaPlus } from "react-icons/fa6"
import Button from "../components/Button"
import Main from "../containers/Main"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import customAxios from "../config/axios.config"
import ArticlesContainer from "../containers/ArticlesContainer"

const Articles = () => {
  return (
    <Main className={"grid gap-6 items-start"}>
      <section className="flex justify-between h-max">
        <h2 className="font-bold text-5xl text-white">Articulos</h2>
        <Link to={"/articles/new"}><Button className={"text-xl font-bold px-4 flex gap-x-4 items-center"}>Nuevo articulo <FaPlus/></Button></Link>
      </section>
      <ArticlesContainer containerClassName={"w-full"}/>
    </Main>
  )
}

export default Articles