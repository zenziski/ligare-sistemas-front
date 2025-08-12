import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  useToast,
  Card,
  CardBody,
  CardHeader,
  HStack,
  VStack,
  Badge,
  Skeleton,
  Icon,
} from "@chakra-ui/react";
import Sidebar from "../../components/Sidebar";
import DrawerComponent from "../../components/Drawer";
import { useEffect, useState } from "react";
import { AddIcon, SearchIcon, EditIcon } from "@chakra-ui/icons";
import { IFornecedorTable, schema } from "../../stores/fornecedores/interface";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createSupplier,
  getAll,
  updateSupplier,
} from "../../stores/fornecedores/service";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import StyledTable from "../../components/StyledTable";

const Fornecedores = () => {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [fornecedores, setFornecedores] = useState<IFornecedorTable[]>([]);
  const [fornecedor, setFornecedor] = useState<IFornecedorTable>(
    {} as IFornecedorTable
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<IFornecedorTable>({
    resolver: zodResolver(schema),
    shouldFocusError: false,
  });

  const handleCreateSupplier = async (data: IFornecedorTable) => {
    try {
      const response = await createSupplier(data);
      setFornecedores([...fornecedores, response]);
      reset();
      toast({
        title: "Fornecedor criado com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: error?.response?.data?.message || "Erro ao criar fornecedor!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEditSupplier = async (data: IFornecedorTable) => {
    try {
      await updateSupplier(data);
      const newFornecedores = await getAll();
      setFornecedores(newFornecedores);
      toast({
        title: "Fornecedor editado com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: error?.response?.data?.message || "Erro ao editar fornecedor!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const response = await getAll();
      setFornecedores(response);
      setLoading(false);
    };
    fetch();
  }, []);

  useEffect(() => {
    setValue("name", fornecedor.name);
    setValue("email", fornecedor.email);
    setValue("cpfCnpj", fornecedor.cpfCnpj);
    setValue("phone", fornecedor.phone);
    setValue("_id", fornecedor._id);
  }, [setValue, fornecedor]);

  const getFornecedorStatus = (fornecedor: IFornecedorTable) => {
    const hasAllData =
      fornecedor.name &&
      fornecedor.cpfCnpj &&
      fornecedor.email &&
      fornecedor.phone;
    return hasAllData ? "Completo" : "Incompleto";
  };

  const getFornecedorStatusColor = (fornecedor: IFornecedorTable) => {
    const status = getFornecedorStatus(fornecedor);
    return status === "Completo" ? "green" : "orange";
  };

  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join("");
  };

  const filteredFornecedores = fornecedores.filter(
    (fornecedor) =>
      fornecedor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fornecedor.cpfCnpj?.includes(searchTerm) ||
      fornecedor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fornecedor.phone?.includes(searchTerm)
  );

  const renderSupplierForm = () => (
    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
      <FormControl gridColumn="span 2">
        <FormLabel fontWeight="medium" color="gray.700">
          Nome/Razão Social
        </FormLabel>
        <Input
          {...register("name")}
          placeholder="Ex: Exemplo da Silva LTDA"
          focusBorderColor="blue.400"
        />
        {errors.name && (
          <Text color="red.500" fontSize="sm">
            {errors.name.message}
          </Text>
        )}
      </FormControl>

      <FormControl>
        <FormLabel fontWeight="medium" color="gray.700">
          CPF/CNPJ
        </FormLabel>
        <Input
          {...register("cpfCnpj")}
          placeholder="99.999.999/9999-99"
          focusBorderColor="blue.400"
        />
        {errors.cpfCnpj && (
          <Text color="red.500" fontSize="sm">
            {errors.cpfCnpj.message}
          </Text>
        )}
      </FormControl>

      <FormControl>
        <FormLabel fontWeight="medium" color="gray.700">
          Contato
        </FormLabel>
        <Input
          {...register("phone")}
          placeholder="(99) 9 9999-9999"
          focusBorderColor="blue.400"
        />
        {errors.phone && (
          <Text color="red.500" fontSize="sm">
            {errors.phone.message}
          </Text>
        )}
      </FormControl>

      <FormControl gridColumn="span 2">
        <FormLabel fontWeight="medium" color="gray.700">
          Email
        </FormLabel>
        <Input
          {...register("email")}
          placeholder="exemplo@mail.com.br"
          type="email"
          focusBorderColor="blue.400"
        />
        {errors.email && (
          <Text color="red.500" fontSize="sm">
            {errors.email.message}
          </Text>
        )}
      </FormControl>
    </Grid>
  );

  return (
    <Sidebar>
      {/* Loading State */}
      {loading ? (
        <Flex direction="column" gap={6} p={8} w="100%">
          <HStack>
            <Skeleton height="32px" width="260px" />
          </HStack>
          <Card>
            <CardBody>
              <HStack spacing={4}>
                <Skeleton height="40px" flex={1} />
                <Skeleton height="40px" width="160px" />
              </HStack>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton height="20px" width="180px" />
            </CardHeader>
            <CardBody>
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} height="44px" mb={2} />
              ))}
            </CardBody>
          </Card>
        </Flex>
      ) : (
        <Box w="100%" h="100%" p={6} fontFamily="Poppins-Regular">
          <VStack spacing={6} align="stretch">
            {/* Header */}
            <Flex justify="space-between" align="center">
              <VStack align="start" spacing={1}>
                <Text fontSize="3xl" fontWeight="bold" color="gray.800">
                  Gestão de Fornecedores
                </Text>
                <Text color="gray.600" fontSize="md">
                  Gerencie informações dos seus fornecedores
                </Text>
              </VStack>
            </Flex>

            {/* Actions Bar */}
            <Card shadow="sm" border="1px" borderColor="gray.100">
              <CardBody>
                <Flex
                  justify="space-between"
                  align="center"
                  wrap="wrap"
                  gap={4}
                >
                  <HStack spacing={4} flex="1">
                    <InputGroup maxW="420px">
                      <InputLeftElement pointerEvents="none">
                        <SearchIcon color="gray.400" />
                      </InputLeftElement>
                      <Input
                        placeholder="Buscar fornecedores..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        bg="white"
                        border="1px"
                        borderColor="gray.200"
                        _hover={{ borderColor: "gray.300" }}
                        _focus={{
                          borderColor: "blue.400",
                          boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
                        }}
                      />
                    </InputGroup>
                    <Badge
                      colorScheme="blue"
                      variant="solid"
                      px={3}
                      py={1}
                      borderRadius="full"
                    >
                      {filteredFornecedores.length} fornecedor
                      {filteredFornecedores.length !== 1 ? "es" : ""}
                    </Badge>
                  </HStack>

                  <DrawerComponent
                    buttonIcon={<AddIcon />}
                    buttonText="Novo Fornecedor"
                    headerText="Cadastrar Novo Fornecedor"
                    buttonColorScheme="green"
                    size="lg"
                    isButton
                    onOpenHook={() => {
                      setFornecedor({} as IFornecedorTable);
                      reset();
                    }}
                    onAction={() => handleSubmit(handleCreateSupplier)()}
                    isLoading={isSubmitting}
                  >
                    <VStack spacing={4} align="stretch">
                      {renderSupplierForm()}
                    </VStack>
                  </DrawerComponent>
                </Flex>
              </CardBody>
            </Card>

            {/* Tabela de Fornecedores */}
            <StyledTable
              columns={[
                {
                  key: "fornecedor",
                  label: "Fornecedor",
                  render: (fornecedor) => (
                    <HStack align="center" spacing={4}>
                      <Box
                        w="38px"
                        h="38px"
                        bgGradient="linear(to-br, blue.500, teal.400)"
                        color="white"
                        rounded="full"
                        fontSize="sm"
                        fontWeight="bold"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        shadow="sm"
                        flexShrink={0}
                        letterSpacing="wide"
                      >
                        {getInitials(fornecedor.name)}
                      </Box>
                      <VStack align="start" spacing={0} maxW="260px">
                        <Text
                          fontWeight="semibold"
                          color="gray.800"
                          noOfLines={1}
                        >
                          {fornecedor.name}
                        </Text>
                      </VStack>
                    </HStack>
                  ),
                },
                {
                  key: "cpfCnpj",
                  label: "CPF/CNPJ",
                  render: (fornecedor) => (
                    <Text fontSize="sm" fontWeight="medium">
                      {fornecedor.cpfCnpj || "-"}
                    </Text>
                  ),
                },
                {
                  key: "phone",
                  label: "Contato",
                  render: (fornecedor) => (
                    <Text fontSize="sm">{fornecedor.phone || "-"}</Text>
                  ),
                },
                {
                  key: "email",
                  label: "Email",
                  render: (fornecedor) => (
                    <Text
                      fontSize="sm"
                      color="blue.600"
                      noOfLines={1}
                      maxW="200px"
                    >
                      {fornecedor.email || "-"}
                    </Text>
                  ),
                },
                {
                  key: "acoes",
                  label: "Ações",
                  width: "140px",
                  render: (fornecedor) => (
                    <HStack spacing={2}>
                      <DrawerComponent
                        buttonIcon={<EditIcon />}
                        buttonText=""
                        headerText="Editar Fornecedor"
                        buttonColorScheme="blue"
                        size="lg"
                        onOpenHook={() => {
                          setFornecedor(fornecedor);
                          reset();
                        }}
                        onAction={() => handleSubmit(handleEditSupplier)()}
                        isLoading={isSubmitting}
                      >
                        <VStack spacing={4} align="stretch">
                          {renderSupplierForm()}
                        </VStack>
                      </DrawerComponent>
                    </HStack>
                  ),
                },
              ]}
              data={filteredFornecedores}
              loading={loading}
              emptyMessage={
                searchTerm
                  ? "Nenhum fornecedor encontrado com esse termo."
                  : "Nenhum fornecedor cadastrado ainda."
              }
              rowProps={() => ({
                _hover: {
                  bg: "gray.50",
                  boxShadow: "inset 0 0 0 1px var(--chakra-colors-gray-100)",
                },
                transition: "all 0.15s",
              })}
            />

            {filteredFornecedores.length === 0 && !loading && (
              <Box textAlign="center" py={16}>
                <Text fontSize="lg" color="gray.500" mb={2}>
                  {searchTerm
                    ? "Nenhum fornecedor encontrado com esse termo."
                    : "Nenhum fornecedor cadastrado ainda."}
                </Text>
                <Text fontSize="sm" color="gray.400">
                  Utilize o botão "Novo Fornecedor" para adicionar o primeiro.
                </Text>
              </Box>
            )}
          </VStack>
        </Box>
      )}
    </Sidebar>
  );
};

export default Fornecedores;
