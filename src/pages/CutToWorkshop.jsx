import { Link, useParams } from "react-router-dom"
import Main from "../containers/Main"
import Button from "../components/Button"
import Title from "../components/Title"
import WorkshopsContainer from "../containers/WorkshopsContainer"
import { useState } from "react"

const CutToWorkshop = () => {
  const [workshop, setWorkshop] = useState(null)
  const [selectWorkshop, setSelectWorkshop] = useState(true)
  const {cid} = useParams()
  return (
    <Main className={"flex flex-col items-center gap-y-16"}>
      <Title text={"Pasar corte a un taller"} className={``}/>
      {workshop && (
        <div className="grid xl:grid-cols-4 gap-4 items-center w-full text-xl justify-items-center">
          <Button className={"px-2 sm:px-4 text-lg sm:text-2xl sm:min-w-[150px] bg-third"} onClick={() => setSelectWorkshop(s => !s)}>{workshop?.name || <FaChevronDown />}</Button>
          <p className="text-white">Telefono: {workshop?.phone}</p>
          <p className="text-white">Direccion: {workshop?.address}</p>
          <Button>Confirmar</Button>
        </div>
      )}
      {selectWorkshop && <WorkshopsContainer containerClassName={"w-full max-h-[600px] overflow-y-auto"} onClickWorkshop={(c) => (setWorkshop(c), setSelectWorkshop(false))}/>}
    </Main>
  )
}

export default CutToWorkshop