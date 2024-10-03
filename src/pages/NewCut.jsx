import { useState } from "react"
import Title from "../components/Title"
import ArticlesContainer from "../containers/ArticlesContainer"
import Main from "../containers/Main"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import ArticleRow from "../components/ArticleRow"
import Button from "../components/Button"
import customAxios from "../config/axios.config"
import moment from "moment"
import { useNavigate } from "react-router-dom"

const NewCut = () => {
  const [articles, setArticles] = useState([])
  const navigate = useNavigate()
  const [step, setStep] = useState(0)

  const onClickArticle = (article, setArticle) => {
    const articleIndex = articles.findIndex(a => a?._id == article?._id)
    if (articleIndex != -1) {
      article.quantity += 1
      articles.splice(articleIndex, 1)
      const newArticles = [...articles, article]
      setArticles(newArticles.filter(a => a.quantity > 0))
    } else {
      article.quantity = 1
      setArticles([...articles, article])
    }
  }

  const createCut = async () => {
    await customAxios.post("/cuts", {detail: `Corte Manual ${moment().format("DD/MM/YYYY")}`, manualItems: articles.map(art => {return {quantity: art?.quantity, article: art?._id}})})
    navigate("/cuts")
  } 


  return (
    <Main className={"grid gap-8 content-start"}>
      <div className={`flex justify-center md:justify-between gap-8 ${!step ? "flex-wrap" : "flex-wrap-reverse"} items-center`}>
        {step ? <FaChevronLeft className="text-white text-3xl" onClick={() => setStep(s => s-1)}/> : null}
        <Title text={"Nuevo corte manual"} className={"sm:text-start text-center"}/>
        {!step ? <FaChevronRight className="text-white text-3xl" onClick={() => setStep(s => s+1)}/> : null}
      </div>
      {!step ? (
        <ArticlesContainer setQuantities={setArticles} quantities={articles} containerClassName={"overflow-y-auto"} stockControl={false} onClickArticle={onClickArticle} stockNoControl/>
      ) : (
        <>
        {articles.map(article => {
          return <ArticleRow article={article} key={article?._id}/>
        })}
        <Button className={"sm:justify-self-end"} onClick={createCut}>Confirmar corte</Button>
        </>
      )}
    </Main>
  )
} 

export default NewCut