import { roles } from "../utils/utils.js"
import { RxCross2 } from "react-icons/rx"
import SelectInput from "./SelectInput"
import { FaCheck } from "react-icons/fa"
import customAxios from "../config/axios.config.js"

const UserCard = ({ user, setReload }) => {

  const toggleRole = async (option) => {
    await customAxios.put(`/users/toggle/${user?._id}?role=${option?.value}`)
    setReload(a => !a)
  }

  return (
    <div className="flex flex-col gap-y-4 bg-third rounded p-4">
      <h3 className="text-2xl font-bold text-white">{user?.username}</h3>
      <p className="text-lg text-white">{user?.email}</p>
      <div className="flex flex-wrap gap-4">
        {roles?.map((role, i) => {
          return <div key={`role${i}${role.text}user${user?._id}`} className="text-lg flex items-center gap-x-2 bg-primary px-4 py-2 text-white cursor-pointer" onClick={() => toggleRole(role)}>
            <p>{role.text}</p>
            {user?.roles?.includes(role?.value) ? <FaCheck/> : <RxCross2 />}
          </div>
        })}
      </div>
    </div>
  )
}

export default UserCard