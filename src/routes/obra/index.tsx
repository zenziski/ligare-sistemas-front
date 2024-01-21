import Sidebar from "../../components/Sidebar"
import { Flex, Text, Grid, Table, Thead, Tbody, Tr, Th, Td, TableContainer, GridItem, Box, Button } from "@chakra-ui/react"
import { useParams } from "react-router-dom"
import Helpers from "../../utils/helper";
import Chart from "react-apexcharts";
import StatComponent from "../../components/Stats";
import DrawerComponent from "../../components/Drawer";
import { AddIcon, EditIcon, SettingsIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { getAllConstructionItems, getAllTipoLancamento, getOneConstruction } from "../../stores/obras/service";
import { IConstructionDiary, IObrasItem, IObrasTable, ITiposLancamento } from "../../stores/obras/interface";
import AddNewDiaryItem from "./fragments/AddNewDiaryItem";
import ConfigurarObra from "./fragments/configurarObra";
import EditDiaryItem from "./fragments/EditDiaryItem";
import { getAll } from "../../stores/fornecedores/service";
import { IFornecedorTable } from "../../stores/fornecedores/interface";


const Obra = () => {

    const { id } = useParams<{ id: string }>()

    const [diarioItems, setDiarioItems] = useState<IConstructionDiary[]>([])
    const [data, setData] = useState<IObrasTable>({} as IObrasTable)
    const [fornecedores, setFornecedores] = useState<IFornecedorTable[]>([]);
    const [constructionItems, setConstructionItems] = useState<IObrasItem[]>([]);
    const [entryType, setEntryType] = useState<ITiposLancamento[]>([]);
    const [loading, setLoading] = useState<boolean>(true)
    const [refresh, setRefresh] = useState<boolean>(false)

    useEffect(() => {
        const fetch = async (idConstruction: string) => {
            setLoading(true)
            const response = await getOneConstruction(idConstruction)
            const items = await getAllConstructionItems();
            const fornecedor = await getAll();
            const types = await getAllTipoLancamento();
            setEntryType(types);
            setFornecedores(fornecedor);
            setConstructionItems(items);
            setDiarioItems(response.diary)
            setData(response)
            setLoading(false)
        }
        if (id) fetch(id)
    }, [id, refresh])

    return (
        <Sidebar>
            {loading ? (
                <Flex justifyContent="center" alignItems="center" height="100vh">
                    <Text fontSize="2xl">Carregando...</Text>
                </Flex>
            ) : (
                <Flex w="100%" h="100%" p={10} direction="column" fontFamily="Poppins-Regular">
                    <Flex direction="row" mb="15px" justifyContent="space-between" >
                        <Text fontSize="4xl">
                            {data.name}
                        </Text>
                    </Flex>
                    <Flex
                        justifyContent={["center", "center", "center", "center", "center", "space-between"]}
                        mb="15px"
                        flexWrap="wrap"
                        width={'100%'}
                    >
                        <GridItem
                            mb={2}
                            mr={2}
                            width={['100%', '100%', '100%', 'auto']}
                        >
                            <StatComponent
                                label="Material"
                                value={Helpers.toBrazilianCurrency(1000.25)}
                                hasArrow
                                arrowType="increase"
                                helpText="10,5% nos últimos 30 dias"
                            />
                        </GridItem>
                        <GridItem
                            mb={2}
                            mr={2}
                            width={['100%', '100%', '100%', 'auto']}
                        >
                            <StatComponent
                                label="Mão de obra"
                                value={Helpers.toBrazilianCurrency(1000.25)}
                                hasArrow
                                arrowType="decrease"
                                helpText="5,4% nos últimos 30 dias"
                            />
                        </GridItem>
                        <GridItem
                            mb={2}
                            mr={2}
                            width={['100%', '100%', '100%', 'auto']}
                        >
                            <StatComponent
                                label="Mat/Mo Terceiros"
                                value={Helpers.toBrazilianCurrency(1000.25)}
                                hasArrow
                                arrowType="increase"
                                helpText="92% nos últimos 30 dias"
                            />
                        </GridItem>
                        <GridItem
                            mb={2}
                            mr={2}
                            width={['100%', '100%', '100%', 'auto']}
                        >
                            <StatComponent
                                label="Administração"
                                value={Helpers.toBrazilianCurrency(1000.25)}
                                helpText="Valor total da obra"
                            />
                        </GridItem>
                        <GridItem
                            mb={2}
                            mr={2}
                            width={['100%', '100%', '100%', 'auto']}
                        >
                            <StatComponent
                                label="Total da Obra"
                                value={Helpers.toBrazilianCurrency(1000.25)}
                                helpText="Valor total da obra"
                            />
                        </GridItem>
                    </Flex>
                    <Flex
                        mb="15px"
                        flexWrap={['wrap', 'wrap', 'wrap', 'nowrap', 'nowrap', 'nowrap']}
                        width={'100%'}
                    >
                        <Box width={"100%"} h="70vh" mb={8} >
                            <Chart
                                options={{
                                    chart: {
                                        id: "basic-bar"
                                    },
                                    xaxis: {
                                        categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set'],
                                    }
                                }}
                                series={[{
                                    name: "series-1",
                                    data: [30, 40, 45, 50, 49, 60, 70, 91, 125]
                                },
                                {
                                    name: "series-2",
                                    data: [30, 40, 45, 50, 49, 60, 70, 91, 125]
                                }]}
                                type="bar"
                                width="100%"
                                height="100%"
                            />
                        </Box>
                        <Box width={"100%"} h="70vh" mb={8} >
                            <Chart
                                options={{
                                    chart: {
                                        id: "basic-bar"
                                    },
                                    xaxis: {
                                        categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set'],
                                    }
                                }}
                                series={[{
                                    name: "series-1",
                                    data: [30, 40, 45, 50, 49, 60, 70, 91, 125]
                                },
                                {
                                    name: "series-2",
                                    data: [30, 40, 45, 50, 49, 60, 70, 91, 125]
                                }]}
                                type="bar"
                                width="100%"
                                height="100%"
                            />
                        </Box>
                        <Box width={"100%"} h="70vh" mb={8} >
                            <Chart
                                options={{
                                    chart: {
                                        id: "basic-bar"
                                    },
                                    xaxis: {
                                        categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set'],
                                    }
                                }}
                                series={[{
                                    name: "series-1",
                                    data: [30, 40, 45, 50, 49, 60, 70, 91, 125]
                                },
                                {
                                    name: "series-2",
                                    data: [30, 40, 45, 50, 49, 60, 70, 91, 125]
                                }]}
                                type="bar"
                                width="100%"
                                height="100%"
                            />
                        </Box>
                    </Flex>
                    <Flex
                        justifyContent="flex-end"
                        alignItems="center"
                        mb={4}
                        gap={4}
                    >
                        <ConfigurarObra
                            data={data}
                            refresh={refresh}
                            setRefresh={setRefresh}
                        />
                        <AddNewDiaryItem
                            id={id!}
                            flushHook={setRefresh}
                            refresh={refresh}
                            fornecedores={fornecedores}
                            constructionItems={constructionItems}
                            entryType={entryType}
                        />
                    </Flex>
                    <TableContainer>
                        <Table
                            variant="striped"
                            fontSize={'sm'}
                            size={'sm'}
                        >
                            <Thead>
                                <Tr>
                                    <Th>Criado em</Th>
                                    <Th whiteSpace="normal" >Descrição</Th>
                                    <Th>Fornecedor</Th>
                                    <Th>Valor</Th>
                                    <Th>N° NF</Th>
                                    <Th>Status</Th>
                                    <Th>Data de pagamento</Th>
                                    <Th>Item</Th>
                                    <Th>Data de envio</Th>
                                    <Th>Observação</Th>
                                    <Th>{' '}</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {diarioItems.map((item, index) => (
                                    <Tr key={index}>
                                        <Td>{Helpers.toViewDate(String(item.createdAt))}</Td>
                                        <Td maxW={'350px'} whiteSpace="normal">{item.description}</Td>
                                        <Td>{item.supplier.name}</Td>
                                        <Td>{Helpers.toBrazilianCurrency(item.value)}</Td>
                                        <Td>{item.nfNumber}</Td>
                                        <Td>
                                            <Text>
                                                {item.status}
                                            </Text>
                                            <Text
                                                color={'gray'}
                                                fontSize={'sm'}
                                            >
                                                {item.paymentMethod}
                                            </Text>
                                        </Td>
                                        <Td>{Helpers.toViewDate(item.paymentDate ? String(item.paymentDate) : '') || '-'}</Td>
                                        <Td>
                                            {item.item}
                                            <Text
                                                color={'gray'}
                                                fontSize={'sm'}
                                            >
                                                {item.type}
                                            </Text>
                                        </Td>
                                        <Td>{Helpers.toViewDate(String(item.sendDate))}</Td>
                                        <Td>
                                            {item.observation}
                                        </Td>
                                        <Td>
                                            <EditDiaryItem
                                                entryType={entryType}
                                                fornecedores={fornecedores}
                                                constructionItems={constructionItems}
                                                id={id!}
                                                item={item}
                                                flushHook={setRefresh}
                                                refresh={refresh}
                                            />
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

export default Obra