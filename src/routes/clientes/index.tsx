import { Table, Thead, Tr, Th, Tbody, Td, Flex, TableContainer, Text, FormControl, FormLabel, Grid, Input } from "@chakra-ui/react";
import Sidebar from "../../components/Sidebar";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import DrawerComponent from "../../components/Drawer";

interface IUserTable {
    nome: string;
    cpf: string;
    rg: string;
    email: string;
    dataNascimento: string;
    enderecoCobranca: string;
};

const Clientes = () => {

    const clientes = Array<IUserTable>(10).fill({
        nome: 'Matheus Zenziski',
        cpf: '141.973.309-52',
        rg: '13.401.592-6',
        email: 'matheus.zenziski@gmail.com',
        dataNascimento: '05/06/2001',
        enderecoCobranca: 'Rua das Flores, 123'
    })


    const GridForm = ({ cliente }: { cliente?: IUserTable }) => {
        return (
            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                <FormControl gridColumn="span 2">
                    <FormLabel>Nome completo</FormLabel>
                    <Input value={cliente?.nome || ''} placeholder="Digite..." />
                </FormControl>
                <FormControl>
                    <FormLabel>CPF</FormLabel>
                    <Input value={cliente?.cpf || ''} placeholder="Digite..." />
                </FormControl>
                <FormControl>
                    <FormLabel>RG</FormLabel>
                    <Input value={cliente?.rg || ''} placeholder="Digite..." />
                </FormControl>
                <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input value={cliente?.email || ''} placeholder="Digite..." />
                </FormControl>
                <FormControl>
                    <FormLabel>Data de nascimento</FormLabel>
                    <Input value={cliente?.dataNascimento || ''} placeholder="Digite..." />
                </FormControl>
                <FormControl>
                    <FormLabel>Endereço de cobrança</FormLabel>
                    <Input value={cliente?.enderecoCobranca || ''} placeholder="Digite..." />
                </FormControl>
            </Grid>
        )
    }

    return (
        <Sidebar>
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
                    >
                        <GridForm />
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
                                    <Td>{cliente.nome}</Td>
                                    <Td>{cliente.cpf}</Td>
                                    <Td>{cliente.rg}</Td>
                                    <Td>{cliente.email}</Td>
                                    <Td>{cliente.dataNascimento}</Td>
                                    <Td>
                                        <DrawerComponent
                                            buttonIcon={<EditIcon />}
                                            headerText="Editar cliente"
                                            buttonColorScheme="blue"
                                            size="md"
                                        >
                                            <GridForm cliente={cliente} />
                                        </DrawerComponent>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Flex>
        </Sidebar>
    )
}

export default Clientes;