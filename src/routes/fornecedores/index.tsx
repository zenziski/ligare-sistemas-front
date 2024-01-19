import { Table, Thead, Tr, Th, Tbody, Td, Flex, TableContainer, Text, FormControl, FormLabel, Grid, Input } from "@chakra-ui/react";
import Sidebar from "../../components/Sidebar";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import DrawerComponent from "../../components/Drawer";

interface IFornecedorTable {
    nome: string;
    cpfCnpj: string;
    email: string;
    contato: string;
};

const Fornecedores = () => {

    const clientes = Array<IFornecedorTable>(10).fill({
        nome: 'Matheus Zenziski',
        cpfCnpj: '141.973.309-52',
        email: 'matheus.zenziski@gmail.com',
        contato: '(41) 9 9999-9999'
    })


    const GridForm = ({ cliente }: { cliente?: IFornecedorTable }) => {
        return (
            <Grid templateColumns="repeat(2, 1fr)" gap={6} fontFamily="Poppins-Regular">
                <FormControl gridColumn="span 2">
                    <FormLabel>Nome/Razão Social</FormLabel>
                    <Input value={cliente?.nome || ''} placeholder="Exemplo da Silva LTDA" />
                </FormControl>
                <FormControl gridColumn="span 2">
                    <FormLabel>Email</FormLabel>
                    <Input value={cliente?.email || ''} placeholder="exemplo@mail.com.br" />
                </FormControl>
                <FormControl>
                    <FormLabel>CPF/CNPJ</FormLabel>
                    <Input value={cliente?.cpfCnpj || ''} placeholder="99.999.999/9999-99" />
                </FormControl>
                <FormControl>
                    <FormLabel>Contato</FormLabel>
                    <Input value={cliente?.contato || ''} placeholder="(99) 9 9999-9999" />
                </FormControl>
            </Grid>
        )
    }

    return (
        <Sidebar>
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
                    >
                        <GridForm />
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
                            {clientes.map((fornecedor, index) => (
                                <Tr key={index}>
                                    <Td>{fornecedor.nome}</Td>
                                    <Td>{fornecedor.cpfCnpj}</Td>
                                    <Td>{fornecedor.email}</Td>
                                    <Td>{fornecedor.contato}</Td>
                                    <Td>
                                        <DrawerComponent
                                            buttonIcon={<EditIcon />}
                                            headerText="Editar fornecedor"
                                            buttonColorScheme="blue"
                                            size="md"
                                        >
                                            <GridForm cliente={fornecedor} />
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

export default Fornecedores;