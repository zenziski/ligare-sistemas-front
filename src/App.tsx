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
import Ponto from "./routes/ponto"
import DetalhesPonto from "./routes/detalhes-ponto"
import { UserProvider } from "./contexts/UserContext"
import Feriados from "./routes/feriados"

function App() {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<Login />} />
        <Route path="home" element={<UserProvider><Home /></UserProvider>} />
        <Route path="clientes" element={<UserProvider><Clientes /></UserProvider>} />
        <Route path="obras" element={<UserProvider><Obras /></UserProvider>} />
        <Route path="obras/:id" element={<UserProvider><Obra /></UserProvider>} />
        <Route path="usuarios" element={<UserProvider><Usuarios /></UserProvider>} />
        <Route path="fornecedores" element={<UserProvider><Fornecedores /></UserProvider>} />
        <Route path="financeiro" element={<UserProvider><Financeiro /> </UserProvider>} />
        <Route path="livro" element={<UserProvider><Livro /></UserProvider>} />
        <Route path="ponto" element={<UserProvider><Ponto /></UserProvider>} />
        <Route path="detalhes-ponto" element={<UserProvider><DetalhesPonto /></UserProvider>} />
        <Route path="Feriados" element={<UserProvider><Feriados /></UserProvider>} />
      </Route>
    </Routes>
  )
}

export default App;