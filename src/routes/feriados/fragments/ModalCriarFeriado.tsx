import { AddIcon, CalendarIcon, StarIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  useToast,
  VStack,
  Text,
  Box,
  FormControl,
  FormLabel,
  useColorModeValue,
  Divider,
  Icon,
  SimpleGrid,
  Badge,
  InputGroup,
  InputLeftElement,
  Select,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { createFeriado } from "../../../stores/ponto/service";

interface ModalCriarFeriadoProps {
  onFlushHook?: () => void;
}

const ModalCriarFeriado = (props: ModalCriarFeriadoProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [description, setDescription] = useState<string>("");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>();
  const [day, setDay] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);

  // Theme colors
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textSecondary = useColorModeValue("gray.600", "gray.400");
  const solidBg = useColorModeValue("green.500", "green.600");
  const solidHover = useColorModeValue("green.600", "green.700");
  const solidButton = useColorModeValue("teal.600", "teal.700");

  // Meses do ano
  const meses = [
    { value: 1, label: "Janeiro" },
    { value: 2, label: "Fevereiro" },
    { value: 3, label: "Março" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Maio" },
    { value: 6, label: "Junho" },
    { value: 7, label: "Julho" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Setembro" },
    { value: 10, label: "Outubro" },
    { value: 11, label: "Novembro" },
    { value: 12, label: "Dezembro" },
  ];

  // Gerar anos (atual + 5 anos futuros)
  const anos = Array.from(
    { length: 6 },
    (_, i) => new Date().getFullYear() + i
  );

  // Calcular data completa para preview
  const getFormattedDate = () => {
    if (day && month && year) {
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString("pt-BR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return null;
  };

  // Validar se a data é válida
  const isValidDate = () => {
    if (!day || !month || !year) return false;
    const date = new Date(year, month - 1, day);
    return date.getDate() === day && date.getMonth() === month - 1;
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      if (description.trim() === "" || !month || !day || !year) {
        throw new Error("Preencha todos os campos");
      }

      if (!isValidDate()) {
        throw new Error("Data inválida");
      }

      await createFeriado({
        description: description.trim(),
        year,
        month,
        day,
      });

      toast({
        title: "Feriado criado com sucesso!",
        description: `${description} foi adicionado ao calendário`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });

      // Limpar formulário
      setDescription("");
      setMonth(undefined);
      setDay(undefined);
      setYear(new Date().getFullYear());

      onClose();

      if (props.onFlushHook) {
        props.onFlushHook();
      }
    } catch (error) {
      toast({
        title: "Erro ao criar feriado",
        description:
          error instanceof Error ? error.message : "Erro ao criar feriado",
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
      <Button
        onClick={onOpen}
        leftIcon={<AddIcon />}
        bg={solidBg}
        color="white"
        size="md"
        borderRadius="lg"
        _hover={{
          bg: solidHover,
          transform: "translateY(-2px)",
          boxShadow: "lg",
        }}
        _active={{
          transform: "translateY(0px)",
        }}
        transition="all 0.2s"
        fontWeight="semibold"
      >
        Novo Feriado
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInBottom"
        isCentered
        size="lg"
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
          {/* Header com cor sólida */}
          <Box bg={solidBg} p={6} color="white" position="relative">
            <ModalCloseButton
              color="white"
              _hover={{ bg: "whiteAlpha.200" }}
              size="lg"
              top={4}
              right={4}
            />
            <Flex align="center" gap={3}>
              <Icon as={StarIcon} boxSize={6} />
              <VStack align="start" spacing={1}>
                <Text fontSize="xl" fontWeight="bold">
                  Criar Novo Feriado
                </Text>
                <Text fontSize="sm" opacity={0.9}>
                  Adicione um feriado ao calendário da empresa
                </Text>
              </VStack>
            </Flex>
          </Box>

          <ModalBody p={6}>
            <VStack spacing={6} align="stretch">
              {/* Preview da data */}
              {getFormattedDate() && (
                <Box
                  p={4}
                  bg={useColorModeValue("green.50", "green.900")}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor={useColorModeValue("green.200", "green.700")}
                >
                  <Flex align="center" gap={2}>
                    <Icon as={CalendarIcon} color="green.500" />
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      color={useColorModeValue("green.800", "green.200")}
                      textTransform="capitalize"
                    >
                      {getFormattedDate()}
                    </Text>
                    <Badge
                      colorScheme="green"
                      variant="solid"
                      borderRadius="full"
                    >
                      {isValidDate() ? "Válida" : "Inválida"}
                    </Badge>
                  </Flex>
                </Box>
              )}

              <Divider />

              {/* Nome do feriado */}
              <FormControl isRequired>
                <FormLabel
                  fontSize="sm"
                  fontWeight="semibold"
                  color={textSecondary}
                >
                  Nome do Feriado
                </FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <StarIcon color={textSecondary} />
                  </InputLeftElement>
                  <Input
                    placeholder="Ex: Dia da Independência, Natal..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    borderRadius="lg"
                    border="2px solid"
                    borderColor={borderColor}
                    _hover={{ borderColor: "green.300" }}
                    _focus={{
                      borderColor: "green.500",
                      boxShadow: "0 0 0 1px var(--chakra-colors-green-500)",
                    }}
                    pl={10}
                  />
                </InputGroup>
                <Text fontSize="xs" color={textSecondary} mt={1}>
                  {description.length}/100 caracteres
                </Text>
              </FormControl>

              {/* Data */}
              <FormControl isRequired>
                <FormLabel
                  fontSize="sm"
                  fontWeight="semibold"
                  color={textSecondary}
                >
                  Data do Feriado
                </FormLabel>
                <SimpleGrid columns={3} spacing={3}>
                  <VStack align="start" spacing={2}>
                    <Text
                      fontSize="xs"
                      color={textSecondary}
                      fontWeight="medium"
                    >
                      Dia
                    </Text>
                    <Input
                      placeholder="01"
                      value={day || ""}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value >= 1 && value <= 31) {
                          setDay(value);
                        } else if (e.target.value === "") {
                          setDay(undefined);
                        }
                      }}
                      type="number"
                      min={1}
                      max={31}
                      borderRadius="lg"
                      border="2px solid"
                      borderColor={borderColor}
                      _hover={{ borderColor: "green.300" }}
                      _focus={{
                        borderColor: "green.500",
                        boxShadow: "0 0 0 1px var(--chakra-colors-green-500)",
                      }}
                      textAlign="center"
                    />
                  </VStack>

                  <VStack align="start" spacing={2}>
                    <Text
                      fontSize="xs"
                      color={textSecondary}
                      fontWeight="medium"
                    >
                      Mês
                    </Text>
                    <Select
                      placeholder="Selecione"
                      value={month || ""}
                      onChange={(e) =>
                        setMonth(Number(e.target.value) || undefined)
                      }
                      borderRadius="lg"
                      border="2px solid"
                      borderColor={borderColor}
                      _hover={{ borderColor: "green.300" }}
                      _focus={{
                        borderColor: "green.500",
                        boxShadow: "0 0 0 1px var(--chakra-colors-green-500)",
                      }}
                    >
                      {meses.map((mes) => (
                        <option key={mes.value} value={mes.value}>
                          {mes.label}
                        </option>
                      ))}
                    </Select>
                  </VStack>

                  <VStack align="start" spacing={2}>
                    <Text
                      fontSize="xs"
                      color={textSecondary}
                      fontWeight="medium"
                    >
                      Ano
                    </Text>
                    <Select
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      borderRadius="lg"
                      border="2px solid"
                      borderColor={borderColor}
                      _hover={{ borderColor: "green.300" }}
                      _focus={{
                        borderColor: "green.500",
                        boxShadow: "0 0 0 1px var(--chakra-colors-green-500)",
                      }}
                    >
                      {anos.map((ano) => (
                        <option key={ano} value={ano}>
                          {ano}
                        </option>
                      ))}
                    </Select>
                  </VStack>
                </SimpleGrid>
              </FormControl>

              <Text fontSize="xs" color={textSecondary}>
                * Todos os campos são obrigatórios
              </Text>
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
                _hover={{ bg: "gray.100" }}
              >
                Cancelar
              </Button>
              <Button
                flex={2}
                colorScheme="teal"
                isLoading={loading}
                loadingText="Criando..."
                onClick={handleCreate}
                borderRadius="lg"
                bg={solidButton}
                _hover={{
                  bg: solidHover,
                  transform: "translateY(-1px)",
                  boxShadow: "lg",
                }}
                _active={{ transform: "translateY(0px)" }}
                transition="all 0.2s"
                leftIcon={!loading ? <AddIcon /> : undefined}
                isDisabled={
                  !description.trim() ||
                  !day ||
                  !month ||
                  !year ||
                  !isValidDate()
                }
              >
                Criar Feriado
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalCriarFeriado;
