import Login from "./routes/login"
import "../src/style/index.css"
import { Route, Routes } from "react-router"
import Home from "./routes/home"
import Clientes from "./routes/clientes"
import Obras from "./routes/obras"
import Obra from "./routes/obra"
import Usuarios from "./routes/usuarios"
import Fornecedores from "./routes/fornecedores"
import Financeiro from "./routes/financeiro"
import Livro from "./routes/financeiro/Livro"

function App() {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<Login />} />
        <Route path="home" element={<Home />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="obras" element={<Obras />} />
        <Route path="obras/:id" element={<Obra />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="fornecedores" element={<Fornecedores />} />
        <Route path="financeiro" element={<Financeiro />} />
        <Route path="livro" element={<Livro />} />
      </Route>
    </Routes>
  )
}

export default App;