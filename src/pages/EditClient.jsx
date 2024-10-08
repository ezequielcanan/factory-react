import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import customAxios from "../config/axios.config"
import Main from "../containers/Main"
import ClientForm from "../components/ClientForm"
import { Oval } from "react-loader-spinner"

const EditClient = () => {
  const [client, setClient] = useState(null)
  const {register, handleSubmit} = useForm()
  const navigate = useNavigate()
  const {cid} = useParams()

  useEffect(() => {
    customAxios.get(`/clients/${cid}`).then(res => {
      setClient(res?.data)
    })
  }, [])

  const onSubmit = handleSubmit(async data => {
    const result = await customAxios.put(`/clients/${cid}`, {...data, discount: data?.discount / 100})
    navigate("/clients")
  })

  return (
    <Main className={"flex items-center justify-center"}>
      {client ? (
        <ClientForm newClient={false} register={register} onSubmit={onSubmit} client={client}/>
      ) : (
        <Oval/>
      )}
    </Main>
  )
}

export default EditClient