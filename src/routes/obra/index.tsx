import Sidebar from "../../components/Sidebar"
import { Flex, Text, Table, Thead, Tbody, Tr, Th, Td, TableContainer, GridItem, Box, Select, FormControl, FormLabel, Input } from "@chakra-ui/react"
import { useParams } from "react-router-dom"
import Helpers from "../../utils/helper";
import Chart from "react-apexcharts";
import StatComponent from "../../components/Stats";
import { useEffect, useState } from "react";
import { getAllConstructionItems, getAllTipoLancamento, getOneConstruction, removeConstructionDiary } from "../../stores/obras/service";
import { ConstructionDiaryPaymentMethod, ConstructionDiaryStatus, IConstructionDiary, IObrasItem, IObrasTable, ITiposLancamento } from "../../stores/obras/interface";
import AddNewDiaryItem from "./fragments/AddNewDiaryItem";
import ConfigurarObra from "./fragments/configurarObra";
import EditDiaryItem from "./fragments/EditDiaryItem";
import { getAll } from "../../stores/fornecedores/service";
import { IFornecedorTable } from "../../stores/fornecedores/interface";
import Medicao from "./fragments/Medicao";
import ModalDelete from "../../components/ModalDelete";
import { DeleteIcon } from "@chakra-ui/icons";

const Obra = () => {

    const { id } = useParams<{ id: string }>()

    const [diarioItems, setDiarioItems] = useState<IConstructionDiary[]>([])
    const [data, setData] = useState<IObrasTable>({} as IObrasTable)
    const [filteredData, setFilteredData] = useState<IConstructionDiary[]>([])
    const [fornecedores, setFornecedores] = useState<IFornecedorTable[]>([]);
    const [constructionItems, setConstructionItems] = useState<IObrasItem[]>([]);
    const [entryType, setEntryType] = useState<ITiposLancamento[]>([]);
    const [costByType, setCostByType] = useState<any>({})
    const [costByItem, setCostByItem] = useState<any>({})
    const [totalCost, setTotalCost] = useState<number>(0)
    const [growthPercentage, setGrowthPercentage] = useState<any>({})
    const [loading, setLoading] = useState<boolean>(true)
    const [refresh, setRefresh] = useState<boolean>(false)
    const [filters, setFilters] = useState<any>({})
    const [sortConfig, setSortConfig] = useState<{ key?: keyof IConstructionDiary, direction?: 'ascending' | 'descending' }>({ key: "_id", direction: "ascending" });

    const onHeaderClick = (key: any) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    useEffect(() => {
        if (diarioItems) {
            let _filteredData = [...diarioItems];
            if (sortConfig && (sortConfig.key !== undefined && sortConfig.direction !== undefined)) {
                const getNestedPropertyValue = (obj: any, path: string) => {
                    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
                };
                _filteredData = _filteredData.sort((a: any, b: any) => {
                    if (getNestedPropertyValue(a, sortConfig.key as string) < getNestedPropertyValue(b, sortConfig.key as string)) {
                        return sortConfig.direction === 'ascending' ? -1 : 1;
                    }
                    if (getNestedPropertyValue(a, sortConfig.key as string) > getNestedPropertyValue(b, sortConfig.key as string)) {
                        return sortConfig.direction === 'ascending' ? 1 : -1;
                    }
                    return 0;
                });
            }
            if (filters.status) _filteredData = diarioItems.filter((item) => item.status === filters.status)
            if (filters.supplier) _filteredData = diarioItems.filter((item) => item.supplier._id === filters.supplier)
            if (filters.nf) _filteredData = diarioItems.filter((item) => item.nfNumber.includes(filters.nf))
            setFilteredData(_filteredData)
        }
    }, [diarioItems, filters, sortConfig])

    const handleFilterChange = (key: string, value: any) => {
        setFilters({
            ...filters,
            [key]: value
        })
    }

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

            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const sixtyDaysAgo = new Date();
            sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

            const last30Days = response.diary.filter((item: IConstructionDiary) => new Date(item.createdAt || "") >= thirtyDaysAgo);
            const previous30Days = response.diary.filter((item: IConstructionDiary) => new Date(item.createdAt || "") < thirtyDaysAgo && new Date(item.createdAt || "") >= sixtyDaysAgo);
            const costLast30Days = last30Days.reduce((acc, item) => {
                if (!acc[item.type]) {
                    acc[item.type] = 0;
                }
                acc[item.type] += item.value;
                return acc;
            }, {} as any);
            const costPrevious30Days = previous30Days.reduce((acc, item) => {
                if (!acc[item.type]) {
                    acc[item.type] = 0;
                }
                acc[item.type] += item.value;
                return acc;
            }, {} as any);

            const allKeys = Array.from(new Set([...Object.keys(costLast30Days), ...Object.keys(costPrevious30Days)]));

            const _growthPercentage: any = {};
            for (const item of allKeys) {
                const costNow = costLast30Days[item] || 0;
                const costBefore = costPrevious30Days[item] || 0;
                if (costBefore === 0 && costNow === 0) {
                    _growthPercentage[item] = { growth: 0, value: costNow };
                } else if (costBefore === 0) {
                    _growthPercentage[item] = { growth: 100, value: costNow };
                } else {
                    _growthPercentage[item] = { growth: ((costNow - costBefore) / costBefore) * 100, value: costNow };
                }
            }
            setGrowthPercentage(_growthPercentage);
            let _costByItem = response.diary.reduce((acc, item) => {
                if (!acc[item.item]) {
                    acc[item.item] = 0;
                }
                acc[item.item] += item.value;
                return acc;
            }, {} as any);

            let _costByType = response.diary.reduce((acc, item) => {
                if (!acc[item.type]) {
                    acc[item.type] = 0;
                }
                acc[item.type] += Number(item.value);
                return acc;
            }, {} as any);

            let _totalCost = response.diary.reduce((acc, item) => {
                if (item.value !== undefined) {
                    acc += Number(item.value);
                }
                return acc;
            }, 0);

            setTotalCost(_totalCost);

            let costArrayItem = Object.entries(_costByItem);
            let costArrayType = Object.entries(_costByType);
            costArrayType.sort((a: any, b: any) => b[1] - a[1]);
            costArrayItem.sort((a: any, b: any) => b[1] - a[1]);
            setCostByItem({ labels: costArrayItem.map((item: any) => item[0]), series: costArrayItem.map((item: any) => item[1]) });
            setCostByType({ labels: costArrayType.map((item: any) => item[0]), series: costArrayType.map((item: any) => item[1]) });
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
                    <Text p={2} color="gray">Dados dos últimos 30 dias</Text>
                    <Flex
                        justifyContent={["center", "center", "center", "center", "center", "space-between"]}
                        mb="15px"
                        flexWrap="wrap"
                        width={'100%'}
                    >
                        {growthPercentage && Object.entries(growthPercentage)
                            .sort((a: any, b: any) => a[0].localeCompare(b[0]))
                            .map((item: any, index: number) => (
                                <GridItem
                                    mb={2}
                                    mr={2}
                                    width={['100%', '100%', '100%', 'auto']}
                                    key={index}
                                >
                                    <StatComponent
                                        label={item[0]}
                                        value={Helpers.toBrazilianCurrency(item[1].value)}
                                        hasArrow
                                        arrowType={item[1].growth > 0 ? "increase" : "decrease"}
                                        helpText={`${item[1].growth.toFixed(2)}% nos últimos 30 dias`}
                                    />
                                </GridItem>
                            ))}

                        <GridItem
                            mb={2}
                            mr={2}
                            width={['100%', '100%', '100%', 'auto']}
                        >
                            <StatComponent
                                label="Total da Obra"
                                value={Helpers.toBrazilianCurrency(totalCost)}
                                helpText="Valor total da obra"
                            />
                        </GridItem>
                    </Flex>
                    <Flex
                        mb="15px"
                        flexWrap={['wrap', 'wrap', 'wrap', 'nowrap', 'nowrap', 'nowrap']}
                        width={'100%'}
                        gap="5%"
                    >
                        <Box width={"100%"} h="70vh" mb={8} >
                            <Chart
                                options={{
                                    states: {
                                        hover: {
                                            filter: {
                                                type: "none",
                                                value: 0,
                                            }
                                        },
                                    },
                                    colors: [
                                        "#ffcb1a",
                                    ],
                                    title: {
                                        text: 'Gastos por item (total)',
                                        align: 'center',
                                        style: {
                                            fontSize: '20px',
                                            fontWeight: 'bold',
                                            fontFamily: "Poppins-Regular",
                                            color: '#263238'
                                        },
                                    },
                                    chart: {
                                        id: "basic-bar"
                                    },
                                    xaxis: {
                                        categories: [...costByItem.labels],
                                    }
                                }}
                                series={[{
                                    name: "Gastos por item",
                                    data: [...costByItem.series]
                                }]}
                                type="bar"
                                width="100%"
                                height="100%"
                            />
                        </Box>
                        <Box width={"100%"} h="70vh" mb={8} >
                            <Chart
                                options={{
                                    states: {
                                        hover: {
                                            filter: {
                                                type: "none",
                                                value: 0,
                                            }
                                        },
                                    },
                                    colors: [
                                        "#ffcb1a",
                                    ],
                                    title: {
                                        text: 'Gastos por tipo (total)',
                                        align: 'center',
                                        style: {
                                            fontSize: '20px',
                                            fontWeight: 'bold',
                                            fontFamily: "Poppins-Regular",
                                            color: '#263238'
                                        },
                                    },
                                    chart: {
                                        id: "basic-bar"
                                    },
                                    xaxis: {
                                        categories: [...costByType.labels],
                                    }
                                }}
                                series={[{
                                    name: "Gastos por tipo",
                                    data: [...costByType.series]
                                }]}
                                type="bar"
                                width="100%"
                                height="100%"
                            />
                        </Box>
                    </Flex>
                    <Flex
                        justifyContent="space-between"
                        alignItems="center"
                        mb={4}
                        gap={4}
                    >
                        <Flex gap={2}>
                            <FormControl>
                                <FormLabel fontSize="14px">Status</FormLabel>
                                <Select placeholder="Status" size="sm" onChange={(e) => handleFilterChange('status', e.target.value)}>
                                    <option value="paid">Pago</option>
                                    <option value="toPay">À pagar</option>
                                    <option value="sended">Enviado</option>
                                </Select>
                            </FormControl>
                            <FormControl>
                                <FormLabel fontSize="14px">Fornecedor</FormLabel>
                                <Select placeholder="Fornecedor" size="sm" onChange={(e) => handleFilterChange('supplier', e.target.value)}>
                                    {fornecedores.map((item, index) => (
                                        <option key={index} value={item._id}>{item.name}</option>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl>
                                <FormLabel fontSize="14px">N° NF</FormLabel>
                                <Input type="text" placeholder="Número da NF" size="sm" onChange={(e) => handleFilterChange('nf', e.target.value)} />
                            </FormControl>
                        </Flex>
                        <Flex gap={4}>
                            <Medicao
                                data={data}
                            />
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
                    </Flex>
                    <TableContainer>
                        <Table
                            variant="striped"
                            fontSize={'sm'}
                            size={'sm'}
                        >
                            <Thead>
                                <Tr>
                                    <Th onClick={() => onHeaderClick('createdAt')}>Criado em</Th>
                                    <Th whiteSpace="normal" onClick={() => onHeaderClick('description')} >Descrição</Th>
                                    <Th onClick={() => onHeaderClick('supplier.name')}>Fornecedor</Th>
                                    <Th onClick={() => onHeaderClick('value')}>Valor</Th>
                                    <Th onClick={() => onHeaderClick('nfNumber')}>N° NF</Th>
                                    <Th onClick={() => onHeaderClick('status')}>Status</Th>
                                    <Th onClick={() => onHeaderClick('paymentDate')}>Data de pagamento</Th>
                                    <Th onClick={() => onHeaderClick('item')}>Item</Th>
                                    <Th onClick={() => onHeaderClick('sendDate')}>Data de envio</Th>
                                    <Th onClick={() => onHeaderClick('observation')}>Observação</Th>
                                    <Th>{' '}</Th>
                                    <Th>{' '}</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {filteredData.length ? (filteredData.map((item, index) => (
                                    <Tr key={index}>
                                        <Td>{Helpers.toViewDate(String(item.createdAt))}</Td>
                                        <Td maxW={'350px'} whiteSpace="normal">{item.description}</Td>
                                        <Td>{item.supplier.name}</Td>
                                        <Td>{Helpers.toBrazilianCurrency(item.value)}</Td>
                                        <Td>{item.nfNumber || "-"}</Td>
                                        <Td>
                                            <Text>
                                                {ConstructionDiaryStatus[item.status as keyof typeof ConstructionDiaryStatus]}
                                            </Text>
                                            <Text
                                                color={'gray'}
                                                fontSize={'sm'}
                                            >
                                                {ConstructionDiaryPaymentMethod[item.paymentMethod as keyof typeof ConstructionDiaryPaymentMethod]}
                                            </Text>
                                        </Td>
                                        <Td>{Helpers.toViewDate(String(item.paymentDate || "")?.split('T')[0])}</Td>
                                        <Td>
                                            {item.item}
                                            <Text
                                                color={'gray'}
                                                fontSize={'sm'}
                                            >
                                                {item.type}
                                            </Text>
                                        </Td>
                                        <Td>{Helpers.toViewDate(String(item.sendDate || "")?.split('T')[0])}</Td>
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
                                        <Td>
                                            <ModalDelete
                                                onDelete={async () => {
                                                    await removeConstructionDiary(id!, item._id || "")
                                                    setDiarioItems(diarioItems.filter((diary) => diary._id !== item._id))
                                                }}
                                                headerText={"Deletar item"}
                                                buttonColorScheme="red"
                                                buttonIcon={<DeleteIcon />}
                                            >
                                                <Text>Tem certeza que deseja deletar este item?</Text>
                                            </ModalDelete>
                                        </Td>
                                    </Tr>
                                ))) : (
                                    <Tr>
                                        <Td colSpan={12} textAlign="center">Nenhum resultado encontrado :(</Td>
                                    </Tr>
                                )
                                }
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Flex>
            )}

        </Sidebar>
    )
}

export default Obra