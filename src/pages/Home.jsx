import Main from "../containers/Main"
import { motion } from "framer-motion"

const Home = () => {
  return (
    <Main className={"grid md:grid-cols-2 lg:grid-cols-3 md:grid-rows-3 gap-8"}>
      <motion.section initial={{height: 0, opacity: 0}} animate={{height: "auto", opacity: 1}} transition={{duration: 0.5}} className="bg-third rounded-lg border-2 border-cyan-500 row-span-2 shadow-[0_0px_10px_1px_rgba(0,255,255,0.8)]">
        <h2 className="text-3xl text-white font-bold p-4">Ultima semana</h2>
      </motion.section>
      <motion.section initial={{height: 0, opacity: 0}} animate={{height: "auto", opacity: 1}} transition={{duration: 0.5}} className="bg-third rounded-lg border-2 border-cyan-500 row-span-2 shadow-[0_0px_10px_1px_rgba(0,255,255,0.8)]">
        <h2 className="text-3xl text-white font-bold p-4">Ultimo mes</h2>
      </motion.section>
    </Main>
  )
}

export default Home