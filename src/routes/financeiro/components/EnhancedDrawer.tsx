import React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  useDisclosure,
  IconButton,
  HStack,
  Text,
  Box,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { AddIcon } from "@chakra-ui/icons";

const MotionDrawerContent = motion(DrawerContent);

interface EnhancedDrawerProps {
  title: string;
  children: React.ReactNode;
  onAction: () => void;
  isLoading: boolean;
  color: string;
  buttonText?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

/**
 * Drawer aprimorado com animações e melhor UX
 * Botão de trigger integrado com design moderno
 */
export const EnhancedDrawer: React.FC<EnhancedDrawerProps> = ({
  title,
  children,
  onAction,
  isLoading,
  color,
  buttonText = "Adicionar",
  size = "md",
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const overlayBg = useColorModeValue("blackAlpha.300", "blackAlpha.600");

  const handleAction = async () => {
    await onAction();
    onClose();
  };

  return (
    <>
      {/* Botão de trigger moderno */}
      <IconButton
        aria-label={title}
        icon={<AddIcon />}
        colorScheme={color}
        size="md"
        borderRadius="xl"
        _hover={{
          transform: "translateY(-2px) scale(1.05)",
          shadow: "lg",
        }}
        _active={{
          transform: "translateY(0) scale(0.98)",
        }}
        transition="all 0.2s ease"
        onClick={onOpen}
        shadow="md"
      />

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={size}>
        <DrawerOverlay bg={overlayBg} backdropFilter="blur(10px)" />
        <MotionDrawerContent
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          borderLeftRadius="2xl"
          shadow="2xl"
        >
          {/* Header com gradiente */}
          <Box
            bgGradient={`linear(to-r, ${color}.500, ${color}.600)`}
            color="white"
            p={6}
          >
            <DrawerHeader p={0} fontSize="xl" fontWeight="bold">
              <HStack spacing={3}>
                <Icon as={AddIcon} boxSize={5} />
                <Text>{title}</Text>
              </HStack>
            </DrawerHeader>
          </Box>

          <DrawerCloseButton color="white" top={6} right={6} />

          <DrawerBody px={6} py={6}>
            {children}
          </DrawerBody>

          <DrawerFooter
            px={6}
            pb={6}
            pt={0}
            borderTop="1px solid"
            borderColor="gray.200"
          >
            <HStack spacing={3} width="100%" justify="flex-end">
              <Button
                variant="ghost"
                onClick={onClose}
                size="lg"
                borderRadius="lg"
                _hover={{ bg: "gray.100" }}
              >
                Cancelar
              </Button>
              <Button
                colorScheme={color}
                onClick={handleAction}
                isLoading={isLoading}
                loadingText="Criando..."
                size="lg"
                borderRadius="lg"
                px={8}
                _hover={{
                  transform: "translateY(-1px)",
                  shadow: "lg",
                }}
                transition="all 0.2s ease"
              >
                {buttonText}
              </Button>
            </HStack>
          </DrawerFooter>
        </MotionDrawerContent>
      </Drawer>
    </>
  );
};
