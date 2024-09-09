import { useEffect, useState } from "react"
import { Oval } from "react-loader-spinner"
import ItemsContainer from "./ItemsContainer"
import customAxios from "../config/axios.config"
import ClientCard from "../components/ClientCard"

const WorkshopsContainer = ({ containerClassName, onClickClient }) => {
  const [workshops, setWorkshops] = useState(null)

  useEffect(() => {
    customAxios.get("/workshops").then(res => {
      setClients(res?.data)
    }).catch(e => setWorkshops([]))
  }, [])

  return (
    <ItemsContainer className={`${containerClassName}`}>
      {(workshops) ? workshops?.length ? workshops.map((client) => {
        return <ClientCard />
      }) : (
        <p className="text-white text-4xl col-span-5 text-center my-16">No hay talleres</p>
      ) : (
        <Oval />
      )}
    </ItemsContainer>
  )
}

export default WorkshopsContainer