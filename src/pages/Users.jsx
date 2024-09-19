import { useEffect, useState } from "react"
import Main from "../containers/Main"
import customAxios from "../config/axios.config"
import Title from "../components/Title"
import { Oval } from "react-loader-spinner"
import UserCard from "../components/UserCard"

const Users = () => {
  const [users, setUsers] = useState(null)

  useEffect(() => {
    customAxios.get(`/users`).then(res => {
      setUsers(res?.data)
    })
  }, [])

  return (
    <Main className={"grid lg:grid-cols-4 gap-8 content-start"}>
      <Title text={"Usuarios"} className={"lg:col-span-4"}/>
      {users ? (
        users.map(user => {
          return (
            <UserCard user={user} key={user?._id}/>
          )
        })
      ) : (
        <Oval/>
      )}
    </Main>
  )
}

export default Users