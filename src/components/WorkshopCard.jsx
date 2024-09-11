import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

const WorkshopCard = ({workshop, onClickWorkshop}) => {
  const navigate = useNavigate()
  return (
    <motion.div onClick={() => (onClickWorkshop ? onClickWorkshop(workshop) : navigate(`/workshops/${workshop?._id}`))} initial={{opacity: 0}} transition={{duration: 0.5}} animate={{opacity: 1}} className="flex flex-col min-h-[200px] items-center duration-300 hover:bg-primary justify-center text-white rounded-lg bg-secondary justify-items-center overflow-hidden row-span-1 py-4 md:py-8">
      <h3 className="font-bold text-2xl pt-8 text-center mb-4 sm:mb-0">{workshop.name}</h3>
      <p className="text-lg px-8">{workshop.phone}</p>
      <p className="text-lg px-8 pb-8">{workshop.address}</p>
    </motion.div>
  )
}

export default WorkshopCard