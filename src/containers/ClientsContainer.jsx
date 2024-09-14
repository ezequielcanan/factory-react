import { useEffect, useState } from "react"
import { Oval } from "react-loader-spinner"
import ItemsContainer from "./ItemsContainer"
import customAxios from "../config/axios.config"
import ClientCard from "../components/ClientCard"

const ClientsContainer = ({ containerClassName, onClickClient }) => {
  const [clients, setClients] = useState(null)

  useEffect(() => {
    customAxios.get("/clients").then(res => {
      setClients(res?.data)
    })
  }, [])

  return (
    <ItemsContainer className={`${containerClassName}`}>
      {(clients) ? clients?.length ? clients.map((client) => {
        return <ClientCard client={client} key={client?._id} onClickClient={onClickClient}/>
      }) : (
        <p className="text-white text-4xl col-span-6 text-center my-16">No hay clientes</p>
      ) : (
        <Oval />
      )}
    </ItemsContainer>
  )
}

export default ClientsContainer