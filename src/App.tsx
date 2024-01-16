import Login from "./routes/login"
import "../src/style/index.css"
import { Route, Routes } from "react-router"

function App() {

  return (
    <Routes>
      <Route path="/">
        <Route index element={<Login />} />
        <Route path="teste" element={<>iuuuuu</>} />
      </Route>
    </Routes>
  )
}

export default App
