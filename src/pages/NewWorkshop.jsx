import Main from "../containers/Main"
import { useForm } from "react-hook-form"
import { useState } from "react"
import WorkshopForm from "../components/WorkshopForm"
import { useNavigate } from "react-router-dom"
import customAxios from "../config/axios.config"

const NewWorkshop = () => {
  const {register, handleSubmit} = useForm()
  const [error, setError] = useState(false)
  const navigate = useNavigate()

  const onSubmit = handleSubmit(async data => {
    try {
      const result = await customAxios.post("/workshops", data)
      navigate("/workshops")
    } catch (e) {
      setError(true)
    }
  })
  return (
    <Main className={"flex items-center justify-center"}>
      <WorkshopForm register={register} onSubmit={onSubmit} error={error}/>
    </Main>
  )
}

export default NewWorkshop