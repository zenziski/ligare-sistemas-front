import {
  HamburgerIcon,
  CloseIcon,
  TimeIcon,
  CalendarIcon,
  StarIcon,
  SettingsIcon,
} from "@chakra-ui/icons";
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
import { useContext, useState, useEffect } from "react";
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
  isCollapsed?: boolean;
}

const Item = ({ label, icon, to, onClick, isCollapsed = false }: ItemProps) => {
  const isActive = window.location.pathname === `/${to}`;

  return (
    <Link to={`/${to}`} onClick={onClick}>
      <Flex
        bg={isActive ? "gray.200" : "transparent"}
        color="black"
        p={isCollapsed ? 2 : 4}
        cursor="pointer"
        alignItems="center"
        justifyContent={isCollapsed ? "center" : "flex-start"}
        borderRadius="md"
        mb={2}
        transition="all 0.2s ease-in-out"
        _hover={{
          bg: isActive ? "yellow.500" : "gray.100",
          color: "gray.800",
        }}
        title={isCollapsed ? label : undefined}
      >
        <Flex
          mr={isCollapsed ? 0 : 2}
          alignItems="center"
          justifyContent="center"
          w={6}
          h={6}
          borderRadius="md"
          bg={isActive ? "yellow.500" : "yellow.400"}
          color={isActive ? "gray.800" : "gray.700"}
          border="1px solid"
          borderColor={isActive ? "yellow.600" : "yellow.500"}
          transition="all 0.2s ease-in-out"
        >
          {icon}
        </Flex>
        {!isCollapsed && (
          <Box
            fontSize="md"
            color="#555"
            fontFamily="Poppins-Medium"
            fontWeight={isActive ? "bold" : "medium"}
          >
            {label}
          </Box>
        )}
      </Flex>
    </Link>
  );
};

const SidebarContent = ({
  onToggle,
  isCollapsed = false,
}: {
  onToggle?: () => void;
  isCollapsed?: boolean;
}) => {
  const { user } = useContext(UserContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <Box h="100vh" w="100%" p={isCollapsed ? 2 : 6} bg="gray.50" color="white">
      <Flex
        p={isCollapsed ? 2 : 4}
        textAlign="center"
        fontSize="2xl"
        fontWeight="bold"
        justifyContent={isCollapsed ? "center" : "space-between"}
        alignItems="center"
        mb={isCollapsed ? 2 : 0}
        color="gray.800"
      >
        {!isCollapsed && (
          <Text fontFamily="Poppins-Light" fontSize="36px" color="gray.800">
            Ligare
          </Text>
        )}
        {onToggle && (
          <IconButton
            aria-label={isCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
            icon={isCollapsed ? <HamburgerIcon /> : <CloseIcon />}
            onClick={onToggle}
            variant="ghost"
            color="gray.800"
            size="sm"
            _hover={{ bg: "yellow.500" }}
          />
        )}
      </Flex>
      <Divider />
      <Box mt={4}>
        {!isCollapsed && (
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
        )}
        <Flex direction="column">
          <Item
            to="ponto"
            label="Registrar"
            icon={<TimeIcon />}
            isCollapsed={isCollapsed}
          />
          <Item
            to="detalhes-ponto"
            label="Espelho de ponto"
            icon={<CalendarIcon />}
            isCollapsed={isCollapsed}
          />
          {user?.roles?.admin && (
            <Item
              to="feriados"
              label="Feriados"
              icon={<StarIcon />}
              isCollapsed={isCollapsed}
            />
          )}
        </Flex>
      </Box>

      <Divider my={4} />
      <Box>
        {!isCollapsed && (
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
        )}
        <Flex direction="column">
          {user?.roles?.admin && (
            <Item
              to="usuarios"
              label="Usuários"
              icon={<SettingsIcon />}
              isCollapsed={isCollapsed}
            />
          )}
          <Item
            to="obras"
            label="Obras"
            icon={
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2Z" />
              </svg>
            }
            isCollapsed={isCollapsed}
          />
          <Item
            to="clientes"
            label="Clientes"
            icon={
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" />
              </svg>
            }
            isCollapsed={isCollapsed}
          />
          <Item
            to="fornecedores"
            label="Fornecedores"
            icon={
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.5 4L19.66 8H21V10H19L18.5 12H6.5L6 10H4V8H5.34L6.5 4H18.5ZM7.33 6L6.83 8H17.17L16.67 6H7.33ZM5 14H19V16H5V14ZM5 18H19V20H5V18Z" />
              </svg>
            }
            isCollapsed={isCollapsed}
          />
          <Item
            to="financeiro"
            label="Plano de Contas"
            icon={
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.5 4L19.66 8H21V10H19L18.5 12H6.5L6 10H4V8H5.34L6.5 4H18.5ZM7.33 6L6.83 8H17.17L16.67 6H7.33ZM5 14H19V16H5V14ZM5 18H19V20H5V18Z" />
              </svg>
            }
            isCollapsed={isCollapsed}
          />
        </Flex>
      </Box>
      <Divider my={4} />
      <Flex
        bg="transparent"
        color="#555"
        p={isCollapsed ? 2 : 4}
        cursor="pointer"
        alignItems="center"
        justifyContent={isCollapsed ? "center" : "flex-start"}
        borderRadius="md"
        transition="all 0.2s ease-in-out"
        _hover={{
          bg: "red.50",
          color: "red.500",
        }}
        onClick={handleLogout}
        w="100%"
        title={isCollapsed ? "Sair" : undefined}
      >
        <Flex
          mr={isCollapsed ? 0 : 2}
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
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points="16,17 21,12 16,7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              x1="21"
              y1="12"
              x2="9"
              y2="12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Flex>
        {!isCollapsed && (
          <Box
            fontSize="md"
            color="#555"
            fontFamily="Poppins-Medium"
            fontWeight="medium"
          >
            Sair
          </Box>
        )}
      </Flex>
    </Box>
  );
};

// Função para gerenciar o estado persistente do sidebar
const getSidebarCollapsedState = (): boolean => {
  if (typeof window !== "undefined") {
    const saved = sessionStorage.getItem("sidebarCollapsed");
    return saved === "true";
  }
  return false;
};

const setSidebarCollapsedState = (collapsed: boolean): void => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("sidebarCollapsed", collapsed.toString());
  }
};

const Sidebar = ({ children }: SidebarProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Estado inicializado com valor persistente
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(
    () => getSidebarCollapsedState()
  );

  const isMobile = useBreakpointValue({ base: true, lg: false });

  // Sincroniza mudanças de estado com sessionStorage
  useEffect(() => {
    setSidebarCollapsedState(isDesktopSidebarCollapsed);
  }, [isDesktopSidebarCollapsed]);

  const toggleDesktopSidebar = () => {
    setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed);
  };

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
              <SidebarContent />
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
      {/* Desktop Sidebar */}
      <Box
        position="fixed"
        top="0"
        left="0"
        h="100vh"
        w={isDesktopSidebarCollapsed ? "16" : "64"}
        bg="blackAlpha.50"
        color="white"
        zIndex="sticky"
        transition="all 0.3s ease-in-out"
      >
        <SidebarContent
          onToggle={toggleDesktopSidebar}
          isCollapsed={isDesktopSidebarCollapsed}
        />
      </Box>

      {/* Main Content */}
      <Box
        pl={isDesktopSidebarCollapsed ? "16" : "64"}
        w="100%"
        overflowY="auto"
        minH="100vh"
        transition="all 0.3s ease-in-out"
      >
        {children}
      </Box>
    </>
  );
};

export default Sidebar;
