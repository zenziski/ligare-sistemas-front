import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  Spinner,
  useDisclosure,
  VStack,
  HStack,
  Box,
  Divider,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";

interface DrawerProps {
  isButton?: boolean;
  buttonIcon?:
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | undefined;
  buttonText?: string;
  buttonColorScheme?: string;
  headerText: string;
  headerSubtext?: string;
  children: React.ReactNode;
  onAction?: () => void;
  onOpenHook?: () => void;
  onCloseHook?: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
  hideFooter?: boolean;
  saveButtonText?: string;
  cancelButtonText?: string;
  variant?: "solid" | "outline" | "ghost";
  buttonSize?: "xs" | "sm" | "md" | "lg";
}

const DrawerComponent: React.FC<DrawerProps> = ({
  buttonIcon,
  buttonText,
  headerText,
  headerSubtext,
  buttonColorScheme,
  size,
  isButton,
  onAction,
  onOpenHook,
  onCloseHook,
  isDisabled,
  isLoading,
  children,
  hideFooter,
  saveButtonText = "Salvar",
  cancelButtonText = "Cancelar",
  variant = "solid",
  buttonSize = "sm",
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Cores do tema
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const headerBgColor = useColorModeValue("gray.50", "gray.700");
  const overlayBg = useColorModeValue("blackAlpha.600", "blackAlpha.700");

  const handleClose = () => {
    onClose();
    onCloseHook && onCloseHook();
  };

  const handleOpen = () => {
    onOpen();
    onOpenHook && onOpenHook();
  };

  const handleAction = () => {
    if (onAction) {
      onAction();
    }
  };

  return (
    <>
      {isButton ? (
        <Button
          leftIcon={buttonIcon}
          colorScheme={buttonColorScheme || "blue"}
          onClick={handleOpen}
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
          onClick={handleOpen}
          colorScheme={buttonColorScheme || "blue"}
          variant={variant}
          size={buttonSize}
        />
      )}

      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={handleClose}
        size={size || "md"}
      >
        <DrawerOverlay bg={overlayBg} />
        <DrawerContent bg={bgColor}>
          {/* Close Button */}
          <DrawerCloseButton size="md" zIndex={10} />

          {/* Header */}
          <DrawerHeader
            bg={headerBgColor}
            borderBottom="1px"
            borderColor={borderColor}
            pb={4}
            pt={6}
          >
            <VStack align="start" spacing={1}>
              <Text
                fontSize="xl"
                fontWeight="bold"
                color="gray.800"
                fontFamily="Poppins-Medium"
              >
                {headerText}
              </Text>
              {headerSubtext && (
                <Text
                  fontSize="sm"
                  color="gray.600"
                  fontFamily="Poppins-Regular"
                >
                  {headerSubtext}
                </Text>
              )}
            </VStack>
          </DrawerHeader>

          {/* Body */}
          <DrawerBody fontFamily="Poppins-Regular" pt={6} px={6}>
            <Box>{children}</Box>
          </DrawerBody>

          {/* Footer */}
          {!hideFooter && (
            <>
              <Divider />
              <DrawerFooter bg={headerBgColor} pt={4} pb={6} px={6}>
                <HStack spacing={3} width="100%">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    flex="1"
                    colorScheme="gray"
                    fontWeight="medium"
                    _hover={{
                      bg: "gray.50",
                      borderColor: "gray.300",
                    }}
                  >
                    {cancelButtonText}
                  </Button>
                  <Button
                    colorScheme={buttonColorScheme || "blue"}
                    onClick={handleAction}
                    isLoading={isLoading}
                    isDisabled={isDisabled}
                    flex="1"
                    fontWeight="medium"
                    loadingText="Salvando..."
                    spinner={<Spinner size="sm" />}
                    _hover={{
                      transform: "translateY(-1px)",
                      shadow: "md",
                    }}
                    transition="all 0.2s"
                  >
                    {saveButtonText}
                  </Button>
                </HStack>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default DrawerComponent;
