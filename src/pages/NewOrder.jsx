import { useState } from "react"
import Main from "../containers/Main"
import Label from "../components/Label"
import ClientsContainer from "../containers/ClientsContainer"
import Button from "../components/Button"
import { FaCheck, FaChevronDown, FaChevronLeft, FaChevronRight, FaPlus } from "react-icons/fa6"
import { FaFileUpload, FaTrashAlt } from "react-icons/fa"
import Input from "../components/Input"
import ArticlesContainer from "../containers/ArticlesContainer"
import ArticleRow from "../components/ArticleRow"
import customAxios from "../config/axios.config"
import { uploadFile } from "../utils/utils"
import moment from "moment"
import { useNavigate } from "react-router-dom"

const NewOrder = () => {
  const [client, setClient] = useState(null)
  const [selectClients, setSelectClients] = useState(true)
  const [articles, setArticles] = useState([])
  const [customArticles, setCustomArticles] = useState([])
  const [order, setOrder] = useState(null)
  const [orderId, setOrderId] = useState(null)
  const [date, setDate] = useState("")
  const [file, setFile] = useState(null)
  const [step, setStep] = useState(1)
  const navigate = useNavigate()

  const sections = ["Datos iniciales", "Seleccion de articulos", "Resumen"]

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0]
    const reader = new FileReader();
    reader.onload = (e) => {
      setFile([uploadedFile, e.target.result])
    };
    reader.readAsDataURL(uploadedFile)
  }

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

  const getCustomArticleIndex = (id) => customArticles.findIndex(c => c.id == id)

  const addCustomArticle = (e) => {
    e.preventDefault();
    setCustomArticles([...customArticles, { id: customArticles.length ? customArticles[customArticles.length - 1].id + 1 : 1, detail: "", file: [] }])
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

  const onSubmit = async () => {
    if (client?._id) {
      const finalCustomArticles = customArticles.filter(c => c.quantity > 0)
      const result = await customAxios.post("/articles/custom", finalCustomArticles?.map(c => {
        return { detail: c.detail, quantity: c?.quantity }
      }))
      const uploadedCustomArticles = result?.data
      const items = []

      await Promise.all(uploadedCustomArticles.map(async c => {
        const customArticle = finalCustomArticles.find(cs => cs?.detail == c?.detail)
        items.push({ booked: 0, quantity: customArticle?.quantity, common: false, customArticle: c?._id, hasToBeCut: true })

        if (customArticle.file[0]) {
          const filePath = `/articles/custom/${c?._id}`
          await uploadFile(customArticle.file[0], filePath, "thumbnail.png")
        }
      }))


      await Promise.all(articles.map(async (article) => {
        const resultArticleQuantities = await customAxios.get(`/orders/booked/${article?._id}`)
        const booked = resultArticleQuantities.data?.booked
        const stock = resultArticleQuantities.data?.stock
        const stockDifference = (stock - booked)

        items.push({
          booked: (stockDifference >= article?.quantity) ? article?.quantity : stockDifference,
          quantity: article?.quantity,
          common: true,
          article: article?._id,
          hasToBeCut: false
        })
      }))

      const order = {
        articles: items,
        client: client?._id,
        date: moment(date, "YYYY-MM-DD"),
        finished: false,
        hasToBeCut: false
      }

      let count = 0
      const resultOrder = await (await customAxios.post("/orders", order)).data
      resultOrder.articles = resultOrder.articles?.map(a => {
        if (a.common && a.quantity > a.booked) {
          a.article = articles.find(art => art._id == a?.article)
          count++
          return {
            cutQuantity: a.quantity - a.booked,
            ...a
          }
        }
      })

      if (count) {
        setOrderId(resultOrder?._id)
        setOrder(resultOrder.articles.filter(a => a))
      } else {
        navigate("/orders")
      }
    }
  }

  const onConfirmCutOrder = async () => {
    await customAxios.put(`/orders/articles/${orderId}`)
    navigate("/orders")
  }

  return (
    <Main className={"grid auto-rows-max px-2 sm:px-8 gap-8"}>
      {!order ?
        (<>
          <div className="flex justify-between self-start gap-x-4 items-center text-white text-3xl">
            {step > 1 ? <FaChevronLeft onClick={prevStep} className="cursor-pointer" /> : <p className="text-transparent">.</p>}
            <p className="text-2xl sm:text-4xl font-bold text-center">Paso {step}: {sections[step - 1]}</p>
            {step < 3 ? <FaChevronRight onClick={nextStep} className="cursor-pointer" /> : <p className="text-transparent">.</p>}
          </div>
          <form action="" className="grid" onSubmit={(e) => (e.preventDefault(), onSubmit())}>
            {step == 1 ? (
              <div className="grid grid-cols-2 justify-start gap-8 items-start sm:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 justify-start content-start gap-8 items-center col-span-2">
                  <Label>Cliente</Label>
                  <Button className={"px-4 sm:justify-self-end min-w-[150px]"} onClick={(e) => (e.preventDefault(), setSelectClients(s => !s))}>{client?.name || <FaChevronDown />}</Button>
                  {selectClients && <ClientsContainer containerClassName={"max-h-[20rem] overflow-y-auto mb-10 sm:col-span-2"} onClickClient={(c) => (setClient(c), setSelectClients(false))} />}

                  <Label>Fecha</Label>
                  <Input type="date" id={"date"} name={"date"} defaultValue={date} onChange={(e) => setDate(e?.target?.value)} className={"w-full"} containerClassName={"sm:justify-self-end"} />
                </div>

                <Label htmlFor="file" className={`${file ? "border-4 border-nav max-w-[50%] max-h-[650px]" : "w-[50%] h-full border-dashed rounded-lg border-nav border-4 py-8"} min-h-[300px] col-span-2 flex items-center overflow-hidden self-center justify-self-center justify-center `}>
                  {!file ? <FaFileUpload className="text-7xl" /> : <img src={file[1]} alt="Seleccionar imagen" className="w-full h-full object-cover" />}
                  <Input type="file" className="hidden" id="file" accept="image/*" name="file" onChange={handleFileChange} containerClassName={"hidden"} />
                </Label>
              </div>
            ) : (step == 2) ? (
              <div className="grid gap-16 sm:p-8">
                <div className="flex flex-col gap-4">
                  <p className="text-2xl text-white">Articulos</p>
                  <ArticlesContainer setQuantities={setArticles} quantities={articles} containerClassName={"max-h-[600px] overflow-y-auto"} stockControl={false} onClickArticle={onClickArticle} stockNoControl />
                </div>
                <div className="flex flex-col gap-8 sm:gap-4 items-start">
                  <p className="text-2xl text-white">Articulos personalizados</p>
                  {customArticles.map(article => {
                    return <div className="grid grid-cols-2 bg-third p-4 rounded-lg lg:grid-cols-5 w-full gap-4" key={article?.id}>
                      <Input className={"h-full w-full resize-none"} defaultValue={article?.detail} id={"detail" + article.id} name={"detail" + article.id} onChange={e => changeCustomArticle(e.target.value, "detail", article?.id)} containerClassName={"col-span-2 lg:col-span-3"} textarea />
                      <Label htmlFor={"file" + article?.id} className={`${article?.file[1] ? "max-h-[150px] border-4 border-nav" : "w-full h-full border-dashed rounded-lg border-nav border-4 py-8"} col-span-1 flex items-center overflow-hidden self-center justify-center `}>
                        {!article?.file[1] ? <FaFileUpload className="text-7xl" /> : <img src={article?.file[1]} alt="Seleccionar imagen" className="w-full h-full object-cover" />}
                        <Input type="file" className="hidden" id={"file" + article?.id} accept="image/*" name={"file" + article?.id} onChange={e => changeCustomArticleFile(e.target.files[0], article?.id)} containerClassName={"hidden"} />
                      </Label>
                      <div className="flex flex-col gap-4">
                        <Label>Cantidad</Label>
                        <Input type="number" step="1" className={"w-full"} id={"quantity" + article.id} defaultValue={article?.quantity} name={"quantity" + article.id} onChange={e => changeCustomArticle(e.target.value, "quantity", article?.id)} />
                        <Button className={"self-end !bg-red-600"} onClick={e => (e.preventDefault(), deleteCustomArticle(article?.id))}><FaTrashAlt /></Button>
                      </div>
                    </div>
                  })}
                  <Button className={"flex items-center gap-4"} onClick={addCustomArticle}>Agregar articulo <FaPlus /></Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-y-16 sm:px-16 gap-16 sm:p-8 self-start text-white">
                <div className="flex flex-col gap-y-8">
                  {client?._id ? <>
                    <h4 className={"text-3xl font-semibold"}>Cliente: {client?.name}</h4>
                    <p className="text-xl">Direccion: {client?.address}</p>
                    <p className="text-xl">Instrucciones de entrega: {client?.detail}</p>
                    <p className="text-xl">Fecha: {date}</p>
                  </> : (
                    <h4 className="text-3xl font-semibold text-red-600">No hay un cliente seleccionado</h4>
                  )}
                </div>
                <img src={file && file[1]} className="max-h-[400px] w-full object-cover object-center border-4 border-important" alt="No hay imagen del pedido" />
                <div className="flex flex-col gap-4 text-white">
                  <h4 className="text-2xl font-semibold">Articulos</h4>
                  {articles?.length ? articles.map(article => {
                    return (
                      <ArticleRow article={article} key={"row" + article?._id} />
                    )
                  }) : (
                    <p>No hay articulos de linea</p>
                  )}
                </div>
                <div className="flex flex-col gap-4 text-white">
                  <h4 className="text-2xl font-semibold">Articulos personalizados</h4>
                  {customArticles?.filter(c => c.quantity > 0)?.length ? customArticles.filter(c => c.quantity > 0).map(article => {
                    return (
                      <ArticleRow article={article} key={"customrow" + article?.id} />
                    )
                  }) : (
                    <p>No hay articulos personalizados</p>
                  )}
                </div>
                {client?._id && <Button className={"col-span-2 justify-self-end flex gap-4 items-center"} type={"submit"}>Confirmar Pedido <FaCheck /></Button>}
              </div>
            )}
          </form>
        </>) : (
          <>
            <div className="grid md:grid-cols-2 gap-y-8 justify-between items-center">
              <h2 className="text-4xl font-bold text-white text-center md:text-start">Confirmar corte de articulos de linea</h2>
              <div className="flex flex-col sm:flex-row gap-6 justify-self-center md:justify-self-end">
                <Button onClick={onConfirmCutOrder}>Confirmar corte</Button>
                <Button className={"bg-red-600 hover:bg-red-800"} onClick={() => navigate("/orders")}>Cancelar corte</Button>
              </div>
            </div>
            <div className="flex flex-col gap-4 text-white">
              {order?.length ? order.map(article => {
                const cutQuantity = article?.cutQuantity
                article = article.article
                article.quantity = cutQuantity
                return (
                  <ArticleRow article={article} key={"cutrow" + article?._id} />
                )
              }) : null}
            </div>
          </>
        )}
    </Main>
  )
}

export default NewOrder