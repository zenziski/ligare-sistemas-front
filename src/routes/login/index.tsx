import { Flex, Image, Text } from "@chakra-ui/react"
import { AppInput } from "../../components/Input"
import { FormButton } from "../../components/Button"

function Login() {
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
                        <AppInput placeholder="Seu Email" type="email" />
                        <AppInput placeholder="Sua Senha" type="password" />

                        <FormButton onClick={() => { }}>Entrar</FormButton>
                    </Flex>
                </form>
            </Flex>
        </Flex>
    )
}

export default Login