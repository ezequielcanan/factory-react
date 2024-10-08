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
  const [edit, setEdit] = useState(false)
  const [reload, setReload] = useState(false)
  const { register, handleSubmit } = useForm()
  const { cid } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    customAxios.get(`/cuts/${cid}`).then(res => {
      const articles = (res?.data?.items?.length ? res?.data?.items : (res?.data?.order ? res?.data?.order?.articles : res?.data?.manualItems))?.filter(a => res?.data?.order ? (a.hasToBeCut && a.quantity > a.booked) : true)
      setCut({ ...res?.data, articles })
    })
  }, [reload])

  const cutToWorkshop = async () => {
    await customAxios.post("/workshop-order", { workshop: workshop?._id, cut: cid, date: moment() })
    setPassToWorkshop(false)
    setWorkshop(false)
    setReload(!reload)
  }

  const onConfirmDescription = handleSubmit(async data => {
    await customAxios.put(`/cuts/${cid}?property=description&value=${data?.description}`)
    setEdit(!edit)
    setReload(!reload)
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

  return (
    <Main>
      {cut ? (
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-y-16 gap-8">
          <Title text={"Orden de corte"} className={`text-center xl:text-start`} />
          <div className="flex gap-4 flex-wrap justify-center xl:justify-end text-white items-center wrap-reverse">
            {cut?.manualItems?.length ? <FaTrashAlt className="text-2xl cursor-pointer" onClick={deleteCut} /> : null}
            {!cut?.workshopOrder ? (
              <Button className={"flex items-center justify-between gap-2 justify-self-center xl:justify-self-end"} onClick={() => setPassToWorkshop(a => !a)}>Pasar a un taller <BiTransferAlt /></Button>
            ) : (
              <Link to={`/workshop-orders/${cut?.workshopOrder?._id}`} className="justify-self-center xl:justify-self-end"><Button>{cut?.workshopOrder?.deliveryDate ? `Recibido: ${moment(cut?.workshopOrder?.deliveryDate)?.format("DD-MM-YYYY")}` : `En taller`}</Button></Link>
            )}
          </div>
          {workshop ? (
            <div className="grid xl:grid-cols-4 gap-4 items-center w-full text-xl justify-items-center xl:justify-items-start xl:col-span-2">
              <p className="text-white text-center text-2xl">Taller: {workshop?.name}</p>
              <p className="text-white text-center text-2xl">Telefono: {workshop?.phone}</p>
              <p className="text-white text-center text-2xl">Direccion: {workshop?.address}</p>
              <div className="xl:justify-self-end flex justify-center gap-4 flex-wrap">
                <Button className={"bg-red-600 hover:bg-red-700"} onClick={() => (setWorkshop(null), setPassToWorkshop(false))}>Cancelar</Button>
                <Button className={""} onClick={cutToWorkshop}>Confirmar</Button>
              </div>
            </div>
          ) : null}
          <div className="flex flex-col xl:col-span-2 gap-8">
            <Input textarea className={"w-full"} register={register("description")} disabled={!edit} defaultValue={cut?.description || ""} />
            <Button onClick={!edit ? () => setEdit(true) : onConfirmDescription} className={"self-start"}>{edit ? "Confirmar" : "Editar"}</Button>
          </div>
          {passToWorkshop && <WorkshopsContainer containerClassName={"max-h-[30rem] h-full overflow-y-auto auto-rows-auto xl:col-span-2"} onClickWorkshop={(c) => (setWorkshop(c), setPassToWorkshop(false))} />}
          <div className="grid md:grid-cols-2 gap-4 content-start text-white">
            <h3 className="md:col-span-2 text-2xl text-white">Articulos de linea</h3>
            {cut?.articles?.filter(a => cut?.order ? a.common : true)?.length ? cut?.articles?.filter(a => cut?.order ? a.common : true)?.map(article => {
              let articleCard = { ...article }
              articleCard.quantity = cut?.order ? (Number(articleCard.quantity) - Number(articleCard.booked)) : Number(articleCard?.quantity)
              articleCard = { ...articleCard, ...articleCard.article }
              return <ArticleCard quantityLocalNoControl article={articleCard} stockNoShow stockNoControl quantityNoControl forCut bookedQuantity hoverEffect={false} />
            }) : <p>No hay articulos de linea</p>}
          </div>
          <div className="grid md:grid-cols-2 gap-4 content-start text-white">
            <h3 className="md:col-span-2 text-2xl text-white">Articulos personalizados</h3>
            {cut?.articles?.filter(a => cut?.order ? !a.common : false)?.length ? cut?.articles?.filter(a => cut?.order ? !a.common : false)?.map(article => {
              let articleCard = { ...article }
              articleCard.quantity = Number(articleCard.quantity) - Number(articleCard.booked)
              articleCard = { ...articleCard, ...articleCard.customArticle }
              console.log(articleCard)
              return <ArticleCard quantityLocalNoControl article={articleCard} customArticle={articleCard} stockNoShow stockNoControl quantityNoControl forCut bookedQuantity hoverEffect={false} />
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