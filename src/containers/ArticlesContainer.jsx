import Article from "../components/Article"
import { Oval } from "react-loader-spinner"
import customAxios from "../config/axios.config"
import { useState, useEffect } from "react"
import { FaFilter } from "react-icons/fa6"
import { colors, sizes, categories, societies } from "../utils/utils"
import SelectInput from "../components/SelectInput"
import Input from "../components/Input"

const ArticlesContainer = ({ containerClassName }) => {
  const [articles, setArticles] = useState(null)
  const [filteredArticles, setFilteredArticles] = useState(null)
  const [color, setColor] = useState({value: "Todos los colores", all: true})
  const [category, setCategory] = useState({value: "Todas las categorias", all: true})
  const [size, setSize] = useState({value: "Todos los tamaños", all: true})
  const [society, setSociety] = useState({value: "Ambos negocios", all: true})
  
  useEffect(() => {
    customAxios.get("/articles").then(res => {
      setArticles(res.data)
      setFilteredArticles(res.data)
    })
  }, [])

  useEffect(() => {
    if (articles) {
      let newFilteredArticles = [...articles]
      if (!color.all) {
        newFilteredArticles = newFilteredArticles.filter(a => a.color == color.value)
      }
      if (!size.all) {
        newFilteredArticles = newFilteredArticles.filter(a => a.size == size.value)
      }
      if (!category.all) {
        newFilteredArticles = newFilteredArticles.filter(a => a.category == category.value)
      }
      if (!society.all) {
        newFilteredArticles = newFilteredArticles.filter(a => a.society == society.value)
      } 
      setFilteredArticles(newFilteredArticles)
    }
  }, [society, color, size, category])

  return (
    <section className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 bg-third rounded-xl p-8 ${containerClassName}`}>
      <div className="md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col xl:flex-row items-center gap-8 justify-between">
        <FaFilter className="text-white text-3xl" />
        <div className="grid md:grid-cols-3 xl:grid-cols-5 items-center gap-8 text-xl w-full">
          <Input placeholder="Buscar..." className={"w-full"} />
          <SelectInput selectedOption={society} setSelectedOption={setSociety} options={[{value: "Ambos negocios", all: true}, ...societies]} className={"!py-"} />
          <SelectInput selectedOption={category} setSelectedOption={setCategory} options={[{value: "Todas las categorias", all: true}, ...categories]} className={"!py-2"} />
          <SelectInput selectedOption={color} setSelectedOption={setColor} options={[{value: "Todos los colores", all: true}, ...colors]} className={"!py-2"} />
          <SelectInput selectedOption={size} setSelectedOption={setSize} options={[{value: "Todos los tamaños", all: true}, ...sizes]} className={"!py-2"} />
        </div>
      </div>
      {(articles && filteredArticles) ? filteredArticles?.length ? filteredArticles.map((article) => {
        return <Article article={article} key={article?._id}/>
      }) : (
        <p className="text-white text-4xl col-span-4 text-center my-16">No hay articulos que coincidan con los filtros</p>
      ) : (
        <Oval />
      )}
    </section>
  )
}

export default ArticlesContainer