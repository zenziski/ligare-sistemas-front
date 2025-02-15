import { Button, CircularProgress, Flex } from "@chakra-ui/react"
import Sidebar from "../../components/Sidebar"
import { useEffect, useState } from "react"
import { useToast } from "@chakra-ui/react"
import { TimeIcon } from "@chakra-ui/icons"
import { registrarPonto } from "../../stores/ponto/service"

const Ponto = () => {

    const [loading, setLoading] = useState<boolean>(false)
    const [time, setTime] = useState(new Date());

    const toast = useToast()

    const handleRegistrarPonto = async () => {
        setLoading(true)
        try {
            await registrarPonto()
            toast({
                title: "Ponto registrado com sucesso",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top-right"

            })
            window.location.href = "/detalhes-ponto"
        } catch (error) {
            toast({
                title: "Erro ao registrar ponto",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-right"
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <Sidebar>
            <Flex
                height="100vh"
                width="100%"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                gap={5}
            >
                <Flex
                    fontSize="32px"
                    fontWeight="bold"
                >
                    {time.toLocaleTimeString()}
                </Flex>
                <Button
                    size="lg"
                    isLoading={loading}
                    onClick={handleRegistrarPonto}
                >
                    Registrar Ponto
                    {
                        loading ? <CircularProgress ml={'10px'} isIndeterminate color="gray.500" size={5} /> : <TimeIcon ml="10px" />
                    }

                </Button>
            </Flex>
        </Sidebar>
    )
}

export default Ponto