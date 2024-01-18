import { useParams } from "react-router-dom"
import Sidebar from "../../components/Sidebar"

const Obra = () => {
    const { id } = useParams()
    return (
        <Sidebar>
            Obra {id}
        </Sidebar>
    )
}

export default Obra