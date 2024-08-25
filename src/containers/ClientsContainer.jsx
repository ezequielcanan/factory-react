import { useEffect, useState } from "react"
import { Oval } from "react-loader-spinner"
import customAxios from "../config/axios.config"
import ClientCard from "../components/ClientCard"

const ClientsContainer = ({ containerClassName }) => {
  const [clients, setClients] = useState(null)

  useEffect(() => {
    customAxios.get("/clients").then(res => {
      setClients(res?.data)
    })
  }, [])

  return (
    <section className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 bg-third rounded-xl p-8 ${containerClassName}`}>
      {(clients) ? clients?.length ? clients.map((client) => {
        return <ClientCard client={client} key={client?._id}/>
      }) : (
        <p className="text-white text-4xl col-span-4 text-center my-16">No hay articulos que coincidan con los filtros</p>
      ) : (
        <Oval />
      )}
    </section>
  )
}

export default ClientsContainer