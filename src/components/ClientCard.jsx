import { motion } from "framer-motion"

const ClientCard = ({client}) => {
  return (
    <motion.div initial={{height: 0, opacity: 0}} transition={{duration: 0.5}} animate={{height: "auto", opacity: 1}} className="flex p-8 flex-col items-center justify-center text-white rounded-lg bg-secondary justify-items-center overflow-hidden">
      <h3 className="font-bold text-2xl">{client.name}</h3>
      <p className="text-lg">{client.phone}</p>
      <p className="text-lg">{client.email}</p>
      <p className="text-lg">{client.cuit}</p>
    </motion.div>
  )
}

export default ClientCard