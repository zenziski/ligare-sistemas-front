import { AddIcon, EditIcon, SearchIcon } from "@chakra-ui/icons"
import DrawerComponent from "../../components/Drawer"
import Sidebar from "../../components/Sidebar"
import { Flex, Text, Grid, FormControl, FormLabel, Input, Table, Thead, Tbody, Tr, Th, Td, TableContainer, InputGroup, InputLeftElement, Checkbox, Avatar, IconButton, Badge } from "@chakra-ui/react"
import PhoneInput from "../../components/PhoneInput"
import { useState } from "react"
import CpfInput from "../../components/CpfInput"

const Usuarios = () => {

    const [value, setValue] = useState<string>('')
    const [cpf, setCpf] = useState<string>('')

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
                    >
                        <Grid templateColumns="repeat(2, 1fr)" gap={6} fontFamily="Poppins-Regular">
                            <FormControl gridColumn="span 2">
                                <FormLabel>Nome completo</FormLabel>
                                <Input placeholder="Digite..." />
                            </FormControl>
                            <FormControl gridColumn={'span 2'}>
                                <FormLabel>Email</FormLabel>
                                <Input placeholder="Digite..." type="email" />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Telefone</FormLabel>
                                <PhoneInput
                                    value={value}
                                    setValue={setValue}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Data Nascimento</FormLabel>
                                <Input placeholder="Digite..." type="date" />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Data Admissão</FormLabel>
                                <Input placeholder="Digite..." type="date" />
                            </FormControl>
                            <FormControl>
                                <FormLabel>CPF</FormLabel>
                                <CpfInput
                                    value={cpf}
                                    setValue={setCpf}
                                />
                            </FormControl>
                            <FormControl gridColumn={'span 2'}>
                                <Checkbox>
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
                        <Input type="text" placeholder="Pesquisar..." />
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
                            <Tr>
                                <Td>
                                    <Avatar size="sm" name="Matheus Zenziski" src="https://avatars.githubusercontent.com/u/60078691?v=4" />
                                </Td>
                                <Td>
                                    <Text>Matheus Zenziski <Badge ml={1} mb={1} colorScheme="green">Admin</Badge></Text>
                                    <Text fontSize="sm" color="gray.500">matheus.zenziski@gmail.com</Text>
                                </Td>
                                <Td>(41) 99797-1794</Td>
                                <Td>17/01/2024</Td>
                                <Td>05/06/2001</Td>
                                <Td><IconButton aria-label="Editar"><EditIcon /></IconButton></Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </TableContainer>
            </Flex>
        </Sidebar>
    )
}

export default Usuarios