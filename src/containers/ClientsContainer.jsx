import { useEffect, useState } from "react"
import { Oval } from "react-loader-spinner"
import ItemsContainer from "./ItemsContainer"
import customAxios from "../config/axios.config"
import ClientCard from "../components/ClientCard"
import { FaFilter } from "react-icons/fa"
import Input from "../components/Input"

const ClientsContainer = ({ containerClassName, onClickClient }) => {
  const [clients, setClients] = useState(null)
  const [filteredClients, setFilteredClients] = useState(null)
  const [search, setSearch] = useState("")


  useEffect(() => {
    customAxios.get("/clients").then(res => {
      setClients(res?.data)
      setFilteredClients(res?.data)
    })
  }, [])

  useEffect(() => {
    if (clients) {
      let newFilteredClients = [...clients]
      if (search.length) {
        newFilteredClients = newFilteredClients.filter(a => a?.name?.toLowerCase()?.includes(search?.toLowerCase()))
      }
      setFilteredClients(newFilteredClients)
    }
  }, [search])

  return (
    <ItemsContainer className={`${containerClassName}`}>
      <div className="flex flex-col xl:flex-row items-center gap-8 justify-between">
        <FaFilter className="text-white text-3xl" />
        <div>
          <Input placeholder="Buscar..." className={"w-full"} onChange={(e) => setSearch(e?.target?.value)}/>
        </div>
      </div>
      {(clients && filteredClients) ? filteredClients?.length ? filteredClients.map((client) => {
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