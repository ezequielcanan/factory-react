import { useNavigate, useParams } from "react-router-dom"
import Main from "../containers/Main"
import { useEffect, useState } from "react"
import customAxios from "../config/axios.config"
import Title from "../components/Title"
import Button from "../components/Button"
import ArticleCard from "../components/ArticleCard"
import moment from "moment"
import Label from "../components/Label"
import Input from "../components/Input"
import { Oval } from "react-loader-spinner"
import { useForm } from "react-hook-form"
import { FaTrashAlt } from "react-icons/fa"
import Swal from "sweetalert2"
import { AnimatePresence, motion } from "framer-motion"
import Screen from "../components/Screen"


const WorkshopOrder = () => {
  const [workshopOrder, setWorkshopOrder] = useState(null)
  const [receiving, setReceiving] = useState(false)
  const [articles, setArticles] = useState([])
  const [commonArticles, setCommonArticles] = useState([])
  const [customArticles, setCustomArticles] = useState([])
  const [allArticles, setAllArticles] = useState([])
  const [reload, setReload] = useState(false)
  const { register, handleSubmit } = useForm()
  const [edit, setEdit] = useState(false)
  const navigate = useNavigate()
  const { oid } = useParams()

  useEffect(() => {
    customAxios.get(`/workshop-order/${oid}`).then(res => {
      setWorkshopOrder({...res?.data})
      const common = res?.data?.articles?.filter(a => a?.article) || []
      const custom = res?.data?.articles?.filter(a => a?.customArticle) || []
      setCommonArticles([...common])
      setCustomArticles([...custom])
      setAllArticles([...common, ...custom])
    })
  }, [reload])

  /*useEffect(() => {
    if (receiving) {
      // Añadir clase overflow-hidden al html para desactivar el scroll
      document.documentElement.classList.add('overflow-hidden');
    } else {
      // Quitar clase overflow-hidden para habilitar el scroll
      document.documentElement.classList.remove('overflow-hidden');
    }

    // Limpiar efecto al desmontar componente
    return () => {
      document.documentElement.classList.remove('overflow-hidden');
    };
  }, [receiving]);*/

  const changePrice = async (e) => {
    await customAxios.put(`/workshop-order/${oid}`, { price: e?.target?.value })
  }

  const receiveFromWorkShop = async () => {
    setArticles(allArticles.map(a => {return {...a, receiving: (workshopOrder?.cut?.order ? (Number(a.quantity) - Number(a.booked)) : Number(a?.quantity)) - Number(a?.received || 0)}}))
    setReceiving(true)
    /*await customAxios.put(`/workshop-order/receive/${oid}`)
    workshopOrder?.cut?.order ? navigate(`/orders/${workshopOrder?.cut?.order?._id}`) : navigate(`/articles`)*/
  }

  const onConfirmDescription = handleSubmit(async data => {
    await customAxios.put(`/workshop-order/${oid}`, data)
    setEdit(!edit)
    setReload(!reload)
  })


  

  const deleteWorkshopOrder = async () => {
    Swal.fire({
      title: "<strong>CUIDADO: Vas a borrar la orden en taller</strong>",
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
        await customAxios.delete(`/workshop-order/${oid}`)
        navigate("/workshop-orders")
      }
    });
  }

  const handleConfirmReceivingArticles = async () => {
    await customAxios.put(`/workshop-order/receive/${oid}`, articles)
    navigate(`/workshop-orders`)
  }

  return (
    <Main className={`grid grid-cols-1 items-center content-start lg:grid-cols-2 gap-y-16 gap-8 ${receiving && "!overflow-hidden"} relative`}>
      {workshopOrder ? (
        <>
          <Title className={"text-center lg:text-start"} text={`Taller: ${workshopOrder?.workshop?.name}`} />
          <div className="items-center flex justify-center lg:justify-end gap-4 flex-wrap text-white">
            <FaTrashAlt className="text-2xl cursor-pointer" onClick={deleteWorkshopOrder} />
            {!workshopOrder?.deliveryDate ? <Button className="font-bold p-4 px-6 lg:justify-self-end" onClick={receiveFromWorkShop}>Recibido</Button> : <p className="font-bold text-white text-2xl lg:justify-self-end">Recibido: {moment(workshopOrder?.deliveryDate).format("DD-MM-YYYY")}</p>}
          </div>
          <div className="flex flex-col items-start text-white gap-y-4 lg:col-span-2">
            <p className="text-2xl">Corte N°: {workshopOrder?.cut?.order?.orderNumber}</p>
            <p className="text-2xl">Fecha de salida: {moment(workshopOrder?.date).format("DD-MM-YYYY")}</p>
            <p className="text-2xl">Direccion: {workshopOrder?.workshop?.address}</p>
            <p className="text-2xl">Telefono: {workshopOrder?.workshop?.phone}</p>
          </div>
          <div className="flex flex-col lg:col-span-2 gap-8">
            <Input textarea className={"w-full"} register={register("detail")} disabled={!edit} defaultValue={workshopOrder?.detail} />
            <Button onClick={!edit ? () => setEdit(true) : onConfirmDescription} className={"self-start"}>{edit ? "Confirmar" : "Editar"}</Button>
          </div>
          <div className="grid md:grid-cols-2 gap-4 self-start content-start text-white">
            <h3 className="md:col-span-2 text-2xl text-white">Articulos de linea</h3>
            {commonArticles?.length ? commonArticles?.map(article => {
              let articleCard = { ...article }
              articleCard.quantity = workshopOrder?.cut?.order ? (Number(articleCard.quantity) - Number(articleCard.booked)) : Number(articleCard?.quantity)
              articleCard = { ...articleCard, ...articleCard.article }
              return <ArticleCard article={articleCard} stockNoShow stockNoControl receivingNoControl quantityNoControl quantityLocalNoControl forCut bookedQuantity hoverEffect={false} />
            }) : <p>No hay articulos de linea</p>}
          </div>
          <div className="grid md:grid-cols-2 gap-4 self-start content-start text-white">
            <h3 className="md:col-span-2 text-2xl text-white">Articulos personalizados</h3>
            {customArticles?.length ? customArticles?.map(article => {
              let articleCard = { ...article }
              articleCard.quantity = Number(articleCard.quantity) - Number(articleCard.booked)
              articleCard = { ...articleCard, ...articleCard.customArticle }
              return <ArticleCard article={articleCard} customArticle={articleCard} receivingNoControl stockNoShow stockNoControl quantityNoControl quantityLocalNoControl forCut bookedQuantity hoverEffect={false} />
            }) : <p>No hay articulos personalizados</p>}
          </div>
        </>
      ) : (
        <Oval />
      )}
      <AnimatePresence>
        {receiving ? (
          <Screen>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.1 }} style={{ transformOrigin: "center" }} className={`mb-[10rem] grid md:grid-cols-${allArticles?.length > 1 ? "2" : "1"} gap-4 justify-center content-center overflow-y-auto text-white`}>
              {allArticles?.length ? allArticles?.map(article => {
                let articleCard = { ...article }
                articleCard.quantity = workshopOrder?.cut?.order ? (Number(articleCard.quantity) - Number(articleCard.booked)) : Number(articleCard?.quantity)
                articleCard = { ...articleCard, ...articleCard[articleCard?.article ? "article" : "customArticle"] }
                articleCard.receiving = articleCard?.quantity - Number(articleCard?.received || 0)
                const props = {}
                if (article?.customArticle) {
                  props["customArticle"] = articleCard
                }
                return <ArticleCard article={articleCard} {...props} articles={articles} setArticles={setArticles} receivingNoControl={false} stockNoShow stockNoControl quantityNoControl quantityLocalNoControl forCut bookedQuantity hoverEffect={false} />
              }) : <p>No hay articulos</p>}
              <div className={`md:col-span-${allArticles?.length > 1 ? "2" : "1"} col-span-1 flex justify-start items-center gap-4 flex-wrap`}>
                <Button className={"bg-red-600 hover:bg-red-700"} onClick={() => (setReceiving(false), setArticles([]))}>Cancelar</Button>
                <Button onClick={handleConfirmReceivingArticles}>Confirmar</Button>
              </div>
            </motion.div>
          </Screen>
        ) : null}
      </AnimatePresence>
    </Main>
  )
}

export default WorkshopOrder