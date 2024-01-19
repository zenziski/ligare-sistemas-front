import { AbsoluteCenter, Box, Divider, Flex, FormControl, FormLabel, Grid, Input, InputGroup, InputLeftElement, Tab, TabList, TabPanel, TabPanels, Table, TableContainer, Tabs, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react"
import Sidebar from "../../components/Sidebar"
import DrawerComponent from "../../components/Drawer"

import { useEffect, useState } from "react"
import { AddIcon, ArrowForwardIcon, DeleteIcon, EditIcon, SearchIcon } from "@chakra-ui/icons"

import MoneyInput from "../../components/MoneyInput"
import { Link } from "react-router-dom"
import Helpers from "../../utils/helper"

interface IObraTable {
    slug?: string;
    nomeObra: string;
    enderecoObra: string;
    formaContrato: string;
    parcelas: number;
    valorMensal: number;
}

interface IConfigTable {
    nome: string;
    dataCadastro: string;
}

const Obras = () => {

    const [inputValue, setInputValue] = useState('')
    const [searchTerm, setSearchTerm] = useState('');

    const obras: IObraTable[] = [
        {   
            slug: 'obra-1',
            nomeObra: 'Obra 1',
            enderecoObra: 'Endereço 1',
            formaContrato: 'Contrato',
            parcelas: 10,
            valorMensal: 10000.0,
        },
        {
            slug: 'obra-2',
            nomeObra: 'Obra 2',
            enderecoObra: 'Endereço 2',
            formaContrato: 'Contrato',
            parcelas: 9,
            valorMensal: 10210.0,
        },
        {
            slug: 'obra-3',
            nomeObra: 'Obra 3',
            enderecoObra: 'Endereço 3',
            formaContrato: 'Contrato',
            parcelas: 2,
            valorMensal: 2041.20,
        },
        {
            slug: 'obra-4',
            nomeObra: 'Obra 4',
            enderecoObra: 'Endereço 4',
            formaContrato: 'Contrato',
            parcelas: 5,
            valorMensal: 18549.02,
        },
        {
            slug: 'obra-5',
            nomeObra: 'Obra 5',
            enderecoObra: 'Endereço 5',
            formaContrato: 'Contrato',
            parcelas: 4,
            valorMensal: 12774.24,
        },
        {
            slug: 'obra-6',
            nomeObra: 'Obra 6',
            enderecoObra: 'Endereço 6',
            formaContrato: 'Contrato',
            parcelas: 12,
            valorMensal: 85839.24,
        }
    ]

    const configs = Array<IConfigTable>(10).fill(
        {
            nome: 'Item 1',
            dataCadastro: '10/10/2021'
        }
    )


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
                                        <FormControl gridColumn="span 2">
                                            <FormLabel>Endereço da Obra</FormLabel>
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
                                    <Input
                                        value={searchTerm}
                                        onChange={event => setSearchTerm(event.target.value)}
                                        type="text" placeholder="Pesquisar..."
                                    />
                                </InputGroup>
                            </Flex>
                            <TableContainer>
                                <Table variant={'striped'}>
                                    <Thead>
                                        <Tr>
                                            <Th>Nome da Obra</Th>
                                            <Th>Endereço da Obra</Th>
                                            <Th>Forma</Th>
                                            <Th>Parcelas</Th>
                                            <Th>Valor Mensal</Th>
                                            <Th>{' '}</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {obras.filter(obra => obra.nomeObra.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())).map((obra, index) => (
                                            <Tr key={index}>
                                                <Td>{obra.nomeObra}</Td>
                                                <Td>{obra.enderecoObra}</Td>
                                                <Td>{obra.formaContrato}</Td>
                                                <Td>{obra.parcelas}</Td>
                                                <Td>{Helpers.toBrazilianCurrency(obra.valorMensal)}</Td>
                                                <Td>
                                                    <Link to={`/obras/${obra.slug}`}>
                                                        <ArrowForwardIcon w="20px" h="20px" />
                                                    </Link>
                                                </Td>
                                            </Tr>
                                        ))}
                                        {obras.filter(obra => obra.nomeObra.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())).length === 0 &&
                                            <Text p={4} fontSize="18px">
                                                Nenhum resultado encontrado :(
                                            </Text>
                                        }
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
                                        {configs.map((config, index) => (
                                            <Tr key={index}>
                                                <Td>{config.nome}</Td>
                                                <Td>{config.dataCadastro}</Td>
                                                <Td>
                                                    <Flex direction="row" alignItems="center" justifyContent="center" gap={1}>
                                                        <DrawerComponent
                                                            buttonIcon={<EditIcon />}
                                                            buttonText="Editar"
                                                            headerText="Editar item"
                                                            buttonColorScheme="yellow"
                                                            size="md"
                                                        >
                                                            <Grid templateColumns="repeat(2, 1fr)" gap={6} fontFamily="Poppins-Regular">
                                                                <FormControl gridColumn="span 2">
                                                                    <FormLabel>Nome da categoria</FormLabel>
                                                                    <Input value={config.nome} placeholder="Digite..." />
                                                                </FormControl>
                                                            </Grid>
                                                        </DrawerComponent>
                                                        <DeleteIcon color="red" />
                                                    </Flex>
                                                </Td>
                                            </Tr>
                                        ))}
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