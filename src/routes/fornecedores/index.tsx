import { Table, Thead, Tr, Th, Tbody, Td, Flex, TableContainer, Text, FormControl, FormLabel, Grid, Input, useToast } from "@chakra-ui/react";
import Sidebar from "../../components/Sidebar";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import DrawerComponent from "../../components/Drawer";
import { useForm } from "react-hook-form";
import { IFornecedorTable, schema } from "../../stores/fornecedores/interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { createSupplier, getAll, updateSupplier } from "../../stores/fornecedores/service";

const Fornecedores = () => {

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
        reset
    } = useForm<IFornecedorTable>({
        resolver: zodResolver(schema),
    });
    const toast = useToast()
    const [fornecedores, setFornecedores] = useState<IFornecedorTable[]>([]);
    const [fornecedor, setFornecedor] = useState<IFornecedorTable>({} as IFornecedorTable);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);


    const handleCreateSupplier = async (data: IFornecedorTable) => {
        try {
            const response = await createSupplier(data);
            setFornecedores([...fornecedores, response]);
            toast({
                title: "Fornecedor criado com sucesso!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top-right"
            })
        } catch (error: any) {
            toast({
                title: (error?.response?.data?.message) || "Erro ao criar fornecedor!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-right"
            })
        }
    }

    const handleEditSupplier = async (data: IFornecedorTable) => {
        try {
            await updateSupplier(data);
            setRefresh(!refresh);
            toast({
                title: "Fornecedor editado com sucesso!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top-right"
            })
        } catch (error: any) {
            toast({
                title: (error?.response?.data?.message) || "Erro ao editar fornecedor!",
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
            setFornecedores(response);
            setLoading(false);
        }
        fetch();
    }, [refresh])

    useEffect(() => {
        setValue('name', fornecedor?.name || '');
        setValue('email', fornecedor?.email || '');
        setValue('cpfCnpj', fornecedor?.cpfCnpj || '');
        setValue('phone', fornecedor?.phone || '');
        setValue('_id', fornecedor?._id || '');
    }, [setValue, fornecedor]);

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
                            Fornecedores
                        </Text>
                        <DrawerComponent
                            buttonIcon={<AddIcon />}
                            buttonText="Adicionar"
                            headerText="Adicionar fornecedor"
                            buttonColorScheme="green"
                            size="md"
                            isButton
                            onAction={handleSubmit(handleCreateSupplier)}
                            onOpenHook={() => setFornecedor({} as IFornecedorTable)}
                            isLoading={isSubmitting}
                        >
                            <Grid templateColumns="repeat(2, 1fr)" gap={6} fontFamily="Poppins-Regular">
                                <FormControl gridColumn="span 2">
                                    <FormLabel>Nome/Razão Social</FormLabel>
                                    <Input {...register("name")} placeholder="Exemplo da Silva LTDA" />
                                    {errors.name && <Text color="red.500">{errors.name.message}</Text>}
                                </FormControl>
                                <FormControl gridColumn="span 2">
                                    <FormLabel>Email</FormLabel>
                                    <Input {...register("email")} placeholder="exemplo@mail.com.br" />
                                    {errors.email && <Text color="red.500">{errors.email.message}</Text>}
                                </FormControl>
                                <FormControl>
                                    <FormLabel>CPF/CNPJ</FormLabel>
                                    <Input {...register("cpfCnpj")} placeholder="99.999.999/9999-99" />
                                    {errors.cpfCnpj && <Text color="red.500">{errors.cpfCnpj.message}</Text>}
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Contato</FormLabel>
                                    <Input {...register("phone")} placeholder="(99) 9 9999-9999" />
                                    {errors.phone && <Text color="red.500">{errors.phone.message}</Text>}
                                </FormControl>
                            </Grid>
                        </DrawerComponent>
                    </Flex>
                    <TableContainer>
                        <Table variant="striped" >
                            <Thead>
                                <Tr>
                                    <Th>Nome/Razão Social</Th>
                                    <Th>CPF/CNPJ</Th>
                                    <Th>Email</Th>
                                    <Th>Contato</Th>
                                    <Th>{' '}</Th>
                                </Tr>
                            </Thead>

                            <Tbody>
                                {fornecedores.map((fornecedor, index) => (
                                    <Tr key={index}>
                                        <Td>{fornecedor.name}</Td>
                                        <Td>{fornecedor.cpfCnpj}</Td>
                                        <Td>{fornecedor.email}</Td>
                                        <Td>{fornecedor.phone}</Td>
                                        <Td>
                                            <DrawerComponent
                                                buttonIcon={<EditIcon />}
                                                headerText="Editar fornecedor"
                                                buttonColorScheme="blue"
                                                size="md"
                                                onAction={handleSubmit(handleEditSupplier)}
                                                onOpenHook={() => {setFornecedor(fornecedor); reset()}}
                                                isLoading={isSubmitting}
                                            >
                                                <Grid templateColumns="repeat(2, 1fr)" gap={6} fontFamily="Poppins-Regular">
                                                    <FormControl gridColumn="span 2">
                                                        <FormLabel>Nome/Razão Social</FormLabel>
                                                        <Input {...register("name")} placeholder="Exemplo da Silva LTDA" />
                                                        {errors.name && <Text color="red.500">{errors.name.message}</Text>}
                                                    </FormControl>
                                                    <FormControl gridColumn="span 2">
                                                        <FormLabel>Email</FormLabel>
                                                        <Input {...register("email")} placeholder="exemplo@mail.com.br" />
                                                        {errors.email && <Text color="red.500">{errors.email.message}</Text>}
                                                    </FormControl>
                                                    <FormControl>
                                                        <FormLabel>CPF/CNPJ</FormLabel>
                                                        <Input {...register("cpfCnpj")} placeholder="99.999.999/9999-99" />
                                                        {errors.cpfCnpj && <Text color="red.500">{errors.cpfCnpj.message}</Text>}
                                                    </FormControl>
                                                    <FormControl>
                                                        <FormLabel>Contato</FormLabel>
                                                        <Input {...register("phone")} placeholder="(99) 9 9999-9999" />
                                                        {errors.phone && <Text color="red.500">{errors.phone.message}</Text>}
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

export default Fornecedores;