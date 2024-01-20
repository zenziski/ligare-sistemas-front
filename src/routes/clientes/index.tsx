import { Table, Thead, Tr, Th, Tbody, Td, Flex, TableContainer, Text, FormControl, FormLabel, Grid, Input, useToast } from "@chakra-ui/react";
import Sidebar from "../../components/Sidebar";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import DrawerComponent from "../../components/Drawer";
import { IUserTable } from "../../stores/clientes/interface";
import { useEffect, useState } from "react";
import Helpers from "../../utils/helper";
import { createCustomer, getAll } from "../../stores/clientes/service";

const Clientes = () => {
    const toast = useToast()
    const [clienteState, setCliente] = useState<IUserTable>({
        _id: '',
        name: '',
        cpf: '',
        rg: '',
        email: '',
        birthDate: '',
        billingAdress: ''
    });
    const [clientes, setClientes] = useState<IUserTable[]>([]);
    const [loading, setLoading] = useState(false);


    const handleChange = (key: string, value: string) => {
        setCliente({ ...clienteState, [key]: value })
    }

    const handleCreateCustomer = async () => {
        setLoading(true);
        try {
            const response = await createCustomer(clienteState);
            setClientes([...clientes, response]);
            toast({
                title: "Cliente criado com sucesso!",
                status: "success",
                duration: 5000,
                isClosable: true,
            })
        } catch (error) {
            toast({
                title: "Erro ao criar cliente!",
                status: "error",
                duration: 5000,
                isClosable: true,
            })
        }
        setLoading(false);
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
        console.log(clienteState);
    }, [clienteState])

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
                            onAction={() => handleCreateCustomer()}
                            isLoading={loading}
                        >
                            <Grid templateColumns="repeat(2, 1fr)" gap={6} fontFamily="Poppins-Regular">
                                <FormControl gridColumn="span 2">
                                    <FormLabel>Nome completo</FormLabel>
                                    <Input value={clienteState?.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Exemplo da Silva" />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>CPF</FormLabel>
                                    <Input value={clienteState?.cpf} onChange={(e) => handleChange('cpf', e.target.value)} placeholder="999.999.999-99" />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>RG</FormLabel>
                                    <Input value={clienteState?.rg || ''} onChange={(e) => handleChange('rg', e.target.value)} placeholder="99.999.999-9" />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Email</FormLabel>
                                    <Input value={clienteState?.email || ''} onChange={(e) => handleChange('email', e.target.value)} placeholder="exemplo@mail.com" />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Data de nascimento</FormLabel>
                                    <Input value={clienteState?.birthDate || ''} onChange={(e) => handleChange('birthDate', e.target.value)} placeholder="01/01/2000" />
                                </FormControl>
                                <FormControl gridColumn="span 2">
                                    <FormLabel>Endereço de cobrança</FormLabel>
                                    <Input value={clienteState?.billingAdress || ''} onChange={(e) => handleChange('billingAdress', e.target.value)} placeholder="Rua do Exemplo, 123" />
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
                                {clientes.map((cliente, index) => (
                                    <Tr key={index}>
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
                                            >
                                                <Grid templateColumns="repeat(2, 1fr)" gap={6} fontFamily="Poppins-Regular">
                                                    <FormControl gridColumn="span 2">
                                                        <FormLabel>Nome completo</FormLabel>
                                                        <Input value={cliente?.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Exemplo da Silva" />
                                                    </FormControl>
                                                    <FormControl>
                                                        <FormLabel>CPF</FormLabel>
                                                        <Input value={cliente?.cpf} onChange={(e) => handleChange('cpf', e.target.value)} placeholder="999.999.999-99" />
                                                    </FormControl>
                                                    <FormControl>
                                                        <FormLabel>RG</FormLabel>
                                                        <Input value={cliente?.rg || ''} onChange={(e) => handleChange('rg', e.target.value)} placeholder="99.999.999-9" />
                                                    </FormControl>
                                                    <FormControl>
                                                        <FormLabel>Email</FormLabel>
                                                        <Input value={cliente?.email || ''} onChange={(e) => handleChange('email', e.target.value)} placeholder="exemplo@mail.com" />
                                                    </FormControl>
                                                    <FormControl>
                                                        <FormLabel>Data de nascimento</FormLabel>
                                                        <Input value={cliente?.birthDate || ''} onChange={(e) => handleChange('birthDate', e.target.value)} placeholder="01/01/2000" />
                                                    </FormControl>
                                                    <FormControl gridColumn="span 2">
                                                        <FormLabel>Endereço de cobrança</FormLabel>
                                                        <Input value={cliente?.billingAdress || ''} onChange={(e) => handleChange('billingAdress', e.target.value)} placeholder="Rua do Exemplo, 123" />
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