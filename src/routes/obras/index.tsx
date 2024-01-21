import { AbsoluteCenter, Box, Divider, Flex, FormControl, FormLabel, Grid, IconButton, Input, InputGroup, InputLeftElement, Select, Tab, TabList, TabPanel, TabPanels, Table, TableContainer, Tabs, Tbody, Td, Text, Th, Thead, Tr, useToast } from "@chakra-ui/react"
import Sidebar from "../../components/Sidebar"
import DrawerComponent from "../../components/Drawer"

import { useEffect, useState } from "react"
import { AddIcon, ArrowForwardIcon, DeleteIcon, EditIcon, SearchIcon } from "@chakra-ui/icons"

import MoneyInput from "../../components/MoneyInput"
import { Link } from "react-router-dom"
import Helpers from "../../utils/helper"
import { IObrasTable, IObrasItem, obraSchema, obraItemSchema } from "../../stores/obras/interface"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { createConstruction, createConstructionItem, getAllConstruction, getAllConstructionItems, removeConstructionItem, updateConstructionItem } from "../../stores/obras/service"
import { IUserTable } from "../../stores/clientes/interface"
import { getAll } from "../../stores/clientes/service"


const Obras = () => {
    const toast = useToast()
    const [inputValue, setInputValue] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [obras, setObras] = useState<IObrasTable[]>([]);
    const [configs, setConfigs] = useState<IObrasItem[]>([]);
    const [config, setConfig] = useState<IObrasItem>({} as IObrasItem);
    const [clientes, setClientes] = useState<IUserTable[]>([]);

    const {
        register: registerObras,
        handleSubmit: handleSubmitObras,
        formState: { errors: errorsObras, isSubmitting: isSubmittingObras },
        reset: resetObras,
        control: controlObras,
        watch: watchObras,
    } = useForm<IObrasTable>({
        resolver: zodResolver(obraSchema),
        shouldFocusError: false
    });

    const {
        register: registerObrasItem,
        handleSubmit: handleSubmitObrasItem,
        formState: { errors: errorsObrasItem, isSubmitting: isSubmittingObrasItem },
        reset: resetObrasItem,
        control: controlObrasItem,
        watch: watchObrasItem,
        setValue: setValueObrasItem
    } = useForm<IObrasItem>({
        resolver: zodResolver(obraItemSchema),
        shouldFocusError: false
    });

    const handleCreateConstruction = async (data: IObrasTable) => {
        try {
            const construction = await createConstruction(data);
            const newObras = [...obras, construction];
            setObras(newObras);
            toast({
                title: "Obra criada com sucesso!",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top-right"
            })
        } catch (error) {
            toast({
                title: "Erro ao criar obra!",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top-right"
            })
        }
    }

    const handleCreateConstructionItem = async (data: IObrasItem) => {
        try {
            const construction = await createConstructionItem(data);
            const newConfigs = [...configs, construction];
            setConfigs(newConfigs);
            toast({
                title: "Item criado com sucesso!",
                status: "success",
                duration: 3000,
                position: "top-right",
                isClosable: true,
            })
        } catch (error: any) {
            toast({
                title: error?.response?.data?.message || "Erro ao criar item",
                status: "error",
                duration: 3000,
                position: "top-right",
                isClosable: true,
            })
        }
    }

    const handleEditConstructionItem = async (data: IObrasItem) => {
        try {
            await updateConstructionItem(data);
            const newConfig = await getAllConstructionItems();
            setConfigs(newConfig);
            toast({
                title: "Item editado com sucesso!",
                status: "success",
                duration: 3000,
                position: "top-right",
                isClosable: true,
            })
        } catch (error: any) {
            toast({
                title: error?.response?.data?.message || "Erro ao editar item",
                status: "error",
                duration: 3000,
                position: "top-right",
                isClosable: true,
            })
        }
    }

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            const obras = await getAllConstruction();
            const obrasItem = await getAllConstructionItems();
            const response = await getAll();
            setClientes(response);
            setObras(obras);
            setConfigs(obrasItem);
            setLoading(false);
        }
        fetch();
    }, [])

    const getContractType = (obra: IObrasTable) => {
        if (obra.contract && obra.administration) {
            return 'Administração/Empreitada'
        } else if (obra.contract) {
            return 'Administração'
        } else {
            return 'Empreitada'
        }
    }

    useEffect(() => {
        console.log(errorsObras);
    }, [errorsObras])

    useEffect(() => {
        setValueObrasItem('name', config.name);
        setValueObrasItem('_id', config._id);
    }, [config, setValueObrasItem])

    const contractValue = parseFloat(watchObras('contract.value')?.toString()?.replace("R$ ", "")?.replace(/\./g, "")?.replace(",", ".") || "0");
    const contractInstallments = parseFloat(watchObras('contract.installments')?.toString()?.replace("R$ ", "").replace(/\./g, "")?.replace(",", ".") || "0");

    const administrationValue = parseFloat(watchObras('administration.value')?.toString()?.replace("R$ ", "")?.replace(/\./g, "")?.replace(",", ".") || "0");
    const administrationInstallments = parseFloat(watchObras('administration.installments')?.toString()?.replace("R$ ", "")?.replace(/\./g, "")?.replace(",", ".") || "0");

    const contractMonthlyValue = contractValue && contractInstallments ? (contractValue / contractInstallments).toFixed(2) : '0';
    const administrationMonthlyValue = administrationValue && administrationInstallments ? (administrationValue / administrationInstallments).toFixed(2) : '0';

    return (
        <Sidebar>
            {loading ? (
                <Flex justifyContent="center" alignItems="center" height="100vh">
                    <Text fontSize="2xl">Carregando...</Text>
                </Flex>
            ) : (
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
                                        onOpenHook={() => resetObras()}
                                        onAction={() => handleSubmitObras(handleCreateConstruction)()}
                                        isLoading={isSubmittingObras}
                                    >
                                        <Grid templateColumns="repeat(2, 1fr)" gap={6} fontFamily="Poppins-Regular">
                                            <FormControl gridColumn="span 2">
                                                <FormLabel>Nome da Obra</FormLabel>
                                                <Input {...registerObras("name")} placeholder="Digite..." />
                                                {errorsObras.name && <Text color="red">{errorsObras.name.message}</Text>}
                                            </FormControl>
                                            <FormControl gridColumn="span 2">
                                                <FormLabel>Endereço da Obra</FormLabel>
                                                <Input {...registerObras("constructionAddress")} placeholder="Digite..." />
                                                {errorsObras.constructionAddress && <Text color="red">{errorsObras.constructionAddress.message}</Text>}
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>Cliente</FormLabel>
                                                <Controller
                                                    name="customerId"
                                                    control={controlObras}
                                                    defaultValue=""
                                                    render={({ field }) => (
                                                        <Select {...field}>
                                                            {clientes.map((cliente, index) => (
                                                                <option key={index} value={cliente._id}>{cliente.name}</option>
                                                            ))}
                                                        </Select>
                                                    )}
                                                />
                                                {errorsObras.customerId && <Text color="red">{errorsObras.customerId.message}</Text>}
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
                                                        control={controlObras}
                                                        name="administration.value"
                                                        defaultValue={null}
                                                    />
                                                </InputGroup>
                                                {errorsObras.administration?.value && <Text color="red">{errorsObras.administration?.value.message}</Text>}
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>Parcelas</FormLabel>
                                                <Input {...registerObras("administration.installments")} type="number" placeholder="Digite..." />
                                                {errorsObras.administration?.installments && <Text color="red">{errorsObras.administration?.installments.message}</Text>}
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>Valor Mensal</FormLabel>
                                                <Input value={`R$ ${administrationMonthlyValue}`} placeholder="R$" readOnly={true} />
                                                {errorsObras.administration?.installments && <Text color="red">{errorsObras.administration?.installments.message}</Text>}
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
                                                    control={controlObras}
                                                    name="contract.value"
                                                    defaultValue={null}
                                                />
                                                {errorsObras.contract?.value && <Text color="red">{errorsObras.contract?.value.message}</Text>}
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>Parcelas</FormLabel>
                                                <Input {...registerObras("contract.installments")} type="number" placeholder="Digite..." />
                                                {errorsObras.contract?.installments && <Text color="red">{errorsObras.contract?.installments.message}</Text>}
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>Valor Mensal</FormLabel>
                                                <Input value={`R$ ${contractMonthlyValue}`} placeholder="R$" readOnly />
                                                {errorsObras.contract?.installments && <Text color="red">{errorsObras.contract?.installments.message}</Text>}
                                            </FormControl>
                                            <Divider gridColumn="span 2" borderColor={'gray.500'} />
                                            <FormControl>
                                                <FormLabel>Extras (mão de obra)</FormLabel>
                                                <Input {...registerObras("extraLabor")} type="number" placeholder="Digite..." />
                                                {errorsObras.extraLabor && <Text color="red">{errorsObras.extraLabor.message}</Text>}
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>Extra (adm)</FormLabel>
                                                <Input {...registerObras("extraAdm")} placeholder="Digite..." />
                                                {errorsObras.extraAdm && <Text color="red">{errorsObras.extraAdm.message}</Text>}
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
                                                <Th>{' '}</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {obras.filter(obra => obra.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())).map((obra, index) => (
                                                <Tr key={index}>
                                                    <Td>{obra.name}</Td>
                                                    <Td>{obra.constructionAddress}</Td>
                                                    <Td>{getContractType(obra)}</Td>
                                                    <Td>
                                                        <Link to={`/obras/${obra._id}`}>
                                                            <ArrowForwardIcon w="20px" h="20px" />
                                                        </Link>
                                                    </Td>
                                                </Tr>
                                            ))}
                                            {obras.filter(obra => obra.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())).length === 0 &&
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
                                        onOpenHook={() => resetObrasItem()}
                                        onAction={() => handleSubmitObrasItem(handleCreateConstructionItem)()}
                                        isLoading={isSubmittingObrasItem}
                                    >
                                        <Grid templateColumns="repeat(2, 1fr)" gap={6} fontFamily="Poppins-Regular">
                                            <FormControl gridColumn="span 2">
                                                <FormLabel>Nome da categoria</FormLabel>
                                                <Input
                                                    placeholder="Digite..."
                                                    {...registerObrasItem("name")}
                                                />
                                                {errorsObrasItem.name && <Text color="red">{errorsObrasItem.name.message}</Text>}
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
                                                    <Td>{config.name}</Td>
                                                    <Td>
                                                        <Flex direction="row" alignItems="center" justifyContent="center" gap={1}>
                                                            <DrawerComponent
                                                                buttonIcon={<EditIcon />}
                                                                buttonText="Editar"
                                                                headerText="Editar item"
                                                                buttonColorScheme="yellow"
                                                                size="md"
                                                                onOpenHook={() => setConfig(config)}
                                                                onAction={() => handleSubmitObrasItem(handleEditConstructionItem)()}
                                                                isLoading={isSubmittingObrasItem}
                                                            >
                                                                <Grid templateColumns="repeat(2, 1fr)" gap={6} fontFamily="Poppins-Regular">
                                                                    <FormControl gridColumn="span 2">
                                                                        <FormLabel>Nome da categoria</FormLabel>
                                                                        <Input {...registerObrasItem("name")} placeholder="Digite..." />
                                                                    </FormControl>
                                                                </Grid>
                                                            </DrawerComponent>
                                                            <IconButton
                                                                aria-label="Delete"
                                                                icon={<DeleteIcon />}
                                                                colorScheme="red"
                                                                onClick={async () => {
                                                                    try {
                                                                        await removeConstructionItem(config._id ?? '');
                                                                        const newConfigs = await getAllConstructionItems();
                                                                        setConfigs(newConfigs);
                                                                        toast({
                                                                            title: "Item deletado com sucesso!",
                                                                            status: "success",
                                                                            duration: 3000,
                                                                            isClosable: true,
                                                                        })
                                                                    } catch (error: any) {
                                                                        toast({
                                                                            title: error?.response?.data?.message || "Erro ao deletar item",
                                                                            status: "error",
                                                                            duration: 3000,
                                                                            isClosable: true,
                                                                        })
                                                                    }
                                                                }}
                                                            >
                                                                <DeleteIcon color="red" />
                                                            </IconButton>
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
            )}

        </Sidebar>
    )
}

export default Obras