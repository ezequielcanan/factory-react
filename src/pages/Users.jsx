import { useEffect, useState } from "react"
import Main from "../containers/Main"
import customAxios from "../config/axios.config"
import Title from "../components/Title"
import { Oval } from "react-loader-spinner"
import UserCard from "../components/UserCard"

const Users = () => {
  const [users, setUsers] = useState(null)
  const [reload, setReload] = useState(false)

  useEffect(() => {
    customAxios.get(`/users`).then(res => {
      setUsers(res?.data)
    })
  }, [reload])

  return (
    <Main className={"grid md:grid-cols-2 lg:grid-cols-4 gap-8 content-start overflow-hidden"}>
      <Title text={"Usuarios"} className={"md:col-span-2 lg:col-span-4"}/>
      {users ? (
        users.map(user => {
          return (
            <UserCard user={user} key={user?._id} setReload={setReload}/>
          )
        })
      ) : (
        <Oval/>
      )}
    </Main>
  )
}

export default Users