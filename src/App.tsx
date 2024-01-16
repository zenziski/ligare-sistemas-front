import Login from "./routes/login"
import "../src/style/index.css"
import { Route, Routes } from "react-router"
import Home from "./routes/home"
import Clientes from "./routes/clientes"

function App() {

  return (
    <Routes>
      <Route path="/">
        <Route index element={<Login />} />
        <Route path="home" element={<Home />} />
        <Route path="clientes" element={<Clientes />} />
      </Route>
    </Routes>
  )
}

export default App
