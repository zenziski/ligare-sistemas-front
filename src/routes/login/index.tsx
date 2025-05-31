import {
  Flex,
  Image,
  Text,
  useToast,
  useBreakpointValue,
  Box,
} from "@chakra-ui/react";
import { AppInput } from "../../components/Input";
import { FormButton } from "../../components/Button";
import { useState, useEffect } from "react";
import { login, me } from "../../stores/login/service";

function Login() {
  const toast = useToast();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const isMobile = useBreakpointValue({ base: true, lg: false });
  const formWidth = useBreakpointValue({ base: "90%", md: "70%", lg: "50%" });
  const imageWidth = useBreakpointValue({ base: "0%", lg: "65%" });
  const loginWidth = useBreakpointValue({ base: "100%", lg: "35%" });

  useEffect(() => {
    const fetchAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await me();
        if (response?._id) {
          window.location.href = "/home";
        }
      }
    };

    fetchAuth();
  }, []);

  const handleSubmit = async () => {
    if (!email || !password) {
      toast({
        title: "Preencha todos os campos",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    setLoading(true);
    try {
      const response = await login({ email, password });
      if (response?.token) {
        localStorage.setItem("token", response?.token);
        window.location.href = "/home";
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Erro ao logar",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !loading) {
      event.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    const handleGlobalKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !loading) {
        event.preventDefault();
        handleSubmit();
      }
    };

    document.addEventListener("keypress", handleGlobalKeyPress);
    return () => {
      document.removeEventListener("keypress", handleGlobalKeyPress);
    };
  }, [email, password, loading]);

  if (isMobile) {
    // Layout Mobile Aprimorado
    return (
      <Flex w="100%" h="100vh" direction="column" position="relative">
        {/* Header com imagem de fundo */}
        <Box position="relative" h="30vh" w="100%" overflow="hidden">
          <Image
            src="./home1.jpg"
            w="100%"
            h="100%"
            objectFit="cover"
            sx={{
              filter: "grayscale(60%) blur(1px)",
            }}
          />
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg="blackAlpha.400"
          />
        </Box>
        <Flex
          flex="1"
          direction="column"
          align="center"
          justify="center"
          px="20px"
          py="30px"
          bg="white"
          borderTopRadius="20px"
          mt="-20px"
          position="relative"
          zIndex="1"
        >
          <Box w="100%" maxW="400px">
            <Flex direction="column" gap="20px" alignItems="stretch">
              <Flex
                direction="column"
                align="center"
                justify="center"
                textAlign="center"
                px="20px"
              >
                <Text
                  fontFamily="Poppins-Light"
                  fontSize="42px"
                  fontWeight="300"
                  mb="8px"
                  color="black"
                >
                  Ligare
                </Text>
              </Flex>
              <AppInput
                placeholder="Seu Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <AppInput
                placeholder="Sua Senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
              />

              <FormButton onClick={handleSubmit} isLoading={loading}>
                Entrar
              </FormButton>
            </Flex>
          </Box>
        </Flex>
      </Flex>
    );
  }
  return (
    <Flex w="100%" h="100vh" direction="row">
      <Flex w={imageWidth}>
        <Image
          src="./home1.jpg"
          w="100%"
          h="100%"
          objectFit="cover"
          sx={{
            filter: "grayscale(100%) blur(2px)",
          }}
        />
      </Flex>

      <Flex
        w={loginWidth}
        direction="column"
        align="center"
        justify="center"
        bg="white"
        position="relative"
      >
        <Box mb="40px" textAlign="center">
          <Text
            fontFamily="Poppins-Light"
            fontSize="36px"
            color="black"
            mb="8px"
            fontWeight="300"
          >
            Ligare
          </Text>
        </Box>
        <Box w={formWidth}>
          <Flex direction="column" gap="20px" alignItems="stretch">
            <AppInput
              placeholder="Seu Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <AppInput
              placeholder="Sua Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
            />

            <FormButton onClick={handleSubmit} isLoading={loading}>
              Entrar
            </FormButton>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
}

export default Login;
