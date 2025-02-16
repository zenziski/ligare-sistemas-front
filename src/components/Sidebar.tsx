import { CheckIcon } from "@chakra-ui/icons";
import { Box, Flex, Divider, Text } from "@chakra-ui/react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../contexts/UserContext";

interface SidebarProps {
    children: React.ReactNode
}

interface ItemProps {
    label: string
    icon: React.ReactNode,
    to: string
    isActive?: boolean
}

const Item = ({ label, icon, to }: ItemProps) => {

    const isActive = window.location.pathname === `/${to}`;

    return (
        <Link to={`/${to}`}>
            <Flex
                bg={isActive ? 'gray.200' : 'transparent'}
                color="black"
                p={4}
                cursor="pointer"
                alignItems='center'
                borderRadius='md'
                mb={2}
                transition='all 0.2s ease-in-out'
                _hover={{
                    bg: isActive ? 'primary-500' : 'gray.100',
                    color: 'primary-400'
                }}
            >
                <Flex
                    mr={2}
                    alignItems='center'
                    justifyContent='center'
                    w={6}
                    h={6}
                    borderRadius='md'
                    bg="primary-500"
                    color='primary-400'
                    transition='all 0.2s ease-in-out'
                >
                    {icon}
                </Flex>
                <Box
                    fontSize='md'
                    color="#555"
                    fontFamily="Poppins-Medium"
                    fontWeight={isActive ? 'bold' : 'medium'}
                >
                    {label}
                </Box>
            </Flex>
        </Link>

    );
}

const Sidebar = ({ children }: SidebarProps) => {
  const { user } = useContext(UserContext);
    return (
        <>
            <Box position="fixed" top="0" left="0" h="100vh" w="64" p="6" bg="blackAlpha.50" color="white">
                <Flex
                    p={4}
                    textAlign='center'
                    fontSize='2xl'
                    fontWeight='bold'
                    justifyContent="center"
                    alignItems="center"
                >
                    <Text fontFamily="Poppins-Light" fontSize="36px" color="black">Ligare</Text>
                </Flex>
                <Divider />
                <Flex direction="column">
                    <Item to="ponto" label="Registrar" icon={<CheckIcon />} />
                    <Item to="detalhes-ponto" label="Espelho de ponto" icon={<CheckIcon />} />
                    {user?.roles?.admin && <Item to="feriados" label="Feriados" icon={<CheckIcon />} />}
                    {user?.roles?.admin && <Item to="usuarios" label="Usuários" icon={<CheckIcon />} />}
                </Flex>
            </Box>
            <Box pl="64" w="100%" overflowY="auto">
                {children}
            </Box>
        </>
    );
}

export default Sidebar;