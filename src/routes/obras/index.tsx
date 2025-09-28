import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  TableContainer,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  Button,
  Card,
  CardBody,
  CardHeader,
  Badge,
  HStack,
  VStack,
  Divider,
} from "@chakra-ui/react";
import Sidebar from "../../components/Sidebar";
import DrawerComponent from "../../components/Drawer";

import { useEffect, useState } from "react";
import {
  AddIcon,
  SearchIcon,
  EditIcon,
  DeleteIcon,
  ViewIcon,
} from "@chakra-ui/icons";

import MoneyInput from "../../components/MoneyInput";
import { Link } from "react-router-dom";
import Helpers from "../../utils/helper";
import {
  IObrasTable,
  IObrasItem,
  obraSchema,
  obraItemSchema,
} from "../../stores/obras/interface";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createConstruction,
  createConstructionItem,
  getAllConstruction,
  getAllConstructionItems,
  removeConstruction,
  removeConstructionItem,
  updateConstructionItem,
} from "../../stores/obras/service";
import { IUserTable } from "../../stores/clientes/interface";
import { getAll } from "../../stores/clientes/service";
import ModalDelete from "../../components/ModalDelete";
import TiposDeLancamento from "./fragments/TiposDeLancamento";

const Obras = () => {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [obras, setObras] = useState<IObrasTable[]>([]);
  const [configs, setConfigs] = useState<IObrasItem[]>([]);
  const [config, setConfig] = useState<IObrasItem>({} as IObrasItem);
  const [clientes, setClientes] = useState<IUserTable[]>([]);

  const {
    register: registerObras,
    handleSubmit: handleSubmitObras,
    formState: { errors: errorsObras, isSubmitting: isSubmittingObras },
    reset: resetObras,
    control: controlObras,
    watch: watchObras,
  } = useForm<IObrasTable>({
    resolver: zodResolver(obraSchema),
    shouldFocusError: false,
  });

  const {
    register: registerObrasItem,
    handleSubmit: handleSubmitObrasItem,
    formState: { errors: errorsObrasItem, isSubmitting: isSubmittingObrasItem },
    reset: resetObrasItem,
    setValue: setValueObrasItem,
  } = useForm<IObrasItem>({
    resolver: zodResolver(obraItemSchema),
    shouldFocusError: false,
  });

  const handleCreateConstruction = async (data: IObrasTable) => {
    try {
      const administrationValue = parseFloat(
        watchObras("administration.value")
          ?.toString()
          ?.replace("R$ ", "")
          ?.replace(/\./g, "")
          ?.replace(",", ".") || "0"
      );
      const contractValue = parseFloat(
        watchObras("contract.value")
          ?.toString()
          ?.replace("R$ ", "")
          ?.replace(/\./g, "")
          ?.replace(",", ".") || "0"
      );

      await createConstruction({
        ...data,
        administration: {
          value: administrationValue,
          installments: Number(data?.administration?.installments),
          monthlyValue:
            administrationValue / Number(data?.administration?.installments),
          percentage: Number(data?.administration?.percentage),
        },
        contract: {
          value: contractValue,
          installments: Number(data?.contract?.installments),
          monthlyValue: contractValue / Number(data?.contract?.installments),
        },
      });

      const newObras = await getAllConstruction();
      setObras(newObras);
      resetObras();

      toast({
        title: "Obra criada com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: error?.response?.data?.message || "Erro ao criar obra",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCreateConstructionItem = async (data: IObrasItem) => {
    try {
      const construction = await createConstructionItem(data);
      const newConfigs = [...configs, construction];
      setConfigs(newConfigs);
      toast({
        title: "Item criado com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: error?.response?.data?.message || "Erro ao criar item",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEditConstructionItem = async (data: IObrasItem) => {
    try {
      await updateConstructionItem(data);
      const newConfig = await getAllConstructionItems();
      setConfigs(newConfig);
      toast({
        title: "Item editado com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: error?.response?.data?.message || "Erro ao editar item",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const obras = await getAllConstruction();
      const obrasItem = await getAllConstructionItems();
      const response = await getAll();
      setClientes(response);
      setObras(obras);
      setConfigs(obrasItem);
      setLoading(false);
    };
    fetch();
  }, []);

  const getContractType = (obra: IObrasTable) => {
    if (obra?.contract?.value && obra?.administration?.value) {
      return "Administração + Empreitada";
    } else if (obra?.contract?.value) {
      return "Empreitada";
    } else if (obra?.administration?.value) {
      return "Administração";
    }
    return "Não definido";
  };

  const getContractTypeColor = (obra: IObrasTable) => {
    if (obra?.contract?.value && obra?.administration?.value) {
      return "purple";
    } else if (obra?.contract?.value) {
      return "blue";
    } else if (obra?.administration?.value) {
      return "green";
    }
    return "gray";
  };

  useEffect(() => {
    setValueObrasItem("name", config.name);
    setValueObrasItem("_id", config._id);
  }, [config, setValueObrasItem]);

  const contractValue =
    watchObras("contract.value")
      ?.toString()
      ?.replace("R$ ", "")
      ?.replace(/\./g, "") || "0";
  const contractInstallments = watchObras("contract.installments");
  const administrationValue =
    watchObras("administration.value")
      ?.toString()
      ?.replace("R$ ", "")
      ?.replace(/\./g, "") || "0";
  const administrationInstallments = watchObras("administration.installments");

  const contractMonthlyValue =
    contractValue && contractInstallments
      ? (
          parseFloat(contractValue.replace(",", ".")) /
          Number(contractInstallments)
        ).toFixed(2)
      : "0";
  const administrationMonthlyValue =
    administrationValue && administrationInstallments
      ? (
          parseFloat(administrationValue.replace(",", ".")) /
          Number(administrationInstallments)
        ).toFixed(2)
      : "0";

  return (
    <Sidebar>
      {loading ? (
        <Flex justifyContent="center" alignItems="center" height="100vh">
          <Text fontSize="2xl">Carregando...</Text>
        </Flex>
      ) : (
        <Box w="100%" h="100%" p={6} fontFamily="Poppins-Regular">
          <VStack spacing={6} align="stretch">
            {/* Header */}
            <Flex justify="space-between" align="center">
              <VStack align="start" spacing={1}>
                <Text fontSize="3xl" fontWeight="bold" color="gray.800">
                  Gestão de Obras
                </Text>
                <Text color="gray.600" fontSize="md">
                  Gerencie suas obras, configurações e tipos de lançamento
                </Text>
              </VStack>
            </Flex>

            <Tabs variant="enclosed" size="lg" colorScheme="blue">
              <TabList>
                <Tab fontWeight="medium">
                  <HStack spacing={2}>
                    <ViewIcon />
                    <Text>Obras Ativas</Text>
                  </HStack>
                </Tab>
                <Tab fontWeight="medium">
                  <HStack spacing={2}>
                    <EditIcon />
                    <Text>Configurações</Text>
                  </HStack>
                </Tab>
                <Tab fontWeight="medium">
                  <HStack spacing={2}>
                    <AddIcon />
                    <Text>Tipos de Lançamento</Text>
                  </HStack>
                </Tab>
              </TabList>

              <TabPanels>
                {/* Aba: Obras Ativas */}
                <TabPanel px={0}>
                  <VStack spacing={6} align="stretch">
                    {/* Actions Bar */}
                    <Card>
                      <CardBody>
                        <Flex
                          justify="space-between"
                          align="center"
                          wrap="wrap"
                          gap={4}
                        >
                          <HStack spacing={4} flex="1">
                            <InputGroup maxW="400px">
                              <InputLeftElement pointerEvents="none">
                                <SearchIcon color="gray.400" />
                              </InputLeftElement>
                              <Input
                                placeholder="Buscar obras..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                bg="white"
                                border="1px"
                                borderColor="gray.200"
                                _focus={{
                                  borderColor: "blue.400",
                                  boxShadow: "0 0 0 1px blue.400",
                                }}
                              />
                            </InputGroup>
                          </HStack>

                          <DrawerComponent
                            buttonIcon={<AddIcon />}
                            buttonText="Nova Obra"
                            headerText="Cadastrar Nova Obra"
                            buttonColorScheme="blue"
                            size="lg"
                            isButton
                            onOpenHook={() => resetObras()}
                            onAction={() =>
                              handleSubmitObras(handleCreateConstruction)()
                            }
                            isLoading={isSubmittingObras}
                          >
                            <VStack spacing={6} align="stretch">
                              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                                <FormControl gridColumn="span 2">
                                  <FormLabel
                                    fontWeight="medium"
                                    color="gray.700"
                                  >
                                    Nome da Obra
                                  </FormLabel>
                                  <Input
                                    {...registerObras("name")}
                                    placeholder="Ex: Residencial Jardim das Flores"
                                  />
                                  {errorsObras.name && (
                                    <Text color="red.500" fontSize="sm">
                                      {String(errorsObras.name.message)}
                                    </Text>
                                  )}
                                </FormControl>

                                <FormControl gridColumn="span 2">
                                  <FormLabel
                                    fontWeight="medium"
                                    color="gray.700"
                                  >
                                    Endereço da Obra
                                  </FormLabel>
                                  <Input
                                    {...registerObras("constructionAddress")}
                                    placeholder="Rua, Número, Bairro, Cidade"
                                  />
                                  {errorsObras.constructionAddress && (
                                    <Text color="red.500" fontSize="sm">
                                      {errorsObras.constructionAddress.message}
                                    </Text>
                                  )}
                                </FormControl>

                                <FormControl gridColumn="span 2">
                                  <FormLabel
                                    fontWeight="medium"
                                    color="gray.700"
                                  >
                                    Cliente
                                  </FormLabel>
                                  <Controller
                                    name="customerId"
                                    control={controlObras}
                                    defaultValue=""
                                    render={({ field }) => (
                                      <Select
                                        {...field}
                                        placeholder="Selecione o cliente"
                                      >
                                        {clientes.map((cliente, index) => (
                                          <option
                                            key={index}
                                            value={cliente._id}
                                          >
                                            {cliente.name}
                                          </option>
                                        ))}
                                      </Select>
                                    )}
                                  />
                                  {errorsObras.customerId && (
                                    <Text color="red.500" fontSize="sm">
                                      {errorsObras.customerId.message}
                                    </Text>
                                  )}
                                </FormControl>
                              </Grid>

                              <Divider />

                              {/* Seção Administração */}
                              <Box>
                                <Text
                                  fontSize="lg"
                                  fontWeight="semibold"
                                  color="green.600"
                                  mb={4}
                                >
                                  💼 Configuração de Administração
                                </Text>
                                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                                  <FormControl>
                                    <FormLabel
                                      fontWeight="medium"
                                      color="gray.700"
                                    >
                                      Valor do Contrato
                                    </FormLabel>
                                    <MoneyInput
                                      control={controlObras}
                                      name="administration.value"
                                      defaultValue={null}
                                    />
                                    {errorsObras.administration?.value && (
                                      <Text color="red.500" fontSize="sm">
                                        {
                                          errorsObras.administration?.value
                                            .message
                                        }
                                      </Text>
                                    )}
                                  </FormControl>

                                  <FormControl>
                                    <FormLabel
                                      fontWeight="medium"
                                      color="gray.700"
                                    >
                                      Número de Parcelas
                                    </FormLabel>
                                    <Input
                                      {...registerObras(
                                        "administration.installments"
                                      )}
                                      type="number"
                                      placeholder="12"
                                    />
                                    {errorsObras.administration
                                      ?.installments && (
                                      <Text color="red.500" fontSize="sm">
                                        {
                                          errorsObras.administration
                                            ?.installments.message
                                        }
                                      </Text>
                                    )}
                                  </FormControl>

                                  <FormControl>
                                    <FormLabel
                                      fontWeight="medium"
                                      color="gray.700"
                                    >
                                      Valor Mensal
                                    </FormLabel>
                                    <Input
                                      value={`R$ ${administrationMonthlyValue}`}
                                      readOnly
                                      bg="gray.50"
                                    />
                                  </FormControl>
                                </Grid>
                              </Box>

                              <Divider />

                              {/* Seção Empreitada */}
                              <Box>
                                <Text
                                  fontSize="lg"
                                  fontWeight="semibold"
                                  color="blue.600"
                                  mb={4}
                                >
                                  🏗️ Configuração de Empreitada
                                </Text>
                                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                                  <FormControl>
                                    <FormLabel
                                      fontWeight="medium"
                                      color="gray.700"
                                    >
                                      Valor do Contrato
                                    </FormLabel>
                                    <MoneyInput
                                      control={controlObras}
                                      name="contract.value"
                                      defaultValue={null}
                                    />
                                    {errorsObras.contract?.value && (
                                      <Text color="red.500" fontSize="sm">
                                        {errorsObras.contract?.value.message}
                                      </Text>
                                    )}
                                  </FormControl>

                                  <FormControl>
                                    <FormLabel
                                      fontWeight="medium"
                                      color="gray.700"
                                    >
                                      Número de Parcelas
                                    </FormLabel>
                                    <Input
                                      {...registerObras(
                                        "contract.installments"
                                      )}
                                      type="number"
                                      placeholder="24"
                                    />
                                    {errorsObras.contract?.installments && (
                                      <Text color="red.500" fontSize="sm">
                                        {
                                          errorsObras.contract?.installments
                                            .message
                                        }
                                      </Text>
                                    )}
                                  </FormControl>

                                  <FormControl>
                                    <FormLabel
                                      fontWeight="medium"
                                      color="gray.700"
                                    >
                                      Valor Mensal
                                    </FormLabel>
                                    <Input
                                      value={`R$ ${contractMonthlyValue}`}
                                      readOnly
                                      bg="gray.50"
                                    />
                                  </FormControl>
                                </Grid>
                              </Box>

                              <Divider />

                              {/* Valores Extras */}
                              <Box>
                                <Text
                                  fontSize="lg"
                                  fontWeight="semibold"
                                  color="orange.600"
                                  mb={4}
                                >
                                  ➕ Valores Extras
                                </Text>
                                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                                  <FormControl>
                                    <FormLabel
                                      fontWeight="medium"
                                      color="gray.700"
                                    >
                                      Extra - Mão de Obra
                                    </FormLabel>
                                    <Input
                                      {...registerObras("extraLabor")}
                                      type="number"
                                      placeholder="0"
                                    />
                                    {errorsObras.extraLabor && (
                                      <Text color="red.500" fontSize="sm">
                                        {errorsObras.extraLabor.message}
                                      </Text>
                                    )}
                                  </FormControl>

                                  <FormControl>
                                    <FormLabel
                                      fontWeight="medium"
                                      color="gray.700"
                                    >
                                      Extra - Administração
                                    </FormLabel>
                                    <Input
                                      {...registerObras("extraAdm")}
                                      placeholder="0"
                                    />
                                    {errorsObras.extraAdm && (
                                      <Text color="red.500" fontSize="sm">
                                        {errorsObras.extraAdm.message}
                                      </Text>
                                    )}
                                  </FormControl>
                                </Grid>
                              </Box>
                            </VStack>
                          </DrawerComponent>
                        </Flex>
                      </CardBody>
                    </Card>

                    {/* Lista de Obras */}
                    <Grid
                      templateColumns="repeat(auto-fill, minmax(350px, 1fr))"
                      gap={6}
                    >
                      {obras
                        .filter((obra) =>
                          obra.name
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                        )
                        .map((obra, index) => (
                          <Card
                            key={index}
                            shadow="md"
                            _hover={{ shadow: "lg" }}
                            transition="all 0.2s"
                          >
                            <CardHeader pb={2}>
                              <Flex justify="space-between" align="start">
                                <VStack align="start" spacing={1} flex="1">
                                  <Text
                                    fontSize="lg"
                                    fontWeight="bold"
                                    color="gray.800"
                                    noOfLines={1}
                                  >
                                    {obra.name}
                                  </Text>
                                  <Text
                                    fontSize="sm"
                                    color="gray.600"
                                    noOfLines={2}
                                  >
                                    📍 {obra.constructionAddress}
                                  </Text>
                                </VStack>
                                <Badge
                                  colorScheme={getContractTypeColor(obra)}
                                  variant="subtle"
                                  fontSize="xs"
                                  px={2}
                                  py={1}
                                >
                                  {getContractType(obra)}
                                </Badge>
                              </Flex>
                            </CardHeader>

                            <CardBody pt={0}>
                              <VStack spacing={3} align="stretch">
                                {obra.contract?.value && (
                                  <Box
                                    p={3}
                                    bg="blue.50"
                                    borderRadius="md"
                                    borderLeft="4px"
                                    borderLeftColor="blue.400"
                                  >
                                    <Text
                                      fontSize="xs"
                                      color="blue.600"
                                      fontWeight="medium"
                                    >
                                      EMPREITADA
                                    </Text>
                                    <Text
                                      fontSize="sm"
                                      fontWeight="bold"
                                      color="blue.800"
                                    >
                                      {Helpers.toBrazilianCurrency(
                                        obra.contract.value
                                      )}
                                    </Text>
                                  </Box>
                                )}

                                {obra.administration?.value && (
                                  <Box
                                    p={3}
                                    bg="green.50"
                                    borderRadius="md"
                                    borderLeft="4px"
                                    borderLeftColor="green.400"
                                  >
                                    <Text
                                      fontSize="xs"
                                      color="green.600"
                                      fontWeight="medium"
                                    >
                                      ADMINISTRAÇÃO
                                    </Text>
                                    <Text
                                      fontSize="sm"
                                      fontWeight="bold"
                                      color="green.800"
                                    >
                                      {Helpers.toBrazilianCurrency(
                                        obra.administration.value
                                      )}
                                    </Text>
                                  </Box>
                                )}

                                <Divider />

                                <Flex justify="space-between" align="center">
                                  <HStack spacing={2}>
                                    <ModalDelete
                                      headerText="Excluir Obra"
                                      buttonIcon={<DeleteIcon />}
                                      buttonColorScheme="red"
                                      onDelete={async () => {
                                        try {
                                          await removeConstruction(
                                            obra._id || ""
                                          );
                                          const newObras =
                                            await getAllConstruction();
                                          setObras(newObras);
                                          toast({
                                            title: "Obra excluída com sucesso!",
                                            status: "success",
                                            duration: 3000,
                                            isClosable: true,
                                          });
                                        } catch (error: any) {
                                          toast({
                                            title:
                                              error?.response?.data?.message ||
                                              "Erro ao excluir obra",
                                            status: "error",
                                            duration: 3000,
                                            isClosable: true,
                                          });
                                        }
                                      }}
                                    >
                                      <Text>
                                        Tem certeza que deseja excluir a obra{" "}
                                        <strong>{obra.name}</strong>?
                                      </Text>
                                      <Text
                                        fontSize="sm"
                                        color="gray.600"
                                        mt={2}
                                      >
                                        Esta ação não pode ser desfeita.
                                      </Text>
                                    </ModalDelete>
                                  </HStack>

                                  <Button
                                    as={Link}
                                    to={`/obras/${obra._id}`}
                                    size="sm"
                                    colorScheme="blue"
                                    rightIcon={<ViewIcon />}
                                  >
                                    Ver Detalhes
                                  </Button>
                                </Flex>
                              </VStack>
                            </CardBody>
                          </Card>
                        ))}
                    </Grid>

                    {obras.filter((obra) =>
                      obra.name.toLowerCase().includes(searchTerm.toLowerCase())
                    ).length === 0 && (
                      <Card>
                        <CardBody textAlign="center" py={12}>
                          <Text fontSize="lg" color="gray.500">
                            {searchTerm
                              ? "Nenhuma obra encontrada com esse termo."
                              : "Nenhuma obra cadastrada ainda."}
                          </Text>
                        </CardBody>
                      </Card>
                    )}
                  </VStack>
                </TabPanel>

                {/* Aba: Configurações */}
                <TabPanel px={0}>
                  <VStack spacing={6} align="stretch">
                    <Card>
                      <CardHeader>
                        <Flex justify="space-between" align="center">
                          <VStack align="start" spacing={1}>
                            <Text fontSize="xl" fontWeight="bold">
                              Itens de Configuração
                            </Text>
                            <Text color="gray.600" fontSize="sm">
                              Gerencie os itens disponíveis para suas obras
                            </Text>
                          </VStack>

                          <DrawerComponent
                            buttonIcon={<AddIcon />}
                            buttonText="Novo Item"
                            headerText="Adicionar Item de Configuração"
                            buttonColorScheme="green"
                            size="md"
                            isButton
                            onOpenHook={() => resetObrasItem()}
                            onAction={() =>
                              handleSubmitObrasItem(
                                handleCreateConstructionItem
                              )()
                            }
                            isLoading={isSubmittingObrasItem}
                          >
                            <FormControl>
                              <FormLabel fontWeight="medium">
                                Nome do Item
                              </FormLabel>
                              <Input
                                {...registerObrasItem("name")}
                                placeholder="Ex: Cimento, Tijolo, Areia..."
                              />
                              {errorsObrasItem.name && (
                                <Text color="red.500" fontSize="sm">
                                  {errorsObrasItem.name.message}
                                </Text>
                              )}
                            </FormControl>
                          </DrawerComponent>
                        </Flex>
                      </CardHeader>

                      <CardBody>
                        <TableContainer>
                          <Table variant="simple">
                            <Thead>
                              <Tr>
                                <Th>Nome do Item</Th>
                                <Th>Data de Cadastro</Th>
                                <Th width="120px">Ações</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {configs.map((config, index) => (
                                <Tr key={index}>
                                  <Td fontWeight="medium">{config.name}</Td>
                                  <Td color="gray.600">
                                    {Helpers.toViewDate(config.createdAt ?? "")}
                                  </Td>
                                  <Td>
                                    <HStack spacing={2}>
                                      <DrawerComponent
                                        buttonIcon={<EditIcon />}
                                        buttonText=""
                                        headerText="Editar Item"
                                        buttonColorScheme="blue"
                                        size="md"
                                        onOpenHook={() => setConfig(config)}
                                        onAction={() =>
                                          handleSubmitObrasItem(
                                            handleEditConstructionItem
                                          )()
                                        }
                                        isLoading={isSubmittingObrasItem}
                                      >
                                        <FormControl>
                                          <FormLabel fontWeight="medium">
                                            Nome do Item
                                          </FormLabel>
                                          <Input
                                            {...registerObrasItem("name")}
                                            placeholder="Nome do item"
                                          />
                                        </FormControl>
                                      </DrawerComponent>

                                      <ModalDelete
                                        headerText="Excluir Item"
                                        buttonIcon={<DeleteIcon />}
                                        buttonColorScheme="red"
                                        onDelete={async () => {
                                          try {
                                            await removeConstructionItem(
                                              config._id ?? ""
                                            );
                                            const newConfigs =
                                              await getAllConstructionItems();
                                            setConfigs(newConfigs);
                                            toast({
                                              title:
                                                "Item excluído com sucesso!",
                                              status: "success",
                                              duration: 3000,
                                              isClosable: true,
                                            });
                                          } catch (error: any) {
                                            toast({
                                              title:
                                                error?.response?.data
                                                  ?.message ||
                                                "Erro ao excluir item",
                                              status: "error",
                                              duration: 3000,
                                              isClosable: true,
                                            });
                                          }
                                        }}
                                      >
                                        <Text>
                                          Tem certeza que deseja excluir o item{" "}
                                          <strong>{config.name}</strong>?
                                        </Text>
                                      </ModalDelete>
                                    </HStack>
                                  </Td>
                                </Tr>
                              ))}
                            </Tbody>
                          </Table>
                        </TableContainer>
                      </CardBody>
                    </Card>
                  </VStack>
                </TabPanel>

                {/* Aba: Tipos de Lançamento */}
                <TabPanel px={0}>
                  <TiposDeLancamento />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
        </Box>
      )}
    </Sidebar>
  );
};

export default Obras;
