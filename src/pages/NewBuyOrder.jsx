import { useEffect, useState } from "react"
import Main from "../containers/Main"
import customAxios from "../config/axios.config"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6"
import ClientsContainer from "../containers/ClientsContainer"
import ArticlesContainer from "../containers/ArticlesContainer"

const NewBuyOrder = () => {
  const [step, setStep] = useState(1)
  const [suppliers, setSuppliers] = useState(null)
  const [supplier, setSupplier] = useState(null)
  const [articles, setArticles] = useState([])

  useEffect(() => {
    customAxios.get(`/clients?suppliers=true`).then(res => {
      setSuppliers(res?.data)
    })
  }, [])

  const sections = ["Datos iniciales", "Seleccion de articulos", "Resumen y precios"]

  const prevStep = () => setStep(s => s-1)
  const nextStep = () => setStep(s => s+1)

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

  return (
    <Main className={"grid auto-rows-max px-2 sm:px-8 gap-8"}>
      <div className="flex justify-between self-start gap-x-4 items-center text-white text-3xl">
        {step > 1 ? <FaChevronLeft onClick={prevStep} className="cursor-pointer" /> : <p className="text-transparent">.</p>}
        <p className="text-2xl sm:text-4xl font-bold text-center">Paso {step}: {sections[step - 1]}</p>
        {step < 3 ? <FaChevronRight onClick={nextStep} className="cursor-pointer" /> : <p className="text-transparent">.</p>}
      </div>
      {step == 1 && (
        <>
          <p className={`text-lg ${!supplier ? "text-red-600" : "text-white"}`}>{supplier ? `Proveedor seleccionado: ${supplier?.name}` : "No seleccionaste un proveedor"}</p>
          <ClientsContainer containerClassName={"max-h-[30rem] overflow-y-auto md:!grid-cols-2"} onClickClient={(c) => (setSupplier(c))} />
        </>
      )}
      {step == 2 && (
        <>
          <ArticlesContainer materials setQuantities={setArticles} quantities={articles} containerClassName={"max-h-[600px] overflow-y-auto"} stockControl={false} onClickArticle={onClickArticle} stockNoControl/>
        </>
      )}
    </Main>
  )
}

export default NewBuyOrder