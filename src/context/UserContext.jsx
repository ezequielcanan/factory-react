import { createContext, useState, useEffect } from "react"
import CookiesJs from "js-cookie"
import customAxios from "../config/axios.config.js"

export const UserContext = createContext()

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(localStorage.getItem("token") ? true : false)
  const [userData, setUserData] = useState(false)
  
  useEffect(() => {
    if (user) {
      customAxios.defaults.headers.common['Authorization'] = `${localStorage.getItem("token")}`
      customAxios.get(`/auth/current`).then(res => {
        const userObj = res?.data?.payload
        setUserData(userObj)
      })
    }
  }, [])

  const getUser = () => user


  return (
    <UserContext.Provider value={{ user, userData, setUser, getUser }}>
      {children}
    </UserContext.Provider>
  )
}