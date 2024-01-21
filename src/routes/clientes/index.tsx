import { Table, Thead, Tr, Th, Tbody, Td, Flex, TableContainer, Text, FormControl, FormLabel, Grid, Input, useToast } from "@chakra-ui/react";
import Sidebar from "../../components/Sidebar";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import DrawerComponent from "../../components/Drawer";
import { IUserTable, schema } from "../../stores/clientes/interface";
import { useEffect, useState } from "react";
import Helpers from "../../utils/helper";
import { createCustomer, getAll, updateCustomer } from "../../stores/clientes/service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CpfInput from "../../components/CpfInput";

const Clientes = () => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
        reset,
        control,
        watch
    } = useForm<IUserTable>({
        resolver: zodResolver(schema),
    });
    const toast = useToast()
    const [clientes, setClientes] = useState<IUserTable[]>([]);
    const [cliente, setCliente] = useState<IUserTable>({} as IUserTable);
    const [loading, setLoading] = useState(false);


    const handleCreateCustomer = async (data: IUserTable) => {
        try {
            const response = await createCustomer(data);
            setClientes([...clientes, response]);
            toast({
                title: "Cliente criado com sucesso!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top-right"
            })
        } catch (error: any) {
            toast({
                title: (error?.response?.data?.message) || "Erro ao criar cliente!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-right"
            })
        }
    }

    const handleEditCustomer = async (data: IUserTable) => {
        try {
            await updateCustomer(data);
            await getAll();
            toast({
                title: "Cliente editado com sucesso!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top-right"
            })
        } catch (error: any) {
            toast({
                title: (error?.response?.data?.message) || "Erro ao editar cliente!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-right"
            })
        }
    }

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            const response = await getAll();
            setClientes(response);
            setLoading(false);
        }
        fetch();
    }, [])

    useEffect(() => {
        setValue("name", cliente.name);
        setValue("cpf", cliente.cpf);
        setValue("rg", cliente.rg);
        setValue("email", cliente.email);
        setValue("birthDate", Helpers.toViewDate(cliente.birthDate));
        setValue("billingAdress", cliente.billingAdress);
        setValue("_id", cliente._id)
    }, [setValue, cliente]);

    const cpfValue = watch('cpf');
    return (
        <Sidebar>
            {loading ? (
                <Flex justifyContent="center" alignItems="center" height="100vh">
                    <Text fontSize="2xl">Carregando...</Text>
                </Flex>
            ) : (
                <Flex w="100%" h="100%" p={10} direction="column" fontFamily="Poppins-Regular">
                    <Flex direction="row" mb="15px" justifyContent="space-between">
                        <Text fontSize="4xl">
                            Clientes
                        </Text>
                        <DrawerComponent
                            buttonIcon={<AddIcon />}
                            buttonText="Adicionar"
                            headerText="Adicionar cliente"
                            buttonColorScheme="green"
                            size="md"
                            isButton
                            onAction={() => handleSubmit(handleCreateCustomer)()}
                            onOpenHook={() => setCliente({} as IUserTable)}
                            isLoading={isSubmitting}
                        >
                            <Grid templateColumns="repeat(2, 1fr)" gap={6} fontFamily="Poppins-Regular">
                                <FormControl gridColumn="span 2">
                                    <FormLabel>Nome completo</FormLabel>
                                    <Input {...register("name")} placeholder="Exemplo da Silva" />
                                    {errors.name && <Text color="red.500" fontSize="sm">{errors.name.message}</Text>}
                                </FormControl>
                                <FormControl>
                                    <FormLabel>CPF</FormLabel>
                                    <Input {...register("cpf")} placeholder="999.999.999-99" />
                                    {errors.cpf && <Text color="red.500" fontSize="sm">{errors.cpf.message}</Text>}
                                </FormControl>
                                <FormControl>
                                    <FormLabel>RG</FormLabel>
                                    <Input {...register("rg")} placeholder="99.999.999-9" />
                                    {errors.rg && <Text color="red.500" fontSize="sm">{errors.rg.message}</Text>}
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Email</FormLabel>
                                    <Input {...register("email")} placeholder="exemplo@mail.com" />
                                    {errors.email && <Text color="red.500" fontSize="sm">{errors.email.message}</Text>}
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Data de nascimento</FormLabel>
                                    <Input {...register("birthDate")} type="date" placeholder="01/01/2000" />
                                    {errors.birthDate && <Text color="red.500" fontSize="sm">{errors.birthDate.message}</Text>}
                                </FormControl>
                                <FormControl gridColumn="span 2">
                                    <FormLabel>Endereço de cobrança</FormLabel>
                                    <Input {...register("billingAdress")} placeholder="Rua do Exemplo, 123" />
                                    {errors.billingAdress && <Text color="red.500" fontSize="sm">{errors.billingAdress.message}</Text>}
                                </FormControl>
                            </Grid>
                        </DrawerComponent>
                    </Flex>
                    <TableContainer>
                        <Table variant="striped" >
                            <Thead>
                                <Tr>
                                    <Th>Nome</Th>
                                    <Th>CPF</Th>
                                    <Th>RG</Th>
                                    <Th>Email</Th>
                                    <Th>Data de nascimento</Th>
                                    <Th>{' '}</Th>
                                </Tr>
                            </Thead>

                            <Tbody>
                                {clientes.map((cliente) => (
                                    <Tr key={cliente._id}>
                                        <Td>{cliente.name}</Td>
                                        <Td>{cliente.cpf}</Td>
                                        <Td>{cliente.rg}</Td>
                                        <Td>{cliente.email}</Td>
                                        <Td>{Helpers.toViewDate(cliente.birthDate)}</Td>
                                        <Td>
                                            <DrawerComponent
                                                buttonIcon={<EditIcon />}
                                                headerText="Editar cliente"
                                                buttonColorScheme="blue"
                                                size="md"
                                                onOpenHook={() => { setCliente(cliente); reset() }}
                                                onAction={() => handleSubmit(handleEditCustomer)()}
                                                isLoading={isSubmitting}
                                                isDisabled={!!errors.name || !!errors.cpf || !!errors.rg || !!errors.email || !!errors.birthDate || !!errors.billingAdress}
                                            >
                                                <Grid templateColumns="repeat(2, 1fr)" gap={6} fontFamily="Poppins-Regular">
                                                    <FormControl gridColumn="span 2">
                                                        <FormLabel>Nome completo</FormLabel>
                                                        <Input {...register("name")} placeholder="Exemplo da Silva" />
                                                        {errors.name && <Text color="red.500" fontSize="sm">{errors.name.message}</Text>}
                                                    </FormControl>
                                                    <FormControl>
                                                        <FormLabel>CPF</FormLabel>
                                                        <CpfInput control={control} defaultValue={cpfValue} />
                                                        {errors.cpf && <Text color="red.500" fontSize="sm">{errors.cpf.message}</Text>}
                                                    </FormControl>
                                                    <FormControl>
                                                        <FormLabel>RG</FormLabel>
                                                        <Input {...register("rg")} placeholder="99.999.999-9" />
                                                        {errors.rg && <Text color="red.500" fontSize="sm">{errors.rg.message}</Text>}
                                                    </FormControl>
                                                    <FormControl>
                                                        <FormLabel>Email</FormLabel>
                                                        <Input {...register("email")} placeholder="exemplo@mail.com" />
                                                        {errors.email && <Text color="red.500" fontSize="sm">{errors.email.message}</Text>}
                                                    </FormControl>
                                                    <FormControl>
                                                        <FormLabel>Data de nascimento</FormLabel>
                                                        <Input {...register("birthDate")} placeholder="01/01/2000" />
                                                        {errors.birthDate && <Text color="red.500" fontSize="sm">{errors.birthDate.message}</Text>}
                                                    </FormControl>
                                                    <FormControl gridColumn="span 2">
                                                        <FormLabel>Endereço de cobrança</FormLabel>
                                                        <Input {...register("billingAdress")} placeholder="Rua do Exemplo, 123" />
                                                        {errors.billingAdress && <Text color="red.500" fontSize="sm">{errors.billingAdress.message}</Text>}
                                                    </FormControl>
                                                </Grid>
                                            </DrawerComponent>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Flex>
            )}
        </Sidebar>
    )
}

export default Clientes;