import { AbsoluteCenter, Box, Button, Divider, Flex, FormControl, FormLabel, Grid, Input, InputGroup, InputLeftElement, Tab, TabList, TabPanel, TabPanels, Table, TableContainer, Tabs, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react"
import Sidebar from "../../components/Sidebar"
import DrawerComponent from "../../components/Drawer"
import { AddIcon, DeleteIcon, EditIcon, SearchIcon } from "@chakra-ui/icons"
import { useState } from "react"
import MoneyInput from "../../components/MoneyInput"
import { Link } from "react-router-dom"

const Obras = () => {

    const [inputValue, setInputValue] = useState('')

    return (
        <Sidebar>
            <Flex w="100%" h="100%" p={10} direction="column" fontFamily="Poppins-Regular">
                <Tabs variant='enclosed'>
                    <TabList>
                        <Tab>Obras</Tab>
                        <Tab>Configurações</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Flex direction={'row'} mb={'15px'} justifyContent={'space-between'}>
                                <Text fontSize="4xl">
                                    Todas as obras
                                </Text>
                                <DrawerComponent
                                    buttonIcon={<AddIcon />}
                                    buttonText="Adicionar"
                                    headerText="Adicionar obra"
                                    buttonColorScheme="green"
                                    size="md"
                                    isButton
                                >
                                    <Grid templateColumns="repeat(2, 1fr)" gap={6} fontFamily="Poppins-Regular">
                                        <FormControl gridColumn="span 2">
                                            <FormLabel>Nome da Obra</FormLabel>
                                            <Input placeholder="Digite..." />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Endereço da Obra</FormLabel>
                                            <Input placeholder="Digite..." />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Endereço de Cobrança</FormLabel>
                                            <Input placeholder="Digite..." />
                                        </FormControl>
                                        <Box position='relative' gridColumn="span 2" >
                                            <Divider
                                                borderColor={'gray.500'}
                                            />
                                            <AbsoluteCenter bg='white' px='4'>
                                                Administração
                                            </AbsoluteCenter>
                                        </Box>
                                        <FormControl gridColumn="span 2">
                                            <FormLabel>Contrato</FormLabel>
                                            <InputGroup>
                                                <MoneyInput
                                                    value={inputValue}
                                                    setValue={setInputValue}
                                                />
                                            </InputGroup>
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Parcelas</FormLabel>
                                            <Input type="number" placeholder="Digite..." />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Valor Mensal</FormLabel>
                                            <Input placeholder="R$" readOnly={true} />
                                        </FormControl>
                                        <Box position='relative' gridColumn="span 2" >
                                            <Divider
                                                borderColor={'gray.500'}
                                            />
                                            <AbsoluteCenter bg='white' px='4'>
                                                Empreitada
                                            </AbsoluteCenter>
                                        </Box>
                                        <FormControl gridColumn="span 2">
                                            <FormLabel>Contrato</FormLabel>
                                            <MoneyInput
                                                value={inputValue}
                                                setValue={setInputValue}
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Parcelas</FormLabel>
                                            <Input type="number" placeholder="Digite..." />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Valor Mensal</FormLabel>
                                            <Input placeholder="R$" readOnly />
                                        </FormControl>
                                        <Divider gridColumn="span 2" borderColor={'gray.500'} />
                                        <FormControl>
                                            <FormLabel>Extras (mão de obra)</FormLabel>
                                            <Input type="number" placeholder="Digite..." />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Extra (adm)</FormLabel>
                                            <Input placeholder="Digite..." />
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
                                <Table variant={'striped'}>
                                    <Thead>
                                        <Tr>
                                            <Th>Nome da Obra</Th>
                                            <Th>Endereço da Obra</Th>
                                            <Th>Endereço de Cobrança</Th>
                                            <Th>Contrato - Administração</Th>
                                            <Th>Parcelas</Th>
                                            <Th>Valor Mensal</Th>
                                            <Th>{' '}</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        <Tr>
                                            <Td>Obra do Matheus</Td>
                                            <Td>Rua XXX</Td>
                                            <Td>Rua tal asdkjasd </Td>
                                            <Td> </Td>
                                            <Td> </Td>
                                            <Td> </Td>
                                            <Td>
                                                <Link
                                                    to={'/obra/1'}
                                                    style={{
                                                        textDecoration: 'none'
                                                    }}
                                                >
                                                    <Button>
                                                        Detalhes
                                                    </Button>
                                                </Link>

                                            </Td>
                                        </Tr>
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </TabPanel>
                        <TabPanel>
                            <Flex direction={'row'} mb={'15px'} justifyContent={'space-between'}>
                                <Text fontSize="4xl">
                                    Configurações gerais das obras
                                </Text>
                                <DrawerComponent
                                    buttonIcon={<AddIcon />}
                                    buttonText="Adicionar"
                                    headerText="Adicionar item"
                                    buttonColorScheme="green"
                                    size="md"
                                    isButton
                                >
                                    <Grid templateColumns="repeat(2, 1fr)" gap={6} fontFamily="Poppins-Regular">
                                        <FormControl gridColumn="span 2">
                                            <FormLabel>Nome da categoria</FormLabel>
                                            <Input placeholder="Digite..." />
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
                                <Table variant={'striped'} width="40%">
                                    <Thead>
                                        <Tr>
                                            <Th>Item</Th>
                                            <Th>Data de cadastro</Th>
                                            <Th>{' '}</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        <Tr>
                                            <Td>Item com um nome bem grande</Td>
                                            <Td>Data de cadastro</Td>
                                            <Td>
                                                <Flex gap={4}>
                                                    <EditIcon />
                                                    <DeleteIcon color="red" />
                                                </Flex>
                                            </Td>
                                        </Tr>
                                        <Tr>
                                            <Td>Item 2</Td>
                                            <Td>Data de cadastro</Td>
                                            <Td>
                                                <Flex gap={4}>
                                                    <EditIcon />
                                                    <DeleteIcon color="red" />
                                                </Flex>
                                            </Td>
                                        </Tr>
                                        <Tr>
                                            <Td>Item 3</Td>
                                            <Td>Data de cadastro</Td>
                                            <Td>
                                                <Flex gap={4}>
                                                    <EditIcon />
                                                    <DeleteIcon color="red" />
                                                </Flex>
                                            </Td>
                                        </Tr>
                                        <Tr>
                                            <Td>Item 12</Td>
                                            <Td>Data de cadastro</Td>
                                            <Td>
                                                <Flex gap={4}>
                                                    <EditIcon />
                                                    <DeleteIcon color="red" />
                                                </Flex>
                                            </Td>
                                        </Tr>
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </TabPanel>
                    </TabPanels>
                </Tabs>

            </Flex>
        </Sidebar>
    )
}

export default Obras