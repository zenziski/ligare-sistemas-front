import { Button, IconButton } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import {
  VStack,
  HStack,
  Text,
  Box,
  Divider,
  useColorModeValue,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useState } from "react";
import { WarningTwoIcon } from "@chakra-ui/icons";

interface ModalDeleteProps {
  onDelete: () => void | Promise<void>;
  children: React.ReactNode;
  isButton?: boolean;
  buttonIcon?:
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | undefined;
  buttonText?: string;
  buttonColorScheme?: string;
  headerText: string;
  deleteButtonText?: string;
  cancelButtonText?: string;
  variant?: "solid" | "outline" | "ghost";
  buttonSize?: "xs" | "sm" | "md" | "lg";
  showWarning?: boolean;
}

const ModalDelete = ({
  onDelete,
  children,
  isButton,
  buttonIcon,
  buttonText,
  buttonColorScheme = "red",
  headerText,
  deleteButtonText = "Excluir",
  cancelButtonText = "Cancelar",
  variant = "solid",
  buttonSize = "sm",
  showWarning = true,
}: ModalDeleteProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);

  // Cores do tema
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const headerBgColor = useColorModeValue("red.50", "red.900");
  const overlayBg = useColorModeValue("blackAlpha.600", "blackAlpha.700");

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete();
      onClose();
    } catch (error) {
      console.error("Erro ao deletar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isButton ? (
        <Button
          leftIcon={buttonIcon}
          colorScheme={buttonColorScheme}
          onClick={onOpen}
          variant={variant}
          size={buttonSize}
          fontWeight="medium"
        >
          {buttonText || ""}
        </Button>
      ) : (
        <IconButton
          aria-label={headerText}
          icon={buttonIcon}
          onClick={onOpen}
          colorScheme={buttonColorScheme}
          variant={variant}
          size={buttonSize}
        />
      )}

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        motionPreset="slideInBottom"
      >
        <ModalOverlay bg={overlayBg} />
        <ModalContent bg={bgColor} mx={4}>
          {/* Close Button */}
          <ModalCloseButton zIndex={10} />

          {/* Header */}
          <ModalHeader
            bg={headerBgColor}
            borderBottom="1px"
            borderColor={borderColor}
            borderTopRadius="md"
            pt={6}
            pb={4}
          >
            <HStack spacing={3}>
              <Box p={2} bg="red.100" borderRadius="full" color="red.600">
                <WarningTwoIcon boxSize={5} />
              </Box>
              <VStack align="start" spacing={0}>
                <Text
                  fontSize="lg"
                  fontWeight="bold"
                  color="red.800"
                  fontFamily="Poppins-Medium"
                >
                  {headerText}
                </Text>
                <Text
                  fontSize="sm"
                  color="red.600"
                  fontFamily="Poppins-Regular"
                >
                  Esta ação é irreversível
                </Text>
              </VStack>
            </HStack>
          </ModalHeader>

          {/* Body */}
          <ModalBody p={6} fontFamily="Poppins-Regular">
            <VStack spacing={4} align="stretch">
              {showWarning && (
                <Alert status="warning" borderRadius="md">
                  <AlertIcon />
                  <Text fontSize="sm">
                    Atenção! Esta ação não pode ser desfeita.
                  </Text>
                </Alert>
              )}

              <Box>{children}</Box>
            </VStack>
          </ModalBody>

          {/* Footer */}
          <Divider />
          <ModalFooter p={6}>
            <HStack spacing={3} width="100%">
              <Button
                variant="outline"
                onClick={onClose}
                flex="1"
                fontWeight="medium"
                isDisabled={isLoading}
              >
                {cancelButtonText}
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDelete}
                isLoading={isLoading}
                loadingText="Excluindo..."
                flex="1"
                fontWeight="medium"
              >
                {deleteButtonText}
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalDelete;
