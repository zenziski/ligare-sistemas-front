import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  Card,
  CardBody,
  CardHeader,
  HStack,
  VStack,
  Badge,
  Skeleton,
  Icon,
  Checkbox,
  Avatar,
} from "@chakra-ui/react";
import Sidebar from "../../components/Sidebar";
import DrawerComponent from "../../components/Drawer";
import { useEffect, useState } from "react";
import { AddIcon, SearchIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { IUser, schema } from "../../stores/usuarios/interface";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PhoneInput from "../../components/PhoneInput";
import {
  createUser,
  getAll,
  updateUser,
  removeUser,
} from "../../stores/usuarios/service";
import ModalDelete from "../../components/ModalDelete";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import moment from "moment";

const Usuarios = () => {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const [user, setUser] = useState<IUser>({} as IUser);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
    control,
    watch,
  } = useForm<IUser>({
    resolver: zodResolver(schema),
    shouldFocusError: false,
  });

  const handleCreateUser = async (data: IUser) => {
    try {
      const response = await createUser(data);
      setUsers([...users, response]);
      reset();
      toast({
        title: "Usuário criado com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: error?.response?.data?.message || "Erro ao criar usuário!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEditUser = async (data: IUser) => {
    try {
      if (data.changePassword) {
        data.password = data.changePassword;
      }
      await updateUser(data);
      const newUsers = await getAll();
      setUsers(newUsers);
      toast({
        title: "Usuário editado com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: error?.response?.data?.message || "Erro ao editar usuário!",
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
      setUsers(response);
      setLoading(false);
    };
    fetch();
  }, []);

  useEffect(() => {
    setValue("name", user.name);
    setValue("email", user.email);
    setValue("phoneNumber", user.phoneNumber);
    setValue(
      "birthDate",
      user.birthDate ? moment(user.birthDate).format("YYYY-MM-DD") : ""
    );
    setValue(
      "admissionDate",
      user.admissionDate ? moment(user.admissionDate).format("YYYY-MM-DD") : ""
    );
    setValue("hoursToWork", user.hoursToWork);
    setValue("roles", user.roles);
    setValue("password", user.password);
    setValue("confirmPassword", user.confirmPassword);
    setValue("_id", user._id);
  }, [setValue, user]);

  const phoneValue = watch("phoneNumber");

  const getUserStatus = (user: IUser) => {
    const hasAllData =
      user.name && user.email && user.phoneNumber && user.admissionDate;
    return hasAllData ? "Completo" : "Incompleto";
  };

  const getUserStatusColor = (user: IUser) => {
    const status = getUserStatus(user);
    return status === "Completo" ? "green" : "orange";
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber?.includes(searchTerm)
  );

  const renderUserForm = () => (
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

      <FormControl gridColumn="span 2">
        <FormLabel fontWeight="medium" color="gray.700">
          Email
        </FormLabel>
        <Input
          {...register("email")}
          placeholder="joao@exemplo.com"
          type="email"
          focusBorderColor="blue.400"
        />
        {errors.email && (
          <Text color="red.500" fontSize="sm">
            {errors.email.message}
          </Text>
        )}
      </FormControl>

      {!user._id && (
        <>
          <FormControl gridColumn="span 2">
            <FormLabel fontWeight="medium" color="gray.700">
              Senha
            </FormLabel>
            <Input
              {...register("password")}
              type="password"
              focusBorderColor="blue.400"
            />
            {errors.password && (
              <Text color="red.500" fontSize="sm">
                {errors.password.message}
              </Text>
            )}
          </FormControl>

          <FormControl gridColumn="span 2">
            <FormLabel fontWeight="medium" color="gray.700">
              Confirmar Senha
            </FormLabel>
            <Input
              {...register("confirmPassword")}
              type="password"
              focusBorderColor="blue.400"
            />
            {errors.confirmPassword && (
              <Text color="red.500" fontSize="sm">
                {errors.confirmPassword.message}
              </Text>
            )}
          </FormControl>
        </>
      )}

      {user._id && (
        <FormControl gridColumn="span 2">
          <FormLabel fontWeight="medium" color="gray.700">
            Alterar Senha
          </FormLabel>
          <Input
            {...register("changePassword")}
            type="password"
            placeholder="Deixe em branco para manter a senha atual"
            focusBorderColor="blue.400"
          />
          {errors.changePassword && (
            <Text color="red.500" fontSize="sm">
              {errors.changePassword.message}
            </Text>
          )}
        </FormControl>
      )}

      <FormControl>
        <FormLabel fontWeight="medium" color="gray.700">
          Telefone
        </FormLabel>
        <PhoneInput control={control} defaultValue={phoneValue} />
        {errors.phoneNumber && (
          <Text color="red.500" fontSize="sm">
            {errors.phoneNumber.message}
          </Text>
        )}
      </FormControl>

      <FormControl>
        <FormLabel fontWeight="medium" color="gray.700">
          Data de Nascimento
        </FormLabel>
        <Input
          {...register("birthDate")}
          type="date"
          focusBorderColor="blue.400"
        />
        {errors.birthDate && (
          <Text color="red.500" fontSize="sm">
            {errors.birthDate.message}
          </Text>
        )}
      </FormControl>

      <FormControl>
        <FormLabel fontWeight="medium" color="gray.700">
          Data de Admissão
        </FormLabel>
        <Input
          {...register("admissionDate")}
          type="date"
          focusBorderColor="blue.400"
        />
        {errors.admissionDate && (
          <Text color="red.500" fontSize="sm">
            {errors.admissionDate.message}
          </Text>
        )}
      </FormControl>

      <FormControl>
        <FormLabel fontWeight="medium" color="gray.700">
          Carga Horária (horas)
        </FormLabel>
        <Input
          {...register("hoursToWork")}
          type="number"
          placeholder="40"
          focusBorderColor="blue.400"
        />
        {errors.hoursToWork && (
          <Text color="red.500" fontSize="sm">
            {errors.hoursToWork.message}
          </Text>
        )}
      </FormControl>

      <FormControl gridColumn="span 2">
        <FormLabel fontWeight="medium" color="gray.700">
          Permissões
        </FormLabel>
        <Checkbox {...register("roles.admin")} colorScheme="blue">
          Administrador
        </Checkbox>
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
                  Gestão de Usuários
                </Text>
                <Text color="gray.600" fontSize="md">
                  Gerencie informações dos usuários do sistema
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
                        placeholder="Buscar usuários..."
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
                      {filteredUsers.length} usuário
                      {filteredUsers.length !== 1 ? "s" : ""}
                    </Badge>
                  </HStack>

                  <DrawerComponent
                    buttonIcon={<AddIcon />}
                    buttonText="Novo Usuário"
                    headerText="Cadastrar Novo Usuário"
                    buttonColorScheme="green"
                    size="lg"
                    isButton
                    onOpenHook={() => {
                      setUser({} as IUser);
                      reset();
                    }}
                    onAction={() => handleSubmit(handleCreateUser)()}
                    isLoading={isSubmitting}
                  >
                    <VStack spacing={4} align="stretch">
                      {renderUserForm()}
                    </VStack>
                  </DrawerComponent>
                </Flex>
              </CardBody>
            </Card>

            {/* Tabela de Usuários */}

            <TableContainer>
              <Table
                variant="simple"
                size="md"
                sx={{
                  th: { bg: "gray.50", fontSize: "sm", py: 3 },
                  td: { py: 3, fontSize: "sm" },
                }}
              >
                <Thead>
                  <Tr>
                    <Th>Usuário</Th>
                    <Th>Telefone</Th>
                    <Th>Data de Admissão</Th>
                    <Th>Data de Nascimento</Th>
                    <Th>Carga Horária</Th>
                    <Th>Status</Th>
                    <Th width="140px">Ações</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredUsers.map((user) => (
                    <Tr
                      key={user._id}
                      _hover={{
                        bg: "gray.50",
                        boxShadow:
                          "inset 0 0 0 1px var(--chakra-colors-gray-100)",
                      }}
                      transition="all 0.15s"
                    >
                      <Td>
                        <HStack align="center" spacing={4}>
                          <Avatar
                            size="sm"
                            name={user.name}
                            bg="blue.500"
                            color="white"
                            fontSize="sm"
                            fontWeight="bold"
                          />
                          <VStack align="start" spacing={0} maxW="260px">
                            <HStack spacing={2}>
                              <Text
                                fontWeight="semibold"
                                color="gray.800"
                                noOfLines={1}
                              >
                                {user.name}
                              </Text>
                              {user?.roles?.admin && (
                                <Badge
                                  colorScheme="green"
                                  variant="solid"
                                  fontSize="0.6rem"
                                  px={2}
                                  py={0.5}
                                  borderRadius="full"
                                >
                                  Admin
                                </Badge>
                              )}
                            </HStack>
                            <Text fontSize="xs" color="gray.600" noOfLines={1}>
                              {user.email}
                            </Text>
                          </VStack>
                        </HStack>
                      </Td>
                      <Td>
                        <Text fontSize="sm">{user.phoneNumber || "-"}</Text>
                      </Td>
                      <Td>
                        <Text fontSize="sm">
                          {user.admissionDate
                            ? moment(user.admissionDate).format("DD/MM/YYYY")
                            : "-"}
                        </Text>
                      </Td>
                      <Td>
                        <Text fontSize="sm">
                          {user.birthDate
                            ? moment(user.birthDate).format("DD/MM/YYYY")
                            : "-"}
                        </Text>
                      </Td>
                      <Td>
                        <Text fontSize="sm">
                          {user.hoursToWork ? `${user.hoursToWork}h` : "-"}
                        </Text>
                      </Td>
                      <Td>
                        <Badge
                          colorScheme={getUserStatusColor(user)}
                          variant="subtle"
                          fontSize="0.7rem"
                          px={3}
                          py={1}
                          display="inline-flex"
                          alignItems="center"
                          gap={1}
                          borderRadius="full"
                        >
                          <Icon
                            as={
                              getUserStatus(user) === "Completo"
                                ? CheckCircleIcon
                                : WarningIcon
                            }
                          />
                          {getUserStatus(user)}
                        </Badge>
                      </Td>
                      <Td>
                        <HStack spacing={2}>
                          <DrawerComponent
                            buttonIcon={<EditIcon />}
                            buttonText=""
                            headerText="Editar Usuário"
                            buttonColorScheme="blue"
                            size="lg"
                            onOpenHook={() => {
                              setUser(user);
                              reset();
                            }}
                            onAction={() => handleSubmit(handleEditUser)()}
                            isLoading={isSubmitting}
                          >
                            <VStack spacing={4} align="stretch">
                              {renderUserForm()}
                            </VStack>
                          </DrawerComponent>
                          <ModalDelete
                            headerText="Excluir Usuário"
                            buttonIcon={<DeleteIcon />}
                            buttonColorScheme="red"
                            onDelete={async () => {
                              try {
                                await removeUser(user._id || "");
                                const newUsers = await getAll();
                                setUsers(newUsers);
                                toast({
                                  title: "Usuário excluído com sucesso!",
                                  status: "success",
                                  duration: 3000,
                                  isClosable: true,
                                });
                              } catch (error: any) {
                                toast({
                                  title:
                                    error?.response?.data?.message ||
                                    "Erro ao excluir usuário",
                                  status: "error",
                                  duration: 3000,
                                  isClosable: true,
                                });
                              }
                            }}
                          >
                            <Text>
                              Tem certeza que deseja excluir o usuário{" "}
                              <strong>{user.name}</strong>?
                            </Text>
                            <Text fontSize="sm" color="gray.600" mt={2}>
                              Esta ação não pode ser desfeita.
                            </Text>
                          </ModalDelete>
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>

            {filteredUsers.length === 0 && !loading && (
              <Box textAlign="center" py={16}>
                <Text fontSize="lg" color="gray.500" mb={2}>
                  {searchTerm
                    ? "Nenhum usuário encontrado com esse termo."
                    : "Nenhum usuário cadastrado ainda."}
                </Text>
                <Text fontSize="sm" color="gray.400">
                  Utilize o botão "Novo Usuário" para adicionar o primeiro.
                </Text>
              </Box>
            )}
          </VStack>
        </Box>
      )}
    </Sidebar>
  );
};

export default Usuarios;
