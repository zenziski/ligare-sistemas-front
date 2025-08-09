import { CheckIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Divider,
  Text,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../contexts/UserContext";

interface SidebarProps {
  children: React.ReactNode;
}

interface ItemProps {
  label: string;
  icon: React.ReactNode;
  to: string;
  isActive?: boolean;
  onClick?: () => void;
}

const Item = ({ label, icon, to, onClick }: ItemProps) => {
  const isActive = window.location.pathname === `/${to}`;

  return (
    <Link to={`/${to}`} onClick={onClick}>
      <Flex
        bg={isActive ? "gray.200" : "transparent"}
        color="black"
        p={4}
        cursor="pointer"
        alignItems="center"
        borderRadius="md"
        mb={2}
        transition="all 0.2s ease-in-out"
        _hover={{
          bg: isActive ? "primary-500" : "gray.100",
          color: "primary-400",
        }}
      >
        <Flex
          mr={2}
          alignItems="center"
          justifyContent="center"
          w={6}
          h={6}
          borderRadius="md"
          bg="primary-500"
          color="primary-400"
          transition="all 0.2s ease-in-out"
        >
          {icon}
        </Flex>
        <Box
          fontSize="md"
          color="#555"
          fontFamily="Poppins-Medium"
          fontWeight={isActive ? "bold" : "medium"}
        >
          {label}
        </Box>
      </Flex>
    </Link>
  );
};

const SidebarContent = ({ onClose }: { onClose?: () => void }) => {
  const { user } = useContext(UserContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <Box h="100vh" w="100%" p="6" bg="blackAlpha.50" color="white">
      <Flex
        p={4}
        textAlign="center"
        fontSize="2xl"
        fontWeight="bold"
        justifyContent="center"
        alignItems="center"
      >
        <Text fontFamily="Poppins-Light" fontSize="36px" color="black">
          Ligare
        </Text>
      </Flex>
      <Divider />
      <Box mt={4}>
        <Text
          fontSize="sm"
          color="gray.600"
          fontWeight="bold"
          mb={2}
          px={2}
          fontFamily="Poppins-Medium"
        >
          CONTROLE DE PONTO
        </Text>
        <Flex direction="column">
          <Item
            to="ponto"
            label="Registrar"
            icon={<CheckIcon />}
            onClick={onClose}
          />
          <Item
            to="detalhes-ponto"
            label="Espelho de ponto"
            icon={<CheckIcon />}
            onClick={onClose}
          />
          {user?.roles?.admin && (
            <Item
              to="feriados"
              label="Feriados"
              icon={<CheckIcon />}
              onClick={onClose}
            />
          )}
        </Flex>
      </Box>

      <Divider my={4} />
      <Box>
        <Text
          fontSize="sm"
          color="gray.600"
          fontWeight="bold"
          mb={2}
          px={2}
          fontFamily="Poppins-Medium"
        >
          GESTÃO
        </Text>
        <Flex direction="column">
          {user?.roles?.admin && (
            <Item
              to="usuarios"
              label="Usuários"
              icon={<CheckIcon />}
              onClick={onClose}
            />
          )}
          <Item to="obras" label="Obras" icon={<CheckIcon />} />
          <Item to="clientes" label="Clientes" icon={<CheckIcon />} />
          <Item to="fornecedores" label="Fornecedores" icon={<CheckIcon />} />
          <Item to="financeiro" label="Financeiro" icon={<CheckIcon />} />
        </Flex>
      </Box>
      <Divider my={4} />
      <Flex
        bg="transparent"
        color="#555"
        p={4}
        cursor="pointer"
        alignItems="center"
        borderRadius="md"
        transition="all 0.2s ease-in-out"
        _hover={{
          bg: "red.50",
          color: "red.500",
        }}
        onClick={handleLogout}
        w="100%"
      >
        <Flex
          mr={2}
          alignItems="center"
          justifyContent="center"
          w={6}
          h={6}
          borderRadius="md"
          bg="red.100"
          color="red.500"
          transition="all 0.2s ease-in-out"
        >
          <svg
            width="24"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <polyline
              points="16,17 21,12 16,7"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <line
              x1="21"
              y1="12"
              x2="9"
              y2="12"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Flex>
        <Box
          fontSize="md"
          color="#555"
          fontFamily="Poppins-Medium"
          fontWeight="medium"
        >
          Sair
        </Box>
      </Flex>
    </Box>
  );
};

const Sidebar = ({ children }: SidebarProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, lg: false });

  if (isMobile) {
    // Layout Mobile com Drawer
    return (
      <>
        {/* Header Mobile */}
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          h="16"
          bg="blackAlpha.50"
          zIndex="sticky"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          px={4}
        >
          <IconButton
            aria-label="Abrir menu"
            icon={<HamburgerIcon />}
            onClick={onOpen}
            variant="ghost"
            color="black"
            size="lg"
          />
          <Text fontFamily="Poppins-Light" fontSize="24px" color="black">
            Ligare
          </Text>
          <Box w="12" /> {/* Spacer para centralizar o título */}
        </Box>

        {/* Drawer Mobile */}
        <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton color="black" />
            <DrawerBody p={0}>
              <SidebarContent onClose={onClose} />
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        {/* Conteúdo Principal Mobile */}
        <Box pt="16" w="100%" overflowY="auto" minH="100vh">
          {children}
        </Box>
      </>
    );
  }

  // Layout Desktop (original)
  return (
    <>
      <Box
        position="fixed"
        top="0"
        left="0"
        h="100vh"
        w="64"
        bg="blackAlpha.50"
        color="white"
        zIndex="sticky"
      >
        <SidebarContent />
      </Box>
      <Box pl="64" w="100%" overflowY="auto" minH="100vh">
        {children}
      </Box>
    </>
  );
};

export default Sidebar;
