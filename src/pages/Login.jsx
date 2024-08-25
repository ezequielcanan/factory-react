import { useContext, useState } from "react"
import { UserContext } from "../context/UserContext"
import Main from "../containers/Main"
import Input from "../components/Input"
import { useForm } from "react-hook-form"
import customAxios from "../config/axios.config"
import { useNavigate } from "react-router-dom"
import Button from "../components/Button"

const Login = () => {
  const {setUser} = useContext(UserContext)
  const [login, setLogin] = useState(true)
  const navigate = useNavigate()
  const {register, handleSubmit, reset} = useForm()
  
  const onSubmit = handleSubmit(async data => {
    const result = await customAxios.post(`/auth/${!login ? "register" : "login"}`, data)
    if (login) {
      customAxios.defaults.headers.common['Authorization'] = `Bearer ${result?.data?.access_token}`;
      localStorage.setItem('token', customAxios.defaults.headers.common['Authorization']);
      setUser(true)
      navigate("/")
    } else {
      reset()
      setLogin(!login)
    }
  })

  return (
    <Main className={"grid md:grid-cols-2 items-center custom-background justify-items-center"}>
      <section className="flex flex-col items-center gap-y-8">
       <img src="arcan.png" alt="" className="w-3/4"/>
       <img src="cattown.png" alt="" className="w-3/4"/>
      </section>
      <section className="flex flex-col gap-y-12 text-white">
        <h2 className="text-4xl">{login ? "Iniciar sesion" : "Registrarse"}</h2>
        <form action="" className="flex flex-col gap-y-6" onSubmit={onSubmit}>
          {!login && <Input placeholder="Nombre" register={register("username")}/>}
          <Input placeholder="Email" register={register("email")}/>
          <Input placeholder="Contraseña" register={register("password")} type="password"/>
          <div className="flex flex-col gap-y-2">
            <p className="duration-300 hover:text-important w-full cursor-pointer select-none" onClick={() => setLogin(!login)}>{login ? "No tienes una cuenta? Registrate" : "Ya tienes una cuenta? Inicia sesion"}</p>
            <Button>Ingresar</Button>
          </div>
        </form>
      </section>
    </Main>
  )
}

export default Login