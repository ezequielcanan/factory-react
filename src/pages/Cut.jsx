import { useEffect, useState } from "react"
import Main from "../containers/Main"
import customAxios from "../config/axios.config"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Oval } from "react-loader-spinner"
import ArticleCard from "../components/ArticleCard"
import Title from "../components/Title"
import Button from "../components/Button"
import { BiTransferAlt } from "react-icons/bi"
import WorkshopsContainer from "../containers/WorkshopsContainer"
import moment from "moment"
import Input from "../components/Input"
import { useForm } from "react-hook-form"
import { FaTrash, FaTrashAlt } from "react-icons/fa"
import Swal from "sweetalert2"

const Cut = () => {
  const [cut, setCut] = useState(null)
  const [workshop, setWorkshop] = useState(null)
  const [passToWorkshop, setPassToWorkshop] = useState(false)
  const [selectedArticles, setSelectedArticles] = useState(null)
  const [edit, setEdit] = useState(false)
  const [reload, setReload] = useState(false)
  const { register, handleSubmit } = useForm()
  const { register: registerLogistics, handleSubmit: handleSubmitLogistics } = useForm()
  const { cid } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    customAxios.get(`/cuts/${cid}`).then(res => {
      const articles = (res?.data?.items?.length ? res?.data?.items : (res?.data?.order ? res?.data?.order?.articles : res?.data?.manualItems))?.filter(a => res?.data?.order ? ((a.hasToBeCut && a.quantity > a.booked) || res?.data?.workshopOrders?.some(o => o?.articles?.some(art => art?.customArticle ? art?.customArticle == a?.customArticle?._id : art?.article == a?.article?._id))) : true)
      setCut({ ...res?.data, articles })
    })
  }, [reload])

  const cutToWorkshop = async () => {
    const articles = selectedArticles.map(a => {return {...a, [a?.article ? "article" : "customArticle"]: a[a?.article ? "article" : "customArticle"]?._id}})
    await customAxios.post("/workshop-order", { workshop: workshop?._id, cut: cid, date: moment(), articles })
    setPassToWorkshop(false)
    setSelectedArticles(null)
    setWorkshop(false)
    setReload(!reload)
  }

  const onConfirmDescription = handleSubmit(async data => {
    await customAxios.put(`/cuts/${cid}?property=description&value=${data?.description}`)
    setEdit(!edit)
    setReload(!reload)
  })

  const onConfirmLogistics = handleSubmitLogistics(async data => {
    if (data?.date) {      
      await customAxios.post("/activities", { date: moment(data?.date).add(1, "day").subtract(1, "day"), description: cut?.description, cutId: cid, cut: true, title: cut?.order ? "CORTE N°" + cut?.order?.orderNumber : cut?.detail })
      setEdit(!edit)
      setReload(!reload)
      navigate("/cut-logistics")
    }
  })

  const deleteCut = async () => {
    Swal.fire({
      title: "<strong>CUIDADO: Vas a borrar el corte</strong>",
      icon: "warning",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: `
        Confirmar
      `,
      cancelButtonText: `
        Cancelar
      `,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await customAxios.delete(`/cuts/${cid}`)
        navigate("/cuts")
      }
    });
  }

  const onChangeWorkshop = (w) => {
    setWorkshop(w)
    setSelectedArticles([...cut?.articles])
  } 

  const toggleFromSelectedArticles = (article) => {
    if (workshop) {
      if (!selectedArticles.some(art => art?._id == article?.id)) {
        setSelectedArticles([...selectedArticles, cut?.articles?.find(art => art?._id == article?.id)])
      } else {
        selectedArticles.splice(selectedArticles.findIndex(art => art?._id == article?.id), 1)
        setSelectedArticles([...selectedArticles])
      }
    }
  }

  const handleCut = async () => {
    await customAxios.put(`/cuts/${cid}?property=cut&value=true`)
    setReload(!reload)
  }

  return (
    <Main>
      {cut ? (
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-y-16 gap-8">
          <Title text={"Orden de corte"} className={`text-center xl:text-start`} />
          <div className="flex gap-4 flex-wrap justify-center xl:justify-end text-white items-center wrap-reverse">
            {cut?.manualItems?.length ? <FaTrashAlt className="text-2xl cursor-pointer" onClick={deleteCut} /> : null}
            {!cut?.cut ? <Button className={"flex items-center justify-between gap-2 justify-self-center xl:justify-self-end"} onClick={handleCut}>Cortado</Button> : <Button className={"flex items-center justify-between gap-2 justify-self-center xl:justify-self-end"} onClick={() => setPassToWorkshop(a => !a)}>Pasar a un taller <BiTransferAlt /></Button>}
          </div>
          {workshop ? (
            <div className="grid xl:grid-cols-4 gap-4 items-center w-full text-xl justify-items-center xl:justify-items-start xl:col-span-2">
              <p className="text-white text-center text-2xl">Taller: {workshop?.name}</p>
              <p className="text-white text-center text-2xl">Telefono: {workshop?.phone}</p>
              <p className="text-white text-center text-2xl">Direccion: {workshop?.address}</p>
              <div className="xl:justify-self-end flex justify-center gap-4 flex-wrap">
                <Button className={"bg-red-600 hover:bg-red-700"} onClick={() => (setWorkshop(null), setSelectedArticles(null), setPassToWorkshop(false))}>Cancelar</Button>
                <Button className={""} onClick={cutToWorkshop}>Confirmar</Button>
              </div>
            </div>
          ) : null}
          <div className="flex flex-col xl:col-span-2 gap-4">
            <Input textarea className={"w-full"} register={register("description")} disabled={!edit} defaultValue={cut?.description || ""} />
            <div className="flex flex-col sm:flex-row w-full justify-between">
              <Button onClick={!edit ? () => setEdit(true) : onConfirmDescription} className={"self-start"}>{edit ? "Confirmar" : "Editar"}</Button>
              <div className="flex flex-col gap-4 sm:mt-0 mt-8">
                <Input type="date" className={"w-full"} register={registerLogistics("date")}/>
                <Button onClick={onConfirmLogistics}>Agregar al calendario</Button>
              </div>
            </div>
          </div>
          {passToWorkshop && <WorkshopsContainer containerClassName={"max-h-[30rem] h-full overflow-y-auto auto-rows-auto xl:col-span-2"} onClickWorkshop={(c) => (onChangeWorkshop(c), setPassToWorkshop(false))} />}
          <div className="grid md:grid-cols-2 gap-4 content-start text-white">
            <h3 className="md:col-span-2 text-2xl text-white">Articulos de linea</h3>
            {cut?.articles?.filter(a => cut?.order ? a.common : true)?.length ? cut?.articles?.filter(a => cut?.order ? a.common : true)?.map(article => {
              const workshopOrderWithArticle = cut?.workshopOrders?.find(o => o?.articles?.some(art => art?.article == article?.article?._id))
              if (workshopOrderWithArticle) {
                const wArticle = workshopOrderWithArticle?.articles?.find(art => art?.article == article?.article?._id)
                article.quantity = wArticle?.quantity || 0
                article.booked = wArticle?.booked || 0
              }
              let articleCard = { ...article }
              articleCard.quantity = Number(articleCard.quantity || 0) - Number(articleCard.booked || 0)
              articleCard = { ...articleCard, ...articleCard.article, id: articleCard?._id }
              return <ArticleCard quantityLocalNoControl onClickArticle={() => toggleFromSelectedArticles(articleCard)} article={articleCard} cstockNoShow stockNoControl quantityNoControl forCut bookedQuantity hoverEffect={workshop ? true : false} className={selectedArticles?.some(art => art?._id == articleCard?.id) && `!bg-teal-700`}/>
            }) : <p>No hay articulos de linea</p>}
          </div>
          <div className="grid md:grid-cols-2 gap-4 content-start text-white">
            <h3 className="md:col-span-2 text-2xl text-white">Articulos personalizados</h3>
            {cut?.articles?.filter(a => cut?.order ? !a.common : false)?.length ? cut?.articles?.filter(a => cut?.order ? !a.common : false)?.map(article => {
              const workshopOrderWithArticle = cut?.workshopOrders?.find(o => o?.articles?.some(art => art?.customArticle == article?.customArticle?._id))
              if (workshopOrderWithArticle) {
                const wArticle = workshopOrderWithArticle?.articles?.find(art => art?.customArticle == article?.customArticle?._id)
                article.quantity = wArticle?.quantity || 0
                article.booked = wArticle?.booked || 0
              }
              let articleCard = { ...article }
              articleCard.quantity = Number(articleCard.quantity) - Number(articleCard.booked)
              articleCard = { ...articleCard, ...articleCard.customArticle, id: articleCard?._id }
              return <ArticleCard quantityLocalNoControl key={articleCard?.id} onClickArticle={() => toggleFromSelectedArticles(articleCard)} article={articleCard} customArticle={articleCard} stockNoShow stockNoControl quantityNoControl forCut bookedQuantity hoverEffect={workshop ? true : false} className={selectedArticles?.some(art => art?._id == articleCard?.id) && `!bg-teal-700`}/>
            }) : <p>No hay articulos personalizados</p>}
          </div>
        </section>
      ) : (
        <Oval />
      )}
    </Main>
  )
}

export default Cut