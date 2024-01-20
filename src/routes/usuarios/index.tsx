import { AddIcon, CloseIcon, EditIcon, SearchIcon } from "@chakra-ui/icons"
import DrawerComponent from "../../components/Drawer"
import Sidebar from "../../components/Sidebar"
import { Flex, Text, Grid, FormControl, FormLabel, Input, Table, Thead, Tbody, Tr, Th, Td, TableContainer, InputGroup, InputLeftElement, Checkbox, Avatar, IconButton, Badge, useToast, InputRightElement } from "@chakra-ui/react"
import PhoneInput from "../../components/PhoneInput"
import { useEffect, useState } from "react"
import { IUser, schema } from "../../stores/usuarios/interface"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { getAll, createUser, updateUser } from "../../stores/usuarios/service"
import moment from "moment"
import MaskedInput from "react-text-mask"

const Usuarios = () => {

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        reset
    } = useForm<IUser>({
        resolver: zodResolver(schema)
    })

    // const [value, setValue] = useState<string>('')
    const [users, setUsers] = useState<IUser[]>([])
    const [filteredUsers, setFilteredUsers] = useState<IUser[]>([])
    const [user, setUser] = useState<IUser>({} as IUser)
    const [filter, setFilter] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    const toast = useToast()

    const handleCreateUser = async (data: IUser) => {
        setLoading(true)
        try {
            const response = await createUser(data)
            setUsers([...users, response])
            setFilteredUsers([...users, response])
            toast({
                title: 'Usuário criado com sucesso',
                description: 'O usuário foi criado com sucesso',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top-right'
            })
            setUser({} as IUser)

        } catch (error: any) {
            toast({
                title: error?.response?.data?.message || 'Erro ao criar usuário',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-right'
            })
        } finally {
            setLoading(false)
            reset()
        }
    }

    const handleEditUser = async (data: IUser) => {
        setLoading(true)
        try {
            await updateUser(data)
            const users = await getAll()
            setUsers(users)
            setFilteredUsers(users)
            toast({
                title: 'Usuário editado com sucesso',
                description: 'O usuário foi editado com sucesso',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top-right'
            })
        } catch (error: any) {
            toast({
                title: error?.response?.data?.message || 'Erro ao editar usuário',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-right'
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (filter) {
            const filtered = users.filter(user => user.name.toLowerCase().includes(filter.toLowerCase()))
            setFilteredUsers(filtered)
        } else {
            setFilteredUsers(users)
        }
    }, [filter])

    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            try {
                const response = await getAll()
                setUsers(response)
                setFilteredUsers(response)
            } catch (error) {
                toast({
                    title: 'Erro ao buscar usuários',
                    description: 'Ocorreu um erro ao buscar os usuários, tente novamente mais tarde',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'top-right'
                })
            } finally {
                setLoading(false)
            }
        }
        fetch()
    }, [])

    useEffect(() => {
        setValue('name', user.name)
        setValue('email', user.email)
        setValue('phoneNumber', user.phoneNumber)
        setValue('birthDate', user.admissionDate && moment(user.birthDate).format("YYYY-MM-DD"))
        setValue('admissionDate', user.admissionDate && moment(user.admissionDate).format("YYYY-MM-DD"))
        setValue('roles', user.roles)
        setValue('password', user.password)
        setValue('confirmPassword', user.confirmPassword)
        setValue('_id', user._id)
    }, [user, setValue])

    return (
        <Sidebar>
            <Flex w="100%" h="100%" p={10} direction="column" fontFamily="Poppins-Regular">
                <Flex direction="row" mb="15px" justifyContent="space-between" >
                    <Text fontSize="4xl">
                        Usuários
                    </Text>
                    <DrawerComponent
                        buttonIcon={<AddIcon />}
                        buttonText="Adicionar"
                        headerText="Adicionar Usuario"
                        buttonColorScheme="green"
                        size="md"
                        isButton
                        onAction={() => {
                            handleSubmit(handleCreateUser)()
                            reset()
                        }}
                        onOpenHook={() => setUser({} as IUser)}
                        isLoading={isSubmitting}

                    >
                        <Grid templateColumns="repeat(2, 1fr)" gap={6} fontFamily="Poppins-Regular">
                            <FormControl gridColumn="span 2">
                                <FormLabel>Nome completo</FormLabel>
                                <Input placeholder="Nome" {...register("name")} />
                                {errors.name && <Text color="red.500" fontSize="sm">{errors.name.message}</Text>}
                            </FormControl>
                            <FormControl gridColumn={'span 2'}>
                                <FormLabel>Email</FormLabel>
                                <Input {...register("email")} placeholder="exemplo@mail.com.br" type="email" />
                                {errors.email && <Text color="red.500" fontSize="sm">{errors.email.message}</Text>}
                            </FormControl>
                            <FormControl gridColumn={"span 2"} >
                                <FormLabel>Senha</FormLabel>
                                <Input {...register("password")} type="password" />
                                {errors.password && <Text color="red.500" fontSize="sm">{errors.password.message}</Text>}
                            </FormControl>
                            <FormControl gridColumn={"span 2"} >
                                <FormLabel>Confirmar Senha</FormLabel>
                                <Input {...register("confirmPassword")} type="password" />
                                {errors.confirmPassword && <Text color="red.500" fontSize="sm">{errors.confirmPassword.message}</Text>}
                            </FormControl>
                            <FormControl>
                                <FormLabel>Telefone</FormLabel>
                                <Input {...register("phoneNumber")} placeholder="(99) 99999-9999" />
                                {/* <PhoneInput
                                    control={register("phoneNumber")}
                                    name="phoneNumber"
                                /> */}
                                {/* <MaskedInput
                                    mask={['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                    {...register("phoneNumber")}
                                    render={(ref: any, props: any) => (
                                        <Input ref={ref} {...props} />
                                    )}
                                    placeholder='(99) 99999-9999'
                                /> */}
                                {errors.phoneNumber && <Text color="red.500" fontSize="sm">{errors.phoneNumber.message}</Text>}
                            </FormControl>
                            <FormControl>
                                <FormLabel>Data Nascimento</FormLabel>
                                <Input type="date" {...register("birthDate")} />
                                {errors.birthDate && <Text color="red.500" fontSize="sm">{errors.birthDate.message}</Text>}
                            </FormControl>
                            <FormControl>
                                <FormLabel>Data Admissão</FormLabel>
                                <Input type="date" {...register("admissionDate")} />
                                {errors.admissionDate && <Text color="red.500" fontSize="sm">{errors.admissionDate.message}</Text>}
                            </FormControl>
                            <FormControl>
                                <FormLabel>Permissões</FormLabel>
                                <Checkbox
                                    {...register("roles.admin")}
                                >
                                    Administrador
                                </Checkbox>
                            </FormControl>
                        </Grid>
                    </DrawerComponent>
                </Flex>
                <Flex
                    w="100%"
                    h="50px"
                    borderRadius="md"
                    bg="white"
                    alignItems="center"
                    px={4}
                    mb={4}
                >
                    <InputGroup>
                        <InputLeftElement
                            pointerEvents="none"
                            children={<SearchIcon color="gray.300" />}
                        />
                        <Input value={filter} onChange={e => setFilter(e.target.value)} type="text" placeholder="Pesquisar..." />
                        <InputRightElement
                            children={filter !== '' && <IconButton aria-label="Pesquisar" onClick={() => setFilter('')} icon={<CloseIcon />} />}
                        />
                    </InputGroup>
                </Flex>
                <TableContainer>
                    <Table variant="striped" >
                        <Thead>
                            <Tr>
                                <Th></Th>
                                <Th>Nome</Th>
                                <Th>Telefone</Th>
                                <Th>Data Admissão</Th>
                                <Th>Data de nascimento</Th>
                                <Th>{' '}</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                filteredUsers.map((user, index) => (
                                    <Tr key={index}>
                                        <Td>
                                            <Avatar size="sm" name={user.name} src={user.name} />
                                        </Td>
                                        <Td>
                                            <Text>{user.name}{user?.roles?.admin && <Badge ml={1} mb={1} colorScheme="green">Admin</Badge>}</Text>
                                            <Text fontSize="sm" color="gray.500">{user.email}</Text>
                                        </Td>
                                        <Td>{user.phoneNumber}</Td>
                                        <Td>{user.admissionDate && moment(user.admissionDate).format('DD/MM/YYYY')}</Td>
                                        <Td>{user.birthDate && moment(user.birthDate).format('DD/MM/YYYY')}</Td>
                                        <Td>
                                            <DrawerComponent
                                                buttonIcon={<EditIcon />}
                                                buttonText="Editar"
                                                headerText="Editar Usuario"
                                                buttonColorScheme="blue"
                                                size="md"
                                                onOpenHook={() => {
                                                    setUser(user);
                                                }}
                                                onAction={handleSubmit(handleEditUser)}
                                                isLoading={isSubmitting}
                                            >
                                                <Grid templateColumns="repeat(2, 1fr)" gap={6} fontFamily="Poppins-Regular">
                                                    <FormControl gridColumn="span 2">
                                                        <FormLabel>Nome completo</FormLabel>
                                                        <Input placeholder="Nome" {...register("name")} />                                                        {errors.name && <Text color="red.500" fontSize="sm">{errors.name.message}</Text>}
                                                    </FormControl>
                                                    <FormControl gridColumn={'span 2'}>
                                                        <FormLabel>Email</FormLabel>
                                                        <Input {...register("email")} placeholder="exemplo@gmail.com" type="email" />
                                                        {errors.email && <Text color="red.500" fontSize="sm">{errors.email.message}</Text>}
                                                    </FormControl>
                                                    <FormControl>
                                                        <FormLabel>Telefone</FormLabel>
                                                        <Input {...register("phoneNumber")} placeholder="(99) 99999-9999" />
                                                        {/* <PhoneInput
                                                        control={register("phoneNumber")}
                                                        name="phoneNumber"
                                                    /> */}
                                                        {/* <MaskedInput
                                                        mask={['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                                        {...register("phoneNumber")}
                                                        render={(ref: any, props: any) => (
                                                            <Input ref={ref} {...props} />
                                                        )}
                                                        placeholder='(99) 99999-9999'
                                                    /> */}
                                                        {errors.phoneNumber && <Text color="red.500" fontSize="sm">{errors.phoneNumber.message}</Text>}
                                                    </FormControl>
                                                    <FormControl>
                                                        <FormLabel>Data Nascimento</FormLabel>
                                                        <Input type="date" {...register("birthDate")} />
                                                        {errors.birthDate && <Text color="red.500" fontSize="sm">{errors.birthDate.message}</Text>}
                                                    </FormControl>
                                                    <FormControl>
                                                        <FormLabel>Data Admissão</FormLabel>
                                                        <Input type="date" {...register("admissionDate")} />
                                                        {errors.admissionDate && <Text color="red.500" fontSize="sm">{errors.admissionDate.message}</Text>}
                                                    </FormControl>
                                                    <FormControl>
                                                        <FormLabel>Permissões</FormLabel>
                                                        <Checkbox
                                                            {...register("roles.admin")}
                                                        >
                                                            Administrador
                                                        </Checkbox>
                                                    </FormControl>
                                                </Grid>
                                            </DrawerComponent>
                                        </Td>
                                    </Tr>
                                ))
                            }
                        </Tbody>
                    </Table>
                </TableContainer>
            </Flex>
        </Sidebar >
    )
}

export default Usuarios