import { useState } from "react"
import Main from "../containers/Main"
import Label from "../components/Label"
import ClientsContainer from "../containers/ClientsContainer"
import Button from "../components/Button"
import { FaChevronDown, FaChevronLeft, FaChevronRight, FaPlus } from "react-icons/fa6"
import { FaFileUpload, FaTrashAlt } from "react-icons/fa"
import Input from "../components/Input"
import ArticlesContainer from "../containers/ArticlesContainer"

const NewOrder = () => {
  const [client, setClient] = useState(null)
  const [selectClients, setSelectClients] = useState(true)
  const [articles, setArticles] = useState([])
  const [customArticles, setCustomArticles] = useState([]) 
  const [file, setFile] = useState(null)
  const [step, setStep] = useState(1)

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0]
    const reader = new FileReader();
    reader.onload = (e) => {
      setFile([uploadedFile, e.target.result])
    };
    reader.readAsDataURL(uploadedFile)
  }

  const onClickArticle = (article, setArticle) => {
    article.quantity ? (article.quantity += 1) : (article.quantity = 1)
    const newArticle = {...article}
    setArticle(newArticle)
    setArticles([...articles, newArticle])
  }

  const getCustomArticleIndex = (id) => customArticles.findIndex(c => c.id == id)

  const addCustomArticle = (e) => {
    e.preventDefault();
    setCustomArticles([...customArticles, {id: customArticles.length ? customArticles[customArticles.length - 1].id + 1 : 1, description: "", file: []}])
  }

  const changeCustomArticle = (value, property, id) => {
    customArticles[getCustomArticleIndex(id)][property] = value

    setCustomArticles([...customArticles])
  }

  const changeCustomArticleFile = (file, id) => {
    const articleIndex = getCustomArticleIndex(id)
    customArticles[articleIndex].file[0] = file

    const uploadedFile = file
    const reader = new FileReader();
    reader.onload = (e) => {
      customArticles[articleIndex].file[1] = e.target.result
      setCustomArticles([...customArticles])
    };
    reader.readAsDataURL(uploadedFile)
  }

  const deleteCustomArticle = (id) => {
    customArticles.splice(getCustomArticleIndex(id), 1)
    setCustomArticles([...customArticles])
  }

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  return (
    <Main className={"grid gap-8"}>
      <div className="flex justify-between self-start items-center text-white text-3xl">
        {step > 1 ? <FaChevronLeft onClick={prevStep} className="cursor-pointer"/> : <p className="text-transparent">.</p>}
        <p className="text-4xl font-bold">Paso {step}</p>
        {step < 3 ? <FaChevronRight onClick={nextStep} className="cursor-pointer"/> : <p className="text-transparent">.</p>}
      </div>
      <form action="" className="grid">
        {step == 1 ? (
          <div className="grid grid-cols-2 justify-start gap-8 items-start sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 justify-start content-start gap-8 items-center col-span-2">
              <Label>Cliente</Label>
              <Button className={"px-4 sm:justify-self-end min-w-[150px]"} onClick={(e) => (e.preventDefault(), setSelectClients(s => !s))}>{client?.name || <FaChevronDown />}</Button>
              {selectClients && <ClientsContainer containerClassName={"max-h-[20rem] overflow-y-auto mb-10 sm:col-span-2"} onClickClient={(c) => (setClient(c), setSelectClients(false))} />}

              <Label>Fecha</Label>
              <Input type="date" className={"w-full"} containerClassName={"sm:justify-self-end"} />
            </div>

            <Label htmlFor="file" className={`${file ? "border-4 border-nav" : "w-full h-full border-dashed rounded-lg border-nav border-4 py-8"} min-h-[300px] col-span-2 flex items-center overflow-hidden self-center justify-center `}>
              {!file ? <FaFileUpload className="text-7xl" /> : <img src={file[1]} alt="Seleccionar imagen" className="w-full h-full object-cover" />}
              <Input type="file" className="hidden" id="file" accept="image/*" name="file" onChange={handleFileChange} containerClassName={"hidden"} />
            </Label>
          </div>
        ) : (step == 2) ? (
          <div className="grid gap-16 sm:p-8">
            <div className="flex flex-col gap-4">
              <p className="text-2xl text-white">Articulos</p>
              <ArticlesContainer containerClassName={"max-h-[600px] overflow-y-auto"} stockControl={false} onClickArticle={onClickArticle} stockNoControl/>
            </div>
            <div className="flex flex-col gap-4 items-start">
              <p className="text-2xl text-white">Articulos personalizados</p>
              {customArticles.map(article => {
                return <div className="grid grid-cols-5 w-full gap-4" key={article?.id}>
                  <Input className={"h-full w-full resize-none"} onChange={e => changeCustomArticle(e.target.value, "description", article?.id)} containerClassName={"col-span-3"} textarea/>
                  <Label htmlFor={"file"+article?.id} className={`${article?.file[1] ? "max-h-[150px] border-4 border-nav" : "w-full h-full border-dashed rounded-lg border-nav border-4 py-8"} col-span-1 flex items-center overflow-hidden self-center justify-center `}>
                    {!article?.file[1] ? <FaFileUpload className="text-7xl" /> : <img src={article?.file[1]} alt="Seleccionar imagen" className="w-full h-full object-cover" />}
                    <Input type="file" className="hidden" id={"file"+article?.id} accept="image/*" name={"file"+article?.id} onChange={e => changeCustomArticleFile(e.target.files[0], article?.id)} containerClassName={"hidden"} />
                  </Label>
                  <div className="flex flex-col gap-4">
                    <Label>Cantidad</Label>
                    <Input type="number" step="1" className={"w-full"} onChange={e => changeCustomArticle(e.target.value, "quantity", article?.id)}/>
                    <Button className={"self-end !bg-red-600"} onClick={e => (e.preventDefault(), deleteCustomArticle(article?.id))}><FaTrashAlt/></Button>
                  </div>
                </div>
              })}
              <Button className={"flex items-center gap-4"} onClick={addCustomArticle}>Agregar articulo <FaPlus/></Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-16 sm:p-8 self-start">
            <h3 className="text-white text-3xl">Resumen</h3>
            {articles.map(article => {
              return (
                <div className="flex justify-between gap-4 text-white border-2 border-action rounded p-4">
                  <p className="text-2xl">{article?.description}</p>
                </div>
              )
            })}
          </div>
        )}
      </form>
    </Main>
  )
}

export default NewOrder