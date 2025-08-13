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
} from "@chakra-ui/react";
import Sidebar from "../../components/Sidebar";
import DrawerComponent from "../../components/Drawer";
import { useEffect, useState } from "react";
import { AddIcon, SearchIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { IUserTable, schema } from "../../stores/clientes/interface";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CpfInput from "../../components/CpfInput";
import Helpers from "../../utils/helper";
import {
  createCustomer,
  getAll,
  updateCustomer,
  deleteCustomer,
} from "../../stores/clientes/service";
import ModalDelete from "../../components/ModalDelete";
import StyledTable from "../../components/StyledTable";

const Clientes = () => {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState<IUserTable[]>([]);
  const [cliente, setCliente] = useState<IUserTable>({} as IUserTable);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
    control,
    watch,
  } = useForm<IUserTable>({
    resolver: zodResolver(schema),
    shouldFocusError: false,
  });

  const handleCreateCustomer = async (data: IUserTable) => {
    try {
      const response = await createCustomer(data);
      setClientes([...clientes, response]);
      reset();
      toast({
        title: "Cliente criado com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: error?.response?.data?.message || "Erro ao criar cliente!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEditCustomer = async (data: IUserTable) => {
    try {
      await updateCustomer(data);
      const newClientes = await getAll();
      setClientes(newClientes);
      toast({
        title: "Cliente editado com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: error?.response?.data?.message || "Erro ao editar cliente!",
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
      setClientes(response);
      setLoading(false);
    };
    fetch();
  }, []);

  useEffect(() => {
    setValue("name", cliente.name);
    setValue("cpf", cliente.cpf);
    setValue("rg", cliente.rg);
    setValue("email", cliente.email);
    setValue("birthDate", Helpers.toViewDate(cliente.birthDate));
    setValue("billingAdress", cliente.billingAdress);
    setValue("_id", cliente._id);
  }, [setValue, cliente]);

  const cpfValue = watch("cpf");

  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join("");
  };

  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.cpf?.includes(searchTerm) ||
      cliente.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderCustomerForm = () => (
    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
      <FormControl gridColumn="span 2">
        <FormLabel fontWeight="medium" color="gray.700">
          Nome Completo
        </FormLabel>
        <Input
          {...register("name")}
          placeholder="Ex: João da Silva Santos"
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
          CPF
        </FormLabel>
        <CpfInput control={control} defaultValue={watch("cpf") || cpfValue} />
        {errors.cpf && (
          <Text color="red.500" fontSize="sm">
            {errors.cpf.message}
          </Text>
        )}
      </FormControl>

      <FormControl>
        <FormLabel fontWeight="medium" color="gray.700">
          RG
        </FormLabel>
        <Input {...register("rg")} placeholder="00.000.000-0" />
        {errors.rg && (
          <Text color="red.500" fontSize="sm">
            {errors.rg.message}
          </Text>
        )}
      </FormControl>

      <FormControl>
        <FormLabel fontWeight="medium" color="gray.700">
          Email
        </FormLabel>
        <Input
          {...register("email")}
          placeholder="joao@exemplo.com"
          type="email"
        />
        {errors.email && (
          <Text color="red.500" fontSize="sm">
            {errors.email.message}
          </Text>
        )}
      </FormControl>

      <FormControl>
        <FormLabel fontWeight="medium" color="gray.700">
          Data de Nascimento
        </FormLabel>
        <Input {...register("birthDate")} type="date" />
        {errors.birthDate && (
          <Text color="red.500" fontSize="sm">
            {errors.birthDate.message}
          </Text>
        )}
      </FormControl>

      <FormControl gridColumn="span 2">
        <FormLabel fontWeight="medium" color="gray.700">
          Endereço de Cobrança
        </FormLabel>
        <Input
          {...register("billingAdress")}
          placeholder="Rua das Flores, 123, Centro, Cidade - UF"
        />
        {errors.billingAdress && (
          <Text color="red.500" fontSize="sm">
            {errors.billingAdress.message}
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
                  Gestão de Clientes
                </Text>
                <Text color="gray.600" fontSize="md">
                  Gerencie informações dos seus clientes
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
                        placeholder="Buscar clientes..."
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
                      {filteredClientes.length} cliente
                      {filteredClientes.length !== 1 ? "s" : ""}
                    </Badge>
                  </HStack>

                  <DrawerComponent
                    buttonIcon={<AddIcon />}
                    buttonText="Novo Cliente"
                    headerText="Cadastrar Novo Cliente"
                    buttonColorScheme="green"
                    size="lg"
                    isButton
                    onOpenHook={() => {
                      setCliente({} as IUserTable);
                      reset();
                    }}
                    onAction={() => handleSubmit(handleCreateCustomer)()}
                    isLoading={isSubmitting}
                  >
                    <VStack spacing={4} align="stretch">
                      {renderCustomerForm()}
                    </VStack>
                  </DrawerComponent>
                </Flex>
              </CardBody>
            </Card>

            {/* Tabela de Clientes */}
            <StyledTable
              columns={[
                {
                  key: "cliente",
                  label: "Cliente",
                  render: (cliente) => (
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
                        {getInitials(cliente.name)}
                      </Box>
                      <VStack align="start" spacing={0} maxW="260px">
                        <Text
                          fontWeight="semibold"
                          color="gray.800"
                          noOfLines={1}
                        >
                          {cliente.name}
                        </Text>
                        {cliente.billingAdress && (
                          <Text fontSize="xs" color="gray.600" noOfLines={1}>
                            {cliente.billingAdress}
                          </Text>
                        )}
                      </VStack>
                    </HStack>
                  ),
                },
                {
                  key: "documentos",
                  label: "Documentos",
                  render: (cliente) => (
                    <VStack align="start" spacing={0} fontSize="xs">
                      <Text fontWeight="medium">CPF: {cliente.cpf || "-"}</Text>
                      <Text color="gray.600">RG: {cliente.rg || "-"}</Text>
                    </VStack>
                  ),
                },
                {
                  key: "email",
                  label: "Contato",
                  render: (cliente) => (
                    <Text
                      fontSize="sm"
                      color="blue.600"
                      noOfLines={1}
                      maxW="200px"
                    >
                      {cliente.email || "-"}
                    </Text>
                  ),
                },
                {
                  key: "acoes",
                  label: "Ações",
                  width: "140px",
                  render: (cliente) => (
                    <HStack spacing={2}>
                      <DrawerComponent
                        buttonIcon={<EditIcon />}
                        buttonText=""
                        headerText="Editar Cliente"
                        buttonColorScheme="blue"
                        size="lg"
                        onOpenHook={() => {
                          setCliente(cliente);
                          reset();
                        }}
                        onAction={() => handleSubmit(handleEditCustomer)()}
                        isLoading={isSubmitting}
                      >
                        <VStack spacing={4} align="stretch">
                          {renderCustomerForm()}
                        </VStack>
                      </DrawerComponent>
                      <ModalDelete
                        headerText="Excluir Cliente"
                        buttonIcon={<DeleteIcon />}
                        buttonColorScheme="red"
                        onDelete={async () => {
                          try {
                            await deleteCustomer(cliente._id || "");
                            const newClientes = await getAll();
                            setClientes(newClientes);
                            toast({
                              title: "Cliente excluído com sucesso!",
                              status: "success",
                              duration: 3000,
                              isClosable: true,
                            });
                          } catch (error: any) {
                            toast({
                              title:
                                error?.response?.data?.message ||
                                "Erro ao excluir cliente",
                              status: "error",
                              duration: 3000,
                              isClosable: true,
                            });
                          }
                        }}
                      >
                        <Text>
                          Tem certeza que deseja excluir o cliente{" "}
                          <strong>{cliente.name}</strong>?
                        </Text>
                        <Text fontSize="sm" color="gray.600" mt={2}>
                          Esta ação não pode ser desfeita.
                        </Text>
                      </ModalDelete>
                    </HStack>
                  ),
                },
              ]}
              data={filteredClientes}
              loading={loading}
              emptyMessage={
                searchTerm
                  ? "Nenhum cliente encontrado com esse termo."
                  : "Nenhum cliente cadastrado ainda."
              }
              rowProps={() => ({
                _hover: {
                  bg: "gray.50",
                  boxShadow: "inset 0 0 0 1px var(--chakra-colors-gray-100)",
                },
                transition: "all 0.15s",
              })}
            />
            {/* ...existing code... */}
          </VStack>
        </Box>
      )}
    </Sidebar>
  );
};

export default Clientes;
