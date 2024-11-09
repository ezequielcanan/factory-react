import ArticleCard from "../components/ArticleCard"
import { Oval } from "react-loader-spinner"
import customAxios from "../config/axios.config"
import { useState, useEffect, useContext } from "react"
import { FaFilter } from "react-icons/fa6"
import { colors, sizes, categories, societies, userIncludesRoles } from "../utils/utils"
import SelectInput from "../components/SelectInput"
import Input from "../components/Input"
import ItemsContainer from "./ItemsContainer"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import Button from "../components/Button"
import { UserContext } from "../context/UserContext"
import { useForm } from "react-hook-form"

const ArticlesContainer = ({ containerClassName, societyState, setSocietyState, materials = false, filterClassName = "", filterCClassName = "", pageClassName = "", quantities = [], setQuantities = () => { }, onClickArticle = null, stockNoControl = false }) => {
  const { userData } = useContext(UserContext)
  const [articles, setArticles] = useState(null)
  const [filteredArticles, setFilteredArticles] = useState(null)
  const [color, setColor] = useState({ value: "Todos los colores", all: true })
  const [category, setCategory] = useState({ value: "Todas las categorias", all: true })
  const [size, setSize] = useState({ value: "Todos los tamaños", all: true })
  const [society, setSociety] = (societyState && setSocietyState) ? [societyState, setSocietyState] : useState(!userIncludesRoles(userData, "cattown") ? { value: "Ambos negocios", all: true } : { value: "Cattown" })
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [reload, setReload] = useState(false)
  const [recentSearches, setRecentSearches] = useState((JSON.parse(localStorage.getItem("recentSearches")) || []).slice(0, 3))
  const { register, handleSubmit } = useForm()


  useEffect(() => {
    customAxios.get(`/articles?page=${page}${!color?.all ? `&color=${color?.value}` : ""}${!size?.all ? `&size=${size?.value}` : ""}${!category?.all ? `&category=${category?.value}` : ""}${!society?.all ? `&society=${society?.value}` : ""}${search?.length ? `&search=${search?.toLowerCase()}` : ""}`).then(res => {
      const updatedArticles = quantities.forEach(a => {
        const articleIndex = res.data?.findIndex(article => article?._id == a?._id)
        if (articleIndex != -1) {
          res.data[articleIndex].quantity = a?.quantity
        }
      })
      setArticles(res.data)
      setFilteredArticles(res.data)
    })
  }, [category, society, color, size, reload, page])

  const onSubmit = handleSubmit(async data => {
    const updatedSearches = [search, ...recentSearches.filter(s => s !== search)].slice(0, 3)
    setRecentSearches(updatedSearches)
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches))
    setReload(!reload)
  })

  const finalSocieties = !userIncludesRoles(userData, "cattown") ? [{ value: "Ambos negocios", all: true }, ...societies] : [{ value: "Cattown" }, { value: "Cattown Home" }]

  return (
    <ItemsContainer className={`${containerClassName}`}>
      <form className={`md:col-span-2 lg:col-span-3 xl:col-span-6 flex flex-col xl:flex-row items-center gap-8 justify-between ${filterClassName}`}>
        <FaFilter className="text-white text-3xl cursor-pointer" onClick={onSubmit} />
        <div className={`grid md:grid-cols-3 xl:grid-cols-5 items-center gap-8 text-xl w-full ${filterCClassName}`}>
          <Input placeholder="Buscar..." className={"w-full"} register={register("search")} onChange={(e) => setSearch(e?.target?.value)} list="recentSearches"/>
          <datalist id="recentSearches">
            {recentSearches.map((s, index) => (
              <option key={index} value={s} />
            ))}
          </datalist>
          <SelectInput selectedOption={society} setSelectedOption={setSociety} options={finalSocieties} className={"!py-"} />
          <SelectInput selectedOption={category} setSelectedOption={setCategory} options={[{ value: "Todas las categorias", all: true }, ...categories]} className={"!py-2"} />
          <SelectInput selectedOption={color} setSelectedOption={setColor} options={[{ value: "Todos los colores", all: true }, ...colors]} className={"!py-2"} />
          <SelectInput selectedOption={size} setSelectedOption={setSize} options={[{ value: "Todos los tamaños", all: true }, ...sizes]} text className={"!py-2"} />
        </div>
      </form>
      {(articles && filteredArticles) ? filteredArticles?.length ? filteredArticles.map((article) => {
        return <ArticleCard article={article} articles={quantities} setArticles={setQuantities} key={article?._id} onClickArticle={onClickArticle} stockNoControl={stockNoControl} />
      }) : (
        <p className="text-white text-4xl col-span-6 text-center my-16">No hay articulos que coincidan con los filtros</p>
      ) : (
        <Oval />
      )}
      <div className={"flex gap-x-16 justify-center self-end items-center text-white md:col-span-2 lg:col-span-3 xl:col-span-6 " + pageClassName}>
        {page > 1 && <Button className={"px-4 py-4"} onClick={() => setPage(p => p - 1)} type={"button"}><FaChevronLeft /></Button>}
        <p className="text-2xl">{page}</p>
        {articles?.length ? <Button className={"px-4 py-4"} onClick={() => setPage(p => p + 1)} type={"button"}><FaChevronRight /></Button> : null}
      </div>
    </ItemsContainer>
  )
}

export default ArticlesContainer