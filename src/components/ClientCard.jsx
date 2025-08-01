import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

const ClientCard = ({client, onClickClient}) => {
  const navigate = useNavigate()
  return (
    <motion.div onClick={() => (onClickClient ? onClickClient(client) : navigate(`/${!client?.supplier ? "clients" : "suppliers"}/${client?._id}`))} initial={{opacity: 0}} transition={{duration: 0.5}} animate={{opacity: 1}} className="flex flex-col items-center py-4 duration-300 hover:bg-primary justify-center text-white rounded-lg bg-secondary justify-items-center overflow-hidden">
      <h3 className="font-bold text-lg text-center mb-4 sm:mb-0">{client.name}</h3>
    </motion.div>
  )
}

export default ClientCard