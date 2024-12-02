import { useEffect, useState } from "react"
import Main from "../containers/Main"
import customAxios from "../config/axios.config"
import { FaChevronLeft, FaChevronRight, FaPlus } from "react-icons/fa6"
import { FaFileUpload, FaTrashAlt } from "react-icons/fa"
import Button from "../components/Button"
import Input from "../components/Input"
import SelectInput from "../components/SelectInput"
import Label from "../components/Label"
import ClientsContainer from "../containers/ClientsContainer"
import ArticlesContainer from "../containers/ArticlesContainer"
import Table from "../components/Table"
import { useNavigate } from "react-router-dom"
import { measurements, uploadFile } from "../utils/utils"
import moment from "moment"

const NewBuyOrder = () => {
  const [step, setStep] = useState(1)
  const [supplier, setSupplier] = useState(null)
  const [articles, setArticles] = useState([])
  const [customArticles, setCustomArticles] = useState([])
  const navigate = useNavigate()

  const sections = ["Datos iniciales", "Seleccion de articulos", "Resumen y precios"]

  const prevStep = () => setStep(s => s - 1)
  const nextStep = () => setStep(s => s + 1)

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

  const onChangePrice = (price, article) => {
    if (article?.custom) {
      changeCustomArticle(price, "price", article?.id)
    } else {
      const articleIndex = articles.findIndex(a => a?._id == article?._id || (a?.article?._id ? a?.article?._id == article?.article?._id : false))
      articles.splice(articleIndex, 1)
      const newArticleCard = { ...article, price }
      const newArticles = [...articles, newArticleCard]
      setArticles(newArticles.sort((a, b) => a.description !== b.description ? a.description < b.description ? -1 : 1 : 0))
    }
  }

  const getCustomArticleIndex = (id) => customArticles.findIndex(c => c.id == id)

  const addCustomArticle = (e) => {
    e.preventDefault();
    setCustomArticles([...customArticles, { id: customArticles.length ? customArticles[customArticles.length - 1].id + 1 : 1, detail: "", file: [], custom: true, measurement: {value: "Unidades"} }])
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

  const tableFields = [
    {
      value: "description", showsFunc: true, param: true, shows: (val, row) => {
        return (row?.description || row?.detail)
      }
    },
    { value: "quantity" },
    {
      value: "price", showsFunc: true, param: true, shows: (val, row) => {
        return (<Input type="number" key={row?._id + "price"} defaultValue={val || 0} onChange={(e) => onChangePrice(e?.target?.value, row)} className={"!py-0 !px-0 rounded-none focus:!bg-transparent w-[100px]"} containerClassName={"!border-0 rounded-none"} />)
      }
    },
    { value: "subtotal", showsFunc: true, param: true, shows: (val, row) => ((row?.price * row?.quantity) || 0) },
  ]

  const handleSubmit = async () => {
    const items = []
    let uploadedCustomArticles
    const finalCustomArticles = customArticles.filter(c => c.quantity > 0)
    const result = await customAxios.post("/articles/custom", finalCustomArticles?.map(c => {
      return { detail: c.detail, quantity: c?.quantity, measurement: c?.measurement?.value }
    }))
    uploadedCustomArticles = result?.data

    await Promise.all(uploadedCustomArticles.map(async c => {
      const [customArticle, customArticleIndex] = [finalCustomArticles.find(cs => cs?.detail == c?.detail), finalCustomArticles.findIndex(cs => cs?.detail == c?.detail)]
      finalCustomArticles.splice(customArticleIndex, 1)
      items.push({ quantity: customArticle?.quantity, customArticle: c?._id, price: Number(customArticle?.price || 0) })

      if (customArticle.file[0]) {
        const filePath = `/articles/custom/${c?._id}`
        await uploadFile(customArticle.file[0], filePath, "thumbnail.png")
      }
    }))


    articles.forEach((article) => {
      items.push({
        quantity: article?.quantity,
        article: article?._id,
        price: Number(article?.price || 0)
      })
    })


    const order = {
      articles: items,
      client: supplier?._id,
      date: moment()
    }

    const resultOrder = await customAxios.post("/buy-orders", order)

    navigate("/buy-orders")
  }

  return (
    <Main className={"grid auto-rows-max px-2 sm:px-8 gap-8 text-white"}>
      <div className="flex justify-between self-start gap-x-4 items-center text-white text-3xl">
        {step > 1 ? <FaChevronLeft onClick={prevStep} className="cursor-pointer" /> : <p className="text-transparent">.</p>}
        <p className="text-2xl sm:text-4xl font-bold text-center">Paso {step}: {sections[step - 1]}</p>
        {step < 3 ? <FaChevronRight onClick={nextStep} className="cursor-pointer" /> : <p className="text-transparent">.</p>}
      </div>
      {step == 1 && (
        <>
          <p className={`text-lg ${!supplier ? "text-red-600" : "text-white"}`}>{supplier ? `Proveedor seleccionado: ${supplier?.name}` : "No seleccionaste un proveedor"}</p>
          <ClientsContainer suppliers containerClassName={"max-h-[30rem] overflow-y-auto md:!grid-cols-2"} onClickClient={(c) => (setSupplier(c))} />
        </>
      )}
      {step == 2 && (
        <div className="grid gap-16 sm:p-8">
          <div className="flex flex-col gap-4">
            <p className="text-2xl text-white">Articulos</p>
            <ArticlesContainer materials setQuantities={setArticles} quantities={articles} containerClassName={"max-h-[600px] overflow-y-auto"} stockControl={false} onClickArticle={onClickArticle} stockNoControl />
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
                </div>
                <div className="flex justify-between gap-2 col-span-2 lg:col-span-5 flex-wrap">
                  <div className="flex flex-col gap-2">
                    <Label>Precio</Label>
                    <Input className={"w-full"} id={"price" + article.id} defaultValue={article?.price} type="number" name={"price" + article.id} onChange={e => changeCustomArticle(e.target.value, "price", article?.id)} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Medida</Label>
                    <SelectInput selectedOption={article?.measurement} setSelectedOption={e => changeCustomArticle(e, "measurement", article?.id)} options={measurements} className={"!py-2"} containerClassName={"w-full !text-black"} />
                  </div>
                  <Button className={"self-end !bg-red-600"} onClick={e => (e.preventDefault(), deleteCustomArticle(article?.id))}><FaTrashAlt /></Button>
                </div>
              </div>
            })}
            <Button className={"flex items-center gap-4"} onClick={addCustomArticle}>Agregar articulo <FaPlus /></Button>
          </div>
        </div>
      )}
      {step == 3 && (
        <>
          <div>
            <p className="text-white text-2xl font-bold">Proveedor: {supplier?.name}</p>
          </div>
          <Table fields={tableFields} headers={["Descripcion", "Cantidad", "Precio unitario", "Subtotal"]} rows={[...articles, ...customArticles]} />
          <Button className={"md:justify-self-end"} onClick={handleSubmit}>Confirmar Compra</Button>
        </>
      )}
    </Main>
  )
}

export default NewBuyOrder