import { Flex, Image, Text, useToast } from "@chakra-ui/react"
import { AppInput } from "../../components/Input"
import { FormButton } from "../../components/Button"
import { useState } from "react"
import { login } from "../../stores/login/service"

function Login() {

    const toast = useToast()

    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)

    const handleSubmit = async () => {
        if (!email || !password) {
            toast({
                title: "Preencha todos os campos",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top-right"
            })
            return
        }
        setLoading(true)
        try {
            const response = await login({ email, password })
            if (response?.token) {
                localStorage.setItem("token", response?.token)
                window.location.href = "/home"
            }
        } catch (error) {
            console.log(error)
            toast({
                title: "Erro ao logar",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top-right"
            })
        } finally {
            setLoading(false)
        }

    }

    return (
        <Flex w="100%" h="100vh" direction="row">
            <Flex w="65%">
                <Image
                    src="./home1.jpg"
                    sx={{
                        filter: "grayscale(100%) blur(2px)",
                    }}
                />
            </Flex>
            <Flex w="35%" direction="column" align="center" justify="center">
                <Text fontSize="32px" textAlign="center" mb="35px">
                    Login
                </Text>
                <form style={{ width: "50%" }}>
                    <Flex direction="column" gap="16px" alignItems="stretch">
                        <AppInput
                            placeholder="Seu Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <AppInput
                            placeholder="Sua Senha"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <FormButton
                            onClick={() => handleSubmit()}
                            isLoading={loading}
                        >Entrar</FormButton>
                    </Flex>
                </form>
            </Flex>
        </Flex>
    )
}

export default Login