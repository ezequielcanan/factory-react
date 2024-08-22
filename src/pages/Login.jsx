import { useContext, useState } from "react"
import { UserContext } from "../context/UserContext"
import Main from "../containers/Main"
import Input from "../components/Input"
import { useForm } from "react-hook-form"
import customAxios from "../config/axios.config"

const Login = () => {
  const {setUser} = useContext(UserContext)
  const [visible, setVisible] = useState(false)
  const [login, setLogin] = useState(true)
  const {register, handleSubmit} = useForm()
  
  const onSubmit = handleSubmit(async data => {
    if (!login) {
      console.log(data)
      await customAxios.post("/auth/register", data)
    }
  })

  return (
    <Main className={"grid grid-cols-2 items-center custom-background justify-items-center"}>
      <section>
        <h1 className="text-6xl text-white font-bold">Adminstracion<br/> de la fábrica</h1>
      </section>
      <section className="flex flex-col gap-y-12 text-white">
        <h2 className="text-4xl">{login ? "Iniciar sesion" : "Registrarse"}</h2>
        <form action="" className="flex flex-col gap-y-6" onSubmit={onSubmit}>
          {!login && <Input placeholder="Nombre" register={register("username")}/>}
          <Input placeholder="Email" register={register("email")}/>
          <Input placeholder="Contraseña" register={register("password")} type="password">
          </Input>
          <div className="flex flex-col gap-y-2">
            <p className="duration-300 hover:text-important w-full cursor-pointer select-none" onClick={() => setLogin(!login)}>{login ? "No tienes una cuenta? Registrate" : "Ya tienes una cuenta? Inicia sesion"}</p>
            <button className="bg-action p-2 rounded-lg text-2xl">Ingresar</button>
          </div>
        </form>
      </section>
    </Main>
  )
}

export default Login