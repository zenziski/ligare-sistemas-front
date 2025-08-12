import {
  Button,
  CircularProgress,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  useDisclosure,
  useToast,
  Textarea,
  VStack,
  Text,
  Box,
  Flex,
  Badge,
  FormControl,
  FormLabel,
  useColorModeValue,
  Divider,
  Icon,
} from "@chakra-ui/react";
import { HamburgerIcon, CalendarIcon, EditIcon } from "@chakra-ui/icons";
import moment from "moment/moment";
import { useState } from "react";
import { corrigirPonto } from "../../../stores/ponto/service";

interface IModalSolicitarAbono {
  dia: string;
  setFlushHook: any;
}

const ModalSolicitarAbono = (props: IModalSolicitarAbono) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [loading, setLoading] = useState<boolean>(false);
  const [justificative, setJustificative] = useState<string>("");

  // Theme colors
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textSecondary = useColorModeValue("gray.600", "gray.400");
  const gradientBg = useColorModeValue(
    "linear(to-r, blue.500, purple.600)",
    "linear(to-r, blue.600, purple.700)"
  );

  const handleSolicitarAbono = async () => {
    setLoading(true);
    try {
      if (props.dia === "" || !moment(props.dia).isValid()) {
        toast({
          title: "Data inválida",
          description: "Selecione uma data válida",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        return;
      }

      if (justificative.trim() === "") {
        toast({
          title: "Preencha a justificativa",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        return;
      }

      await corrigirPonto({
        dataCorrecao: moment(props.dia).toISOString(),
        tipo: "abono",
        justificative: justificative.trim(),
      });

      toast({
        title: "Solicitação enviada com sucesso",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });

      setJustificative("");
      props.setFlushHook((prev: boolean) => !prev);
      onClose();
    } catch (err) {
      const errorObj = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage =
        errorObj?.response?.data?.message ||
        errorObj?.message ||
        "Erro ao solicitar abono";
      toast({
        title: "Erro",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton
        aria-label="Solicitar abono"
        icon={<HamburgerIcon />}
        onClick={onOpen}
        variant="ghost"
        colorScheme="blue"
        size="sm"
        _hover={{
          bg: "blue.50",
          transform: "scale(1.05)",
        }}
        transition="all 0.2s"
      />

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInBottom"
        isCentered
        size="md"
      >
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(90deg)"
        />
        <ModalContent
          bg={bgColor}
          borderRadius="2xl"
          boxShadow="2xl"
          border="1px solid"
          borderColor={borderColor}
          overflow="hidden"
        >
          {/* Header com gradiente */}
          <Box bgGradient={gradientBg} p={6} color="white" position="relative">
            <ModalCloseButton
              color="white"
              _hover={{ bg: "whiteAlpha.200" }}
              size="lg"
              top={4}
              right={4}
            />
            <VStack align="start" spacing={2}>
              <Flex align="center" gap={3}>
                <Icon as={EditIcon} boxSize={6} />
                <Text fontSize="xl" fontWeight="bold">
                  Solicitar Abono
                </Text>
              </Flex>
              <Flex align="center" gap={2}>
                <Icon as={CalendarIcon} boxSize={4} />
                <Text fontSize="lg" opacity={0.9}>
                  {moment(props.dia).format("DD/MM/YYYY")}
                </Text>
                <Badge
                  colorScheme="whiteAlpha"
                  variant="solid"
                  borderRadius="full"
                  px={3}
                  py={1}
                >
                  {moment(props.dia).format("dddd")}
                </Badge>
              </Flex>
            </VStack>
          </Box>

          <ModalBody p={6}>
            <VStack spacing={4} align="stretch">
              <Box>
                <Text fontSize="sm" color={textSecondary} mb={2}>
                  Esta solicitação será enviada para análise do seu gestor.
                </Text>
              </Box>

              <Divider />

              <FormControl>
                <FormLabel
                  fontSize="sm"
                  fontWeight="semibold"
                  color={textSecondary}
                >
                  Justificativa *
                </FormLabel>
                <Textarea
                  placeholder="Descreva o motivo da sua solicitação de abono..."
                  value={justificative}
                  onChange={(e) => setJustificative(e.target.value)}
                  rows={4}
                  resize="none"
                  borderRadius="lg"
                  border="2px solid"
                  borderColor={borderColor}
                  _hover={{
                    borderColor: "blue.300",
                  }}
                  _focus={{
                    borderColor: "blue.500",
                    boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
                  }}
                  transition="all 0.2s"
                />
                <Text fontSize="xs" color={textSecondary} mt={1}>
                  {justificative.length}/500 caracteres
                </Text>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter p={6} pt={0}>
            <Flex gap={3} width="100%">
              <Button
                flex={1}
                onClick={onClose}
                variant="ghost"
                colorScheme="gray"
                borderRadius="lg"
                _hover={{
                  bg: "gray.100",
                }}
              >
                Cancelar
              </Button>
              <Button
                flex={2}
                colorScheme="blue"
                isLoading={loading}
                loadingText="Enviando..."
                onClick={handleSolicitarAbono}
                borderRadius="lg"
                bgGradient={gradientBg}
                _hover={{
                  bgGradient: "linear(to-r, blue.600, purple.700)",
                  transform: "translateY(-1px)",
                  boxShadow: "lg",
                }}
                _active={{
                  transform: "translateY(0px)",
                }}
                transition="all 0.2s"
                leftIcon={!loading ? <EditIcon /> : undefined}
              >
                {loading ? (
                  <CircularProgress isIndeterminate size="20px" color="white" />
                ) : (
                  "Enviar Solicitação"
                )}
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalSolicitarAbono;
