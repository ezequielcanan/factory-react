import { useEffect, useState } from "react"
import Screen from "./Screen"
import { Link } from "react-router-dom"
import Button from "./Button"
import { BiExit } from "react-icons/bi"
import Input from "./Input"
import moment from "moment"
import customAxios from "../config/axios.config"

const ActivityRow = ({className, title, activity, isOrder = false, setReload}) => {
  const [expanded, setExpanded] = useState(false)
  const [newDate, setNewDate] = useState(moment(activity?.deliveryDate || activity?.date).add(1, "day"))

  useEffect(() => {
    if (expanded) {
      // Añadir clase overflow-hidden al html para desactivar el scroll
      window.scrollTo(0,0)
      document.documentElement.classList.add('overflow-hidden');
    } else {
      // Quitar clase overflow-hidden para habilitar el scroll
      document.documentElement.classList.remove('overflow-hidden');
    }

    // Limpiar efecto al desmontar componente
    return () => {
      document.documentElement.classList.remove('overflow-hidden');
    };
  }, [expanded]);

  const handleDelivered = async () => {
    if (isOrder) {
      await customAxios.put(`/orders/${activity?._id}?property=delivered&value=${activity?.delivered ? "false" : "true"}`)
    }
    setExpanded(false)
    setReload(r => !r)
  }

  const handleDateChange = async () => {
    if (isOrder) {
      await customAxios.put(`/orders/${activity?._id}?property=deliveryDate&value=${newDate}`)
    }
    setExpanded(false)
    setReload(r => !r)
  }

  return <>
    <div className={`p-4 text-sm ${activity?.delivered ? "bg-green-700 hover:bg-green-800" : "hover:bg-blue-500 bg-blue-700"} duration-300 text-white ${className} cursor-pointer`} onClick={() => setExpanded(true)}><p>{title}</p></div>
    {expanded && <Screen className={"!bg-black/90 min-h-full h-full"}>
      <div className="flex flex-col gap-y-8 items-center overflow-y-auto max-h-[80%] py-6 px-2 w-full">
        {isOrder ? (
          <> 
            <div className="text-2xl font-bold flex flex-wrap gap-4 items-center justify-center">
              <h2>Entrega de pedido </h2>
              <Link to={`/orders/${activity?._id}`} className="p-2 bg-blue-800 duration-300 hover:bg-blue-600">N° {activity?.orderNumber}</Link>
            </div>
            <p className="text-lg">{activity?.client?.name}</p>
            <p className="text-lg">Telefono: {activity?.client?.phone}</p>
            <p className="text-lg">Email: {activity?.client?.email}</p>
            <p className="text-lg">Cuit: {activity?.client?.cuit}</p>
            <p className="text-lg">Direccion: {activity?.client?.address}</p>
            <p className="text-lg">Referencia: {activity?.client?.detail}</p>
            <p className="text-lg">Expreso: {activity?.client?.expreso}</p>
            <p className="text-lg">Direccion de expreso: {activity?.client?.expresoAddress}</p>
            <p className="text-lg">Informacion extra / Anotaciones: {activity?.extraInfo}</p>
          </>
        ) : null}
        <Button className={"flex items-center gap-4"} onClick={() => setExpanded(false)}>Salir <BiExit/></Button>
        <Button className={`flex items-center gap-4 ${!activity?.delivered ? "bg-green-700 hover:!bg-green-800" : "bg-red-600 hover:bg-red-800"}`} onClick={handleDelivered}>{!activity?.delivered ? "Realizado" : "Deshacer"}</Button>
        <div className="flex flex-wrap items-center gap-4 justify-center">
          <Button className={"flex items-center gap-4 bg-red-600 hover:bg-red-800"} onClick={handleDateChange}>Posponer</Button>
          <Input type="date" defaultValue={newDate?.format("YYYY-MM-DD")} onChange={e => setNewDate(moment(e?.target?.value))}/>
        </div>
      </div>
    </Screen>}
  </>
}

export default ActivityRow