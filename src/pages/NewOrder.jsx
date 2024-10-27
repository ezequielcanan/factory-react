import { useContext, useRef, useState } from "react"
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
import { uploadFile, userIncludesRoles } from "../utils/utils"
import moment from "moment"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import SelectInput from "../components/SelectInput"
import OrderCard from "../components/OrderCard"
import { UserContext } from "../context/UserContext"

const NewOrder = () => {
  const [client, setClient] = useState(null)
  const { userData } = useContext(UserContext)
  const societies = userIncludesRoles(userData, "cattown") ? [{ value: "Cattown" }] : [{ value: "Arcan" }, { value: "Cattown" }]
  const [society, setSociety] = useState(societies[0])
  const [selectClients, setSelectClients] = useState(true)
  const [articles, setArticles] = useState([])
  const [customArticles, setCustomArticles] = useState([])
  const [order, setOrder] = useState(null)
  const [orderId, setOrderId] = useState(null)
  const [suborders, setSuborders] = useState([])
  const newSuborderRef = useRef(null)
  const [file, setFile] = useState(null)
  const [step, setStep] = useState(1)
  const { register, handleSubmit, getValues } = useForm()
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
    setCustomArticles([...customArticles, { id: customArticles.length ? customArticles[customArticles.length - 1].id + 1 : 1, detail: "", file: [], bordadoFile: [], bordadoType: {value: "Bordado"} }])
  }

  const changeCustomArticle = (value, property, id) => {
    customArticles[getCustomArticleIndex(id)][property] = value

    setCustomArticles([...customArticles])
  }

  const changeCustomArticleFile = (file, id, bordado = false) => {
    const articleIndex = getCustomArticleIndex(id)
    customArticles[articleIndex][bordado ? "bordadoFile" : "file"][0] = file

    const uploadedFile = file
    const reader = new FileReader();
    reader.onload = (e) => {
      customArticles[articleIndex][bordado ? "bordadoFile" : "file"][1] = e.target.result
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

  const onSubmit = handleSubmit(async data => {
    if (client?._id) {
      const items = []
      let uploadedCustomArticles
      if (!suborders?.length) {
        const finalCustomArticles = customArticles.filter(c => c.quantity > 0)
        const result = await customAxios.post("/articles/custom", finalCustomArticles?.map(c => {
          return { detail: c.detail, quantity: c?.quantity, details: c?.details, size: c?.size, ubicacion: c?.ubicacion, bordado: c?.bordado, bordadoType: c?.bordadoType?.value || "Bordado" }
        }))
        uploadedCustomArticles = result?.data

        await Promise.all(uploadedCustomArticles.map(async c => {
          const customArticle = finalCustomArticles.find(cs => cs?.detail == c?.detail)
          items.push({ booked: 0, quantity: customArticle?.quantity, common: false, customArticle: c?._id, hasToBeCut: false })

          if (customArticle.file[0]) {
            const filePath = `/articles/custom/${c?._id}`
            await uploadFile(customArticle.file[0], filePath, "thumbnail.png")
          }

          if (customArticle.bordadoFile[0]) {
            const filePath = `/articles/custom/${c?._id}`
            await uploadFile(customArticle.bordadoFile[0], filePath, "bordado.png")
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
            hasToBeCut: false,
            price: article?.price ? (article?.price * (1 - client?.discount)) : 0
          })
        }))
      }


      const order = {
        articles: items,
        client: client?._id,
        deliveryDate: moment(data.date, "YYYY-MM-DD"),
        date: moment(),
        finished: false,
        hasToBeCut: false,
        extraInfo: data?.extraInfo,
        society: society?.value,
      }

      if (suborders?.length) {
        order["suborders"] = suborders?.map(s => s?._id)
      }

      let count = 0
      const resultOrder = await (await customAxios.post("/orders", order)).data
      resultOrder.articles = resultOrder.articles?.map(a => {
        if (a.quantity > a.booked) {
          a.article = !a?.customArticle ? articles.find(art => art._id == a?.article) : uploadedCustomArticles.find(art => art?._id == a?.customArticle)
          count++
          return {
            cutQuantity: a.quantity - a.booked,
            ...a
          }
        }
      })

      if (count && !suborders?.length) {
        setOrderId(resultOrder?._id)
        setOrder(resultOrder.articles.filter(a => a))
      } else {
        navigate("/orders")
      }
    }
  })

  const onConfirmCutOrder = async () => {
    await customAxios.put(`/orders/articles/${orderId}`)

    navigate("/orders")
  }


  const onClickAddSuborder = async (e) => {
    e.preventDefault()
    const suborder = (await customAxios.get(`/orders/number/${newSuborderRef?.current?.value}`)).data
    if (suborder && (userIncludesRoles(userData, "cattown") ? suborder?.order?.society == "Cattown" : true) && !suborders?.some(s => s?._id == suborder?.order?._id)) {
      setSuborders([...suborders, suborder?.order])
      newSuborderRef.current.value = ""
    }
  }
  console.log(order)
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
              <div className="grid grid-cols-2 justify-start gap-8 gap-x-10 items-start sm:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 justify-start content-start gap-8 items-center col-span-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 justify-start content-start gap-8 items-center self-start">
                    <Label>Negocio</Label>
                    <SelectInput selectedOption={society} setSelectedOption={setSociety} options={societies} className={"!py-2"} />

                    <Label>Fecha de entrega</Label>
                    <Input type="date" register={register("date", { required: true })} className={"w-full"} containerClassName={"sm:justify-self-end"} />

                    <Label className={"self-start"}>Informacion extra / Anotaciones</Label>
                    <Input textarea cols="50" rows="5" register={register("extraInfo")} className={"w-full"} containerClassName={"sm:justify-self-end"} />
                    <div className="grid sm:col-span-2 lg:grid-cols-2 gap-4 text-white">
                      <h3 className="text-xl lg:col-span-2">Parciales</h3>
                      {suborders?.map(s => {
                        return <OrderCard order={s} key={s?._id} cross crossAction={(s) => (suborders.splice(suborders?.findIndex(so => so?._id == s?._id), 1), setSuborders([...suborders]))} />
                      })}
                      <div className="flex gap-x-4 lg:col-span-2">
                        <Input placeholder="N° de pedido" ref={newSuborderRef} className={"w-full"} />
                        <Button className={"px-4 py-2"} onClick={onClickAddSuborder}>Agregar</Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-8 self-start">
                    <div className="flex gap-x-2 sm:gap-x-8 justify-between items-center">
                      <Label>Cliente</Label>
                      <Button className={"px-2 sm:px-4 sm:justify-self-end text-lg sm:text-2xl sm:min-w-[150px]"} onClick={(e) => (e.preventDefault(), setSelectClients(s => !s))}>{client?.name || <FaChevronDown />}</Button>
                    </div>
                    {selectClients && <ClientsContainer containerClassName={"max-h-[30rem] overflow-y-auto md:!grid-cols-2"} onClickClient={(c) => (setClient(c), setSelectClients(false))} />}
                  </div>
                </div>
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
                    return <div className="grid grid-cols-2 bg-third p-4 rounded-lg overflow-y-auto lg:grid-cols-5 w-full gap-4" key={article?.id}>
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
                      <div className="flex justify-between gap-2 col-span-2 lg:col-span-5 flex-wrap">
                        <div className="flex flex-col gap-2">
                          <Label>Talle</Label>
                          <Input className={"w-full"} id={"size" + article.id} defaultValue={article?.size} name={"size" + article.id} onChange={e => changeCustomArticle(e.target.value, "size", article?.id)} />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label>Tipo</Label>
                          <SelectInput selectedOption={article?.bordadoType} setSelectedOption={e => changeCustomArticle(e, "bordadoType", article?.id)} options={[{value: "Bordado"}, {value: "Estampado"}]} className={"!py-2"} containerClassName={"w-auto"}/>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label>{article?.bordadoType?.value || "Bordado"}</Label>
                          <Input className={"w-full"} id={"bordado" + article.id} defaultValue={article?.bordado} name={"bordado" + article.id} onChange={e => changeCustomArticle(e.target.value, "bordado", article?.id)} />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label>Ubicacion</Label>
                          <Input className={"w-full"} id={"ubicacion" + article.id} defaultValue={article?.ubicacion} name={"ubicacion" + article.id} onChange={e => changeCustomArticle(e.target.value, "ubicacion", article?.id)} />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label>Detalle tecnico</Label>
                          <Input className={"w-full"} id={"details" + article.id} defaultValue={article?.details} name={"details" + article.id} onChange={e => changeCustomArticle(e.target.value, "details", article?.id)} />
                        </div>
                        <Label htmlFor={"fileb" + article?.id} className={`${article?.bordadoFile[1] ? "max-h-[150px] border-4 border-nav" : "md:w-[20%] w-full h-full border-dashed rounded-lg border-nav border-4 py-8"} max-w-full md:max-w-[20%] col-span-1 flex items-center overflow-hidden self-center justify-center `}>
                          {!article?.bordadoFile[1] ? <FaFileUpload className="text-7xl" /> : <img src={article?.bordadoFile[1]} alt="Seleccionar imagen" className="w-full h-full object-cover" />}
                          <Input type="file" className="hidden" id={"fileb" + article?.id} accept="image/*" name={"fileb" + article?.id} onChange={e => changeCustomArticleFile(e.target.files[0], article?.id, true)} containerClassName={"hidden"} />
                        </Label>
                      </div>
                    </div>
                  })}
                  <Button className={"flex items-center gap-4"} onClick={addCustomArticle}>Agregar articulo <FaPlus /></Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-16 gap-4  sm:px-16 md:gap-16 md:p-8 self-start text-white">
                <div className="flex flex-col gap-y-8">
                  {(client?._id && getValues("date")) ? <>
                    <h4 className={"text-xl sm:text-3xl font-semibold"}>Cliente: {client?.name}</h4>
                    <p className="text-xl">Direccion: {client?.address}</p>
                    <p className="text-xl">Instrucciones de entrega: {client?.detail}</p>
                    <p className="text-xl">Expreso: {client?.expreso}</p>
                    <p className="text-xl">Direccion de expreso: {client?.expresoAddress}</p>
                    <p className="text-xl">Fecha de entrega: {moment(getValues("date")).format("DD-MM-YYYY")}</p>
                  </> : (
                    <h4 className="text-3xl font-semibold text-red-600">Faltan datos iniciales</h4>
                  )}
                </div>
                <p className="text-2xl">Informacion extra / Anotaciones: {getValues("extraInfo")}</p>
                {!suborders?.length ? (
                  <>
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
                  </>
                ) : (
                  <div className="md:col-span-2 grid gap-4 md:grid-cols-3">
                    <h4 className="text-2xl font-semibold md:col-span-3">Parciales</h4>
                    {suborders?.map(s => {
                      return <OrderCard order={s} key={s?._id} />
                    })}
                  </div>
                )}
                {client?._id && <Button className={"md:col-span-2 justify-self-end flex gap-4 items-center"} type={"submit"}>Confirmar Pedido <FaCheck /></Button>}
              </div>
            )}
          </form>
        </>) : (
          <>
            <div className="grid md:grid-cols-2 gap-y-8 justify-between items-center">
              <h2 className="text-4xl font-bold text-white text-center md:text-start">Confirmar corte de articulos</h2>
              <div className="flex flex-col sm:flex-row gap-6 justify-self-center md:justify-self-end">
                <Button onClick={onConfirmCutOrder}>Confirmar corte</Button>
                <Button className={"bg-red-600 hover:bg-red-800"} onClick={() => navigate("/orders")}>Cancelar corte</Button>
              </div>
            </div>
            <div className="flex flex-col gap-4 text-white">
              {order?.length ? order.map(article => {
                const cutQuantity = article?.cutQuantity
                article = article.article || article?.customArticle
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