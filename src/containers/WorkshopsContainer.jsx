import { useEffect, useState } from "react"
import { Oval } from "react-loader-spinner"
import ItemsContainer from "./ItemsContainer"
import customAxios from "../config/axios.config"
import ClientCard from "../components/ClientCard"
import WorkshopCard from "../components/WorkshopCard"

const WorkshopsContainer = ({ containerClassName, onClickWorkshop }) => {
  const [workshops, setWorkshops] = useState(null)

  useEffect(() => {
    customAxios.get("/workshops").then(res => {
      setWorkshops(res?.data)
    }).catch(e => setWorkshops([]))
  }, [])

  return (
    <ItemsContainer className={`${containerClassName}`}>
      {(workshops) ? workshops?.length ? workshops.map((workshop) => {
        return <WorkshopCard workshop={workshop} onClickWorkshop={onClickWorkshop}/>
      }) : (
        <p className="text-white text-4xl col-span-6 text-center my-16">No hay talleres</p>
      ) : (
        <Oval />
      )}
    </ItemsContainer>
  )
}

export default WorkshopsContainer