import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import customAxios from "../config/axios.config"
import Main from "../containers/Main"
import { Oval } from "react-loader-spinner"
import WorkshopForm from "../components/WorkshopForm"

const EditWorkshop = () => {
  const [workshop, setWorkshop] = useState(null)
  const {register, handleSubmit} = useForm()
  const navigate = useNavigate()
  const {wid} = useParams()

  useEffect(() => {
    customAxios.get(`/workshops/${wid}`).then(res => {
      setWorkshop(res?.data)
    })
  }, [])

  const onSubmit = handleSubmit(async data => {
    const result = await customAxios.put(`/workshops/${wid}`, data)
    navigate("/workshops")
  })

  return (
    <Main className={"flex items-center justify-center"}>
      {workshop ? (
        <WorkshopForm newWorkshop={false} register={register} onSubmit={onSubmit} workshop={workshop}/>
      ) : (
        <Oval/>
      )}
    </Main>
  )
}

export default EditWorkshop