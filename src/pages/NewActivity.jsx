import Main from "../containers/Main"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import customAxios from "../config/axios.config"
import { useNavigate } from "react-router-dom"
import ActivityForm from "../components/ActivityForm"
import moment from "moment"

const NewActivity = () => {
  const {register, handleSubmit} = useForm()
  const [error, setError] = useState(false)
  const navigate = useNavigate()

  const onSubmit = handleSubmit(async data => {
    try {
      const result = await customAxios.post("/activities", {...data, date: moment(data?.date).add(1, "day").subtract(1, "day")})
      navigate("/logistics")
    } catch (e) {
      setError(true)
    }
  })

  return (
    <Main className={"flex items-center justify-center"}>
      <ActivityForm register={register} error={error} onSubmit={onSubmit}/>
    </Main>
  )
}

export default NewActivity