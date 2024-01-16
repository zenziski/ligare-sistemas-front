import { Table, Thead, Tr, Th, Tbody, Td, Flex, TableContainer, Text, FormControl, FormLabel, Grid, Input } from "@chakra-ui/react";
import Sidebar from "../../components/Sidebar";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import DrawerComponent from "../../components/Drawer";

const Clientes = () => {
    //TODO: TIPAR ESSA PORRA
    const EditButton = (props: any) => {
        return (
            <DrawerComponent
                buttonIcon={<EditIcon />}
                headerText="Editar cliente"
                buttonColorScheme="blue"
                size="md"
            >
                oi
            </DrawerComponent>
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
                        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                            <FormControl gridColumn="span 2">
                                <FormLabel>Nome completo</FormLabel>
                                <Input placeholder="Digite..." />
                            </FormControl>
                            <FormControl>
                                <FormLabel>CPF</FormLabel>
                                <Input placeholder="Digite..." />
                            </FormControl>
                            <FormControl>
                                <FormLabel>RG</FormLabel>
                                <Input placeholder="Digite..." />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Email</FormLabel>
                                <Input placeholder="Digite..." />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Data de nascimento</FormLabel>
                                <Input placeholder="Digite..." />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Endereço da Obra</FormLabel>
                                <Input placeholder="Digite..." />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Endereço de cobrança</FormLabel>
                                <Input placeholder="Digite..." />
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
                            <Tr>
                                <Td>Matheus</Td>
                                <Td>141.973.309-52</Td>
                                <Td>13.401.592-6</Td>
                                <Td>matheus.zenziski@gmail.com</Td>
                                <Td>05/06/2001</Td>
                                <Td><EditButton /></Td>
                            </Tr>
                            <Tr>
                                <Td>Matheus</Td>
                                <Td>141.973.309-52</Td>
                                <Td>13.401.592-6</Td>
                                <Td>matheus.zenziski@gmail.com</Td>
                                <Td>05/06/2001</Td>
                                <Td><EditButton /></Td>

                            </Tr>
                            <Tr>
                                <Td>Matheus</Td>
                                <Td>141.973.309-52</Td>
                                <Td>13.401.592-6</Td>
                                <Td>matheus.zenziski@gmail.com</Td>
                                <Td>05/06/2001</Td>
                                <Td><EditButton /></Td>

                            </Tr>
                            <Tr>
                                <Td>Matheus</Td>
                                <Td>141.973.309-52</Td>
                                <Td>13.401.592-6</Td>
                                <Td>matheus.zenziski@gmail.com</Td>
                                <Td>05/06/2001</Td>
                                <Td><EditButton /></Td>

                            </Tr>
                            <Tr>
                                <Td>Matheus</Td>
                                <Td>141.973.309-52</Td>
                                <Td>13.401.592-6</Td>
                                <Td>matheus.zenziski@gmail.com</Td>
                                <Td>05/06/2001</Td>
                                <Td><EditButton /></Td>

                            </Tr>
                            <Tr>
                                <Td>Matheus</Td>
                                <Td>141.973.309-52</Td>
                                <Td>13.401.592-6</Td>
                                <Td>matheus.zenziski@gmail.com</Td>
                                <Td>05/06/2001</Td>
                                <Td><EditButton /></Td>

                            </Tr>
                            <Tr>
                                <Td>Matheus</Td>
                                <Td>141.973.309-52</Td>
                                <Td>13.401.592-6</Td>
                                <Td>matheus.zenziski@gmail.com</Td>
                                <Td>05/06/2001</Td>
                                <Td><EditButton /></Td>

                            </Tr>
                        </Tbody>
                    </Table>
                </TableContainer>
            </Flex>
        </Sidebar>
    )
}

export default Clientes;