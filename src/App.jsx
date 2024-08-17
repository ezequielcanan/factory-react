import { UserContextProvider } from "./context/UserContext"
import Router from "./router/Router"

const App = () => {
  return (
   <UserContextProvider>
    <Router/>
   </UserContextProvider>
  )
}

export default App
