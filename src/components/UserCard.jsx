import { roles } from "../utils/utils.js"
import { RxCross2 } from "react-icons/rx"
import SelectInput from "./SelectInput"

const UserCard = ({ user }) => {

  const addRole = async (option) => {

  }

  return (
    <div className="flex flex-col gap-y-4 bg-third rounded p-4">
      <h3 className="text-2xl font-bold text-white">{user?.username}</h3>
      <p className="text-lg text-white">{user?.email}</p>
      <div className="grid grid-cols-3 gap-4">
        {user?.roles?.length ? user?.roles?.map((role, i) => {
          return <div key={`role${i}${role}user${user?._id}`} className="text-lg flex items-center gap-x-2 bg-primary px-4 py-2 text-white">
            <p>{roles.find(r => r.value == role)?.text}</p>
            <RxCross2 />
          </div>
        }) : <p className="text-white">Desconocido</p>}
        <SelectInput setSelectedOption={addRole} selectedOption={{value: "Agregar permiso", all: true}} options={[{value: "Agregar permiso", all: true}, ...roles.map(r => {return {value: r?.text}})]} textClassName="overflow-hidden" containerClassName={"!text-sm"}/>
      </div>
    </div>
  )
}

export default UserCard