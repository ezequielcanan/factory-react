import { useForm } from "react-hook-form"
import Main from "../containers/Main"
import Input from "../components/Input"
import Label from "../components/Label"
import Button from "../components/Button"
import { useNavigate } from "react-router-dom"
import customAxios from "../config/axios.config"
import { useState } from "react"
import ClientForm from "../components/ClientForm"

const NewClient = () => {
  const {register, handleSubmit} = useForm()
  const [error, setError] = useState(false)
  const navigate = useNavigate()

  const onSubmit = handleSubmit(async data => {
    try {
      const result = await customAxios.post("/clients", {...data, discount: data?.discount / 100})
      navigate("/clients")
    } catch (e) {
      setError(true)
    }
  })

  return (
    <Main className={"flex items-center justify-center"}>
      <ClientForm register={register} onSubmit={onSubmit} error={error}/>
    </Main>
  )
}

export default NewClient