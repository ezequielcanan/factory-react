import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

const ClientCard = ({client}) => {
  const navigate = useNavigate()
  return (
    <motion.div onClick={() => navigate(`/clients/${client?._id}`)} initial={{height: 0, opacity: 0}} transition={{duration: 0.5}} animate={{height: "auto", opacity: 1}} className="flex flex-col items-center duration-300 hover:bg-primary justify-center text-white rounded-lg bg-secondary justify-items-center overflow-hidden">
      <h3 className="font-bold text-2xl pt-8">{client.name}</h3>
      <p className="text-lg px-8">{client.phone}</p>
      <p className="text-lg px-8">{client.email}</p>
      <p className="text-lg px-8 pb-8">{client.cuit}</p>
    </motion.div>
  )
}

export default ClientCard