import { useEffect, useState } from "react"
import Main from "../containers/Main"
import { motion } from "framer-motion"
import customAxios from "../config/axios.config"
import { Oval } from "react-loader-spinner"
import Resume from "../components/Resume"

const Home = () => {
  return (
    <Main className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:grid-rows-3 gap-8"}>
      <Resume/>
      <Resume month/>
      <Resume controls/>
    </Main>
  )
}

export default Home