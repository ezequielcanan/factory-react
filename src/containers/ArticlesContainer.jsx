import ArticleCard from "../components/ArticleCard"
import { Oval } from "react-loader-spinner"
import customAxios from "../config/axios.config"
import { useState, useEffect } from "react"
import { FaFilter } from "react-icons/fa6"
import { colors, sizes, categories, societies } from "../utils/utils"
import SelectInput from "../components/SelectInput"
import Input from "../components/Input"
import ItemsContainer from "./ItemsContainer"

const ArticlesContainer = ({ containerClassName, quantities = [], setQuantities = () => {}, onClickArticle=null, stockNoControl=false }) => {
  const [articles, setArticles] = useState(null)
  const [filteredArticles, setFilteredArticles] = useState(null)
  const [color, setColor] = useState({value: "Todos los colores", all: true})
  const [category, setCategory] = useState({value: "Todas las categorias", all: true})
  const [size, setSize] = useState({value: "Todos los tamaños", all: true})
  const [society, setSociety] = useState({value: "Ambos negocios", all: true})
  const [search, setSearch] = useState("")

  useEffect(() => {
    customAxios.get("/articles").then(res => {
      const updatedArticles = quantities.forEach(a => {
        const articleIndex = res.data?.findIndex(article => article?._id == a?._id)
        if (articleIndex != -1) {
          res.data[articleIndex].quantity = a?.quantity
        }
      })
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

      if (search.length) {
        newFilteredArticles = newFilteredArticles.filter(a => a?.description?.toLowerCase()?.includes(search?.toLowerCase()))
      }
      setFilteredArticles(newFilteredArticles)
    }
  }, [society, color, size, category, search])

  return (
    <ItemsContainer className={`${containerClassName}`}>
      <div className="md:col-span-2 lg:col-span-3 xl:col-span-5 flex flex-col xl:flex-row items-center gap-8 justify-between">
        <FaFilter className="text-white text-3xl" />
        <div className="grid md:grid-cols-3 xl:grid-cols-5 items-center gap-8 text-xl w-full">
          <Input placeholder="Buscar..." className={"w-full"} onChange={(e) => setSearch(e?.target?.value)}/>
          <SelectInput selectedOption={society} setSelectedOption={setSociety} options={[{value: "Ambos negocios", all: true}, ...societies]} className={"!py-"} />
          <SelectInput selectedOption={category} setSelectedOption={setCategory} options={[{value: "Todas las categorias", all: true}, ...categories]} className={"!py-2"} />
          <SelectInput selectedOption={color} setSelectedOption={setColor} options={[{value: "Todos los colores", all: true}, ...colors]} className={"!py-2"} />
          <SelectInput selectedOption={size} setSelectedOption={setSize} options={[{value: "Todos los tamaños", all: true}, ...sizes]} className={"!py-2"} />
        </div>
      </div>
      {(articles && filteredArticles) ? filteredArticles?.length ? filteredArticles.map((article) => {
        return <ArticleCard article={article} articles={quantities} setArticles={setQuantities} key={article?._id} onClickArticle={onClickArticle} stockNoControl={stockNoControl}/>
      }) : (
        <p className="text-white text-4xl col-span-4 text-center my-16">No hay articulos que coincidan con los filtros</p>
      ) : (
        <Oval />
      )}
    </ItemsContainer>
  )
}

export default ArticlesContainer