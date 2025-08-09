import Sidebar from "../../components/Sidebar"
import { 
    Flex, 
    Text, 
    Table, 
    Thead, 
    Tbody, 
    Tr, 
    Th, 
    Td, 
    TableContainer, 
    GridItem, 
    Box, 
    Select, 
    FormControl, 
    FormLabel, 
    Input, 
    IconButton,
    Grid,
    Card,
    CardBody,
    CardHeader,
    VStack,
    HStack,
    Badge,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    Divider,
    Button,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    InputGroup,
    InputLeftElement,
    useToast
} from "@chakra-ui/react"
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
import { ArrowDownIcon, ArrowUpIcon, DeleteIcon, SearchIcon, ChevronLeftIcon, SettingsIcon, AddIcon, CalendarIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";

const Obra = () => {
    const { id } = useParams<{ id: string }>()
    const toast = useToast()

    const [diarioItems, setDiarioItems] = useState<IConstructionDiary[]>([])
    const [data, setData] = useState<IObrasTable | null>(null)
    const [filteredData, setFilteredData] = useState<IConstructionDiary[]>([])
    const [fornecedores, setFornecedores] = useState<IFornecedorTable[]>([]);
    const [constructionItems, setConstructionItems] = useState<IObrasItem[]>([]);
    const [entryType, setEntryType] = useState<ITiposLancamento[]>([]);
    const [costByType, setCostByType] = useState<any>({})
    const [costByItem, setCostByItem] = useState<any>({})
    const [growthPercentage, setGrowthPercentage] = useState<any>({})
    const [totalCost, setTotalCost] = useState<number>(0)
    const [refresh, setRefresh] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [filters, setFilters] = useState({
        supplier: '',
        status: '',
        type: '',
        item: '',
        nf: ''
    })

    // Sort functionality
    const [sortConfig, setSortConfig] = useState<{
        key: string | null;
        direction: 'ascending' | 'descending';
    }>({ key: null, direction: 'ascending' });

    const onHeaderClick = (key: string) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleFilterChange = (filterType: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }))
    }

    const getContractType = (obra: IObrasTable) => {
        if (obra?.contract?.value && obra?.administration?.value) {
            return 'Administração + Empreitada'
        } else if (obra?.contract?.value) {
            return 'Empreitada'
        } else if (obra?.administration?.value) {
            return 'Administração'
        }
        return 'Não definido'
    }

    const getContractTypeColor = (obra: IObrasTable) => {
        if (obra?.contract?.value && obra?.administration?.value) {
            return 'purple'
        } else if (obra?.contract?.value) {
            return 'blue'
        } else if (obra?.administration?.value) {
            return 'green'
        }
        return 'gray'
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'green'
            case 'toPay': return 'yellow'
            case 'sended': return 'blue'
            default: return 'gray'
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'paid': return 'Pago'
            case 'toPay': return 'À Pagar'
            case 'sended': return 'Enviado'
            default: return status
        }
    }

    const getPaymentMethodLabel = (method: string) => {
        switch (method) {
            case 'pix': return 'PIX'
            case 'boleto': return 'Boleto'
            case 'cartao': return 'Cartão'
            case 'transferencia': return 'Transferência'
            default: return method
        }
    }

    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            try {
                const obra = await getOneConstruction(id!)
                const obrasItem = await getAllConstructionItems()
                const entryTypes = await getAllTipoLancamento()
                const fornecedoresData = await getAll()

                setData(obra)
                setDiarioItems(obra.diary || [])
                setConstructionItems(obrasItem)
                setEntryType(entryTypes)
                setFornecedores(fornecedoresData)

                // Calculate costs and statistics
                const diary = obra.diary || []
                const total = diary.reduce((acc, item) => acc + (item.value || 0), 0)
                setTotalCost(total)

                // Group by type
                const byType = diary.reduce((acc, item) => {
                    const type = item.type || 'Outros'
                    acc[type] = (acc[type] || 0) + (item.value || 0)
                    return acc
                }, {} as any)
                setCostByType(byType)

                // Group by item
                const byItem = diary.reduce((acc, item) => {
                    const itemName = item.item || 'Outros'
                    acc[itemName] = (acc[itemName] || 0) + (item.value || 0)
                    return acc
                }, {} as any)
                setCostByItem(byItem)

                // Calculate real growth based on date periods
                const now = new Date();
                const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
                const sixtyDaysAgo = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000));

                const currentPeriodEntries = diary.filter(item => 
                    new Date(item.createdAt || '') >= thirtyDaysAgo
                );
                const previousPeriodEntries = diary.filter(item => {
                    const itemDate = new Date(item.createdAt || '');
                    return itemDate >= sixtyDaysAgo && itemDate < thirtyDaysAgo;
                });

                const currentPeriodByType = currentPeriodEntries.reduce((acc, item) => {
                    const type = item.type || 'Outros';
                    acc[type] = (acc[type] || 0) + (item.value || 0);
                    return acc;
                }, {} as any);

                const previousPeriodByType = previousPeriodEntries.reduce((acc, item) => {
                    const type = item.type || 'Outros';
                    acc[type] = (acc[type] || 0) + (item.value || 0);
                    return acc;
                }, {} as any);

                const growth = Object.keys(byType).reduce((acc, key) => {
                    const current = currentPeriodByType[key] || 0;
                    const previous = previousPeriodByType[key] || 0;
                    const growthPercentage = previous === 0 ? 
                        (current > 0 ? 100 : 0) : 
                        ((current - previous) / previous) * 100;
                    
                    acc[key] = {
                        value: byType[key],
                        growth: Math.round(growthPercentage * 100) / 100,
                        currentPeriod: current,
                        previousPeriod: previous
                    };
                    return acc;
                }, {} as any);
                setGrowthPercentage(growth)

            } catch (error) {
                console.error('Error fetching obra data:', error)
                toast({
                    title: "Erro ao carregar dados da obra",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                })
            } finally {
                setLoading(false)
            }
        }
        if (id) fetch()
    }, [id, refresh, toast])

    // Filter and sort data
    useEffect(() => {
        let filtered = diarioItems.filter(item => {
            const matchesSearch = !searchTerm || 
                item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.item?.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesSupplier = !filters.supplier || item.supplier?._id === filters.supplier
            const matchesStatus = !filters.status || item.status === filters.status
            const matchesType = !filters.type || item.type === filters.type
            const matchesItem = !filters.item || item.item === filters.item
            const matchesNF = !filters.nf || item.nfNumber?.includes(filters.nf)

            return matchesSearch && matchesSupplier && matchesStatus && matchesType && matchesItem && matchesNF
        })

        if (sortConfig.key) {
            filtered.sort((a, b) => {
                let aValue = a[sortConfig.key as keyof IConstructionDiary]
                let bValue = b[sortConfig.key as keyof IConstructionDiary]

                if (sortConfig.key === 'supplier.name') {
                    aValue = a.supplier?.name || ''
                    bValue = b.supplier?.name || ''
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1
                }
                return 0
            })
        }

        setFilteredData(filtered)
    }, [diarioItems, searchTerm, filters, sortConfig])

    if (loading) {
        return (
            <Sidebar>
                <Flex justifyContent="center" alignItems="center" height="100vh">
                    <Text fontSize="2xl">Carregando...</Text>
                </Flex>
            </Sidebar>
        )
    }

    return (
        <Sidebar>
            {!data ? (
                <Flex justifyContent="center" alignItems="center" height="100vh">
                    <Text fontSize="2xl">Carregando dados da obra...</Text>
                </Flex>
            ) : (
                <Box w="100%" h="100%" p={6} fontFamily="Poppins-Regular">
                <VStack spacing={6} align="stretch">
                    {/* Header */}
                    <Card>
                        <CardBody>
                            <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                                <HStack spacing={4}>
                                    <Button
                                        as={Link}
                                        to="/obras"
                                        leftIcon={<ChevronLeftIcon />}
                                        variant="ghost"
                                        size="sm"
                                    >
                                        Voltar
                                    </Button>
                                    <Divider orientation="vertical" h="6" />
                                    <VStack align="start" spacing={1}>
                                        <HStack spacing={3}>
                                            <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                                                {data?.name || 'Carregando...'}
                                            </Text>
                                            {data && (
                                                <Badge 
                                                    colorScheme={getContractTypeColor(data)} 
                                                    variant="subtle"
                                                    fontSize="sm"
                                                    px={3}
                                                    py={1}
                                                >
                                                    {getContractType(data)}
                                                </Badge>
                                            )}
                                        </HStack>
                                        <Text color="gray.600" fontSize="md">
                                            📍 {data?.constructionAddress || 'Endereço não informado'}
                                        </Text>
                                        <Text color="gray.500" fontSize="sm">
                                            Cliente: {data?.customerId?.name || 'Não informado'}
                                        </Text>
                                    </VStack>
                                </HStack>

                                <HStack spacing={3}>
                                    {data && (
                                        <>
                                            <ConfigurarObra
                                                data={data}
                                                refresh={refresh}
                                                setRefresh={setRefresh}
                                            />
                                            <Medicao data={data} />
                                        </>
                                    )}
                                </HStack>
                            </Flex>
                        </CardBody>
                    </Card>

                    {/* Financial Overview */}
                    <Card>
                        <CardHeader>
                            <Text fontSize="lg" fontWeight="semibold">
                                📊 Visão Geral Financeira
                            </Text>
                        </CardHeader>
                        <CardBody pt={0}>
                            <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={4}>
                                {/* Contract Values */}
                                {data?.contract?.value && (
                                    <Stat p={4} bg="blue.50" borderRadius="md" borderLeft="4px" borderLeftColor="blue.400">
                                        <StatLabel color="blue.600">Valor Empreitada</StatLabel>
                                        <StatNumber color="blue.800">
                                            {Helpers.toBrazilianCurrency(data.contract.value)}
                                        </StatNumber>
                                        <StatHelpText>
                                            {data.contract.installments} parcelas de{' '}
                                            {Helpers.toBrazilianCurrency(data.contract.monthlyValue || 0)}
                                        </StatHelpText>
                                    </Stat>
                                )}

                                {data?.administration?.value && (
                                    <Stat p={4} bg="green.50" borderRadius="md" borderLeft="4px" borderLeftColor="green.400">
                                        <StatLabel color="green.600">Valor Administração</StatLabel>
                                        <StatNumber color="green.800">
                                            {Helpers.toBrazilianCurrency(data.administration.value)}
                                        </StatNumber>
                                        <StatHelpText>
                                            {data.administration.installments} parcelas de{' '}
                                            {Helpers.toBrazilianCurrency(data.administration.monthlyValue || 0)}
                                        </StatHelpText>
                                    </Stat>
                                )}

                                <Stat p={4} bg="orange.50" borderRadius="md" borderLeft="4px" borderLeftColor="orange.400">
                                    <StatLabel color="orange.600">Total Gastos</StatLabel>
                                    <StatNumber color="orange.800">
                                        {Helpers.toBrazilianCurrency(totalCost)}
                                    </StatNumber>
                                    <StatHelpText>
                                        {diarioItems.length} lançamentos
                                    </StatHelpText>
                                </Stat>

                                {/* Growth Stats */}
                                {Object.entries(growthPercentage).slice(0, 2).map(([key, value]: [string, any]) => (
                                    <Stat key={key} p={4} bg="gray.50" borderRadius="md">
                                        <StatLabel>{key}</StatLabel>
                                        <StatNumber>{Helpers.toBrazilianCurrency(value.value)}</StatNumber>
                                        <StatHelpText>
                                            <StatArrow type={value.growth > 0 ? "increase" : "decrease"} />
                                            {Math.abs(value.growth).toFixed(1)}% últimos 30 dias
                                        </StatHelpText>
                                    </Stat>
                                ))}
                            </Grid>
                        </CardBody>
                    </Card>

                    {/* Charts Row */}
                    <Grid templateColumns="repeat(auto-fit, minmax(400px, 1fr))" gap={6}>
                        {/* Cost by Type Chart */}
                        <Card>
                            <CardHeader>
                                <Text fontSize="lg" fontWeight="semibold">
                                    💰 Gastos por Tipo
                                </Text>
                            </CardHeader>
                            <CardBody>
                                {Object.keys(costByType).length > 0 ? (
                                    <Chart
                                        options={{
                                            chart: { type: 'donut' },
                                            labels: Object.keys(costByType),
                                            colors: ['#4299E1', '#48BB78', '#ED8936', '#9F7AEA', '#F56565'],
                                            legend: { position: 'bottom' },
                                            plotOptions: {
                                                pie: {
                                                    donut: {
                                                        size: '60%'
                                                    }
                                                }
                                            },
                                            dataLabels: {
                                                enabled: true,
                                                formatter: function(val: number) {
                                                    return val.toFixed(1) + "%"
                                                }
                                            }
                                        }}
                                        series={Object.values(costByType)}
                                        type="donut"
                                        height={300}
                                    />
                                ) : (
                                    <Flex justify="center" align="center" h="300px">
                                        <Text color="gray.500">Nenhum dado disponível</Text>
                                    </Flex>
                                )}
                            </CardBody>
                        </Card>

                        {/* Cost by Item Chart */}
                        <Card>
                            <CardHeader>
                                <Text fontSize="lg" fontWeight="semibold">
                                    🔨 Gastos por Item
                                </Text>
                            </CardHeader>
                            <CardBody>
                                {Object.keys(costByItem).length > 0 ? (
                                    <Chart
                                        options={{
                                            chart: { type: 'bar' },
                                            xaxis: {
                                                categories: Object.keys(costByItem).slice(0, 8),
                                                labels: {
                                                    rotate: -45,
                                                    style: {
                                                        fontSize: '12px'
                                                    }
                                                }
                                            },
                                            yaxis: {
                                                labels: {
                                                    formatter: (val: number) => Helpers.toBrazilianCurrency(val)
                                                }
                                            },
                                            colors: ['#4299E1'],
                                            plotOptions: {
                                                bar: {
                                                    borderRadius: 4
                                                }
                                            },
                                            dataLabels: { enabled: false }
                                        }}
                                        series={[{
                                            name: 'Valor',
                                            data: Object.values(costByItem).slice(0, 8)
                                        }]}
                                        type="bar"
                                        height={300}
                                    />
                                ) : (
                                    <Flex justify="center" align="center" h="300px">
                                        <Text color="gray.500">Nenhum dado disponível</Text>
                                    </Flex>
                                )}
                            </CardBody>
                        </Card>
                    </Grid>

                    {/* Diary Items */}
                    <Card>
                        <CardHeader>
                            <Flex justify="space-between" align="center">
                                <Text fontSize="lg" fontWeight="semibold">
                                    📋 Diário da Obra
                                </Text>
                                <AddNewDiaryItem
                                    id={id!}
                                    flushHook={setRefresh}
                                    refresh={refresh}
                                    fornecedores={fornecedores}
                                    constructionItems={constructionItems}
                                    entryType={entryType}
                                />
                            </Flex>
                        </CardHeader>

                        <CardBody>
                            <VStack spacing={6} align="stretch">
                                {/* Search and Filters */}
                                <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4}>
                                    <InputGroup>
                                        <InputLeftElement pointerEvents="none">
                                            <SearchIcon color="gray.400" />
                                        </InputLeftElement>
                                        <Input
                                            placeholder="Buscar itens..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            bg="white"
                                            border="1px"
                                            borderColor="gray.200"
                                        />
                                    </InputGroup>

                                    <Select
                                        placeholder="Fornecedor"
                                        value={filters.supplier}
                                        onChange={(e) => handleFilterChange('supplier', e.target.value)}
                                        size="md"
                                    >
                                        {fornecedores.map((fornecedor) => (
                                            <option key={fornecedor._id} value={fornecedor._id}>
                                                {fornecedor.name}
                                            </option>
                                        ))}
                                    </Select>

                                    <Select
                                        placeholder="Status"
                                        value={filters.status}
                                        onChange={(e) => handleFilterChange('status', e.target.value)}
                                        size="md"
                                    >
                                        <option value="toPay">À Pagar</option>
                                        <option value="paid">Pago</option>
                                        <option value="sended">Enviado</option>
                                    </Select>

                                    <Select
                                        placeholder="Tipo"
                                        value={filters.type}
                                        onChange={(e) => handleFilterChange('type', e.target.value)}
                                        size="md"
                                    >
                                        {entryType.map((type) => (
                                            <option key={type._id} value={type.name}>
                                                {type.name}
                                            </option>
                                        ))}
                                    </Select>

                                    <Select
                                        placeholder="Item"
                                        value={filters.item}
                                        onChange={(e) => handleFilterChange('item', e.target.value)}
                                        size="md"
                                    >
                                        {constructionItems.map((item) => (
                                            <option key={item._id} value={item.name}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </Select>

                                    <Input
                                        placeholder="Número da NF"
                                        value={filters.nf}
                                        onChange={(e) => handleFilterChange('nf', e.target.value)}
                                        size="md"
                                    />
                                </Grid>

                                {/* Results Summary */}
                                <Flex justify="space-between" align="center" py={2}>
                                    <Text color="gray.600" fontSize="sm">
                                        {filteredData.length} de {diarioItems.length} itens
                                    </Text>
                                    <Text color="gray.600" fontSize="sm" fontWeight="medium">
                                        Total: {Helpers.toBrazilianCurrency(
                                            filteredData.reduce((acc, item) => acc + (item.value || 0), 0)
                                        )}
                                    </Text>
                                </Flex>

                                {/* Table */}
                                <TableContainer>
                                    <Table variant="simple" size="sm">
                                        <Thead bg="gray.50">
                                            <Tr>
                                                <Th 
                                                    onClick={() => onHeaderClick('createdAt')}
                                                    cursor="pointer"
                                                    _hover={{ bg: 'gray.100' }}
                                                >
                                                    <HStack spacing={1}>
                                                        <CalendarIcon boxSize={3} />
                                                        <Text>Data</Text>
                                                        <IconButton
                                                            aria-label="Sort"
                                                            icon={sortConfig.key === 'createdAt' && sortConfig.direction === 'ascending' ? <ArrowUpIcon /> : <ArrowDownIcon />}
                                                            variant="ghost"
                                                            size="xs"
                                                        />
                                                    </HStack>
                                                </Th>
                                                <Th 
                                                    onClick={() => onHeaderClick('description')}
                                                    cursor="pointer"
                                                    _hover={{ bg: 'gray.100' }}
                                                >
                                                    <HStack spacing={1}>
                                                        <Text>Descrição</Text>
                                                        <IconButton
                                                            aria-label="Sort"
                                                            icon={sortConfig.key === 'description' && sortConfig.direction === 'ascending' ? <ArrowUpIcon /> : <ArrowDownIcon />}
                                                            variant="ghost"
                                                            size="xs"
                                                        />
                                                    </HStack>
                                                </Th>
                                                <Th>Fornecedor</Th>
                                                <Th>
                                                    <HStack spacing={1}>
                                                        <Text>Valor</Text>
                                                    </HStack>
                                                </Th>
                                                <Th>NF</Th>
                                                <Th>Status</Th>
                                                <Th>Pagamento</Th>
                                                <Th>Item</Th>
                                                <Th>Tipo</Th>
                                                <Th width="100px">Ações</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {filteredData.map((item, index) => (
                                                <Tr key={index} _hover={{ bg: 'gray.50' }}>
                                                    <Td>
                                                        <Text fontSize="sm" fontWeight="medium">
                                                            {Helpers.toViewDate(item.createdAt || '')}
                                                        </Text>
                                                    </Td>
                                                    <Td>
                                                        <Text fontSize="sm" fontWeight="medium" noOfLines={2}>
                                                            {item.description}
                                                        </Text>
                                                    </Td>
                                                    <Td>
                                                        <Text fontSize="sm" color="gray.600">
                                                            {item.supplier?.name || 'N/A'}
                                                        </Text>
                                                    </Td>
                                                    <Td>
                                                        <Text fontSize="sm" fontWeight="bold" color="green.600">
                                                            {Helpers.toBrazilianCurrency(item.value || 0)}
                                                        </Text>
                                                    </Td>
                                                    <Td>
                                                        <Text fontSize="sm" color="gray.600">
                                                            {item.nfNumber || 'N/A'}
                                                        </Text>
                                                    </Td>
                                                    <Td>
                                                        <Badge 
                                                            colorScheme={getStatusColor(item.status || '')}
                                                            size="sm"
                                                        >
                                                            {getStatusLabel(item.status || '')}
                                                        </Badge>
                                                    </Td>
                                                    <Td>
                                                        <Text fontSize="sm" color="gray.600">
                                                            {getPaymentMethodLabel(item.paymentMethod || '')}
                                                        </Text>
                                                    </Td>
                                                    <Td>
                                                        <Text fontSize="sm" color="gray.600">
                                                            {item.item || 'N/A'}
                                                        </Text>
                                                    </Td>
                                                    <Td>
                                                        <Text fontSize="sm" color="gray.600">
                                                            {item.type || 'N/A'}
                                                        </Text>
                                                    </Td>
                                                    <Td>
                                                        <HStack spacing={1}>
                                                            <EditDiaryItem
                                                                entryType={entryType}
                                                                fornecedores={fornecedores}
                                                                constructionItems={constructionItems}
                                                                id={id!}
                                                                item={item}
                                                                flushHook={setRefresh}
                                                                refresh={refresh}
                                                            />
                                                            <ModalDelete
                                                                onDelete={async () => {
                                                                    try {
                                                                        await removeConstructionDiary(id!, item._id || "")
                                                                        setDiarioItems(diarioItems.filter((diary) => diary._id !== item._id))
                                                                        toast({
                                                                            title: "Item excluído com sucesso!",
                                                                            status: "success",
                                                                            duration: 3000,
                                                                            isClosable: true,
                                                                        })
                                                                    } catch (error) {
                                                                        toast({
                                                                            title: "Erro ao excluir item",
                                                                            status: "error",
                                                                            duration: 3000,
                                                                            isClosable: true,
                                                                        })
                                                                    }
                                                                }}
                                                                headerText="Excluir Item"
                                                                buttonColorScheme="red"
                                                                buttonIcon={<DeleteIcon />}
                                                            >
                                                                <Text>Tem certeza que deseja excluir este item?</Text>
                                                                <Text fontSize="sm" color="gray.600" mt={2}>
                                                                    Esta ação não pode ser desfeita.
                                                                </Text>
                                                            </ModalDelete>
                                                        </HStack>
                                                    </Td>
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </Table>
                                </TableContainer>

                                {filteredData.length === 0 && (
                                    <Card>
                                        <CardBody textAlign="center" py={12}>
                                            <Text fontSize="lg" color="gray.500">
                                                {searchTerm || Object.values(filters).some(f => f) 
                                                    ? 'Nenhum item encontrado com os filtros aplicados.' 
                                                    : 'Nenhum item cadastrado ainda.'}
                                            </Text>
                                        </CardBody>
                                    </Card>
                                )}
                            </VStack>
                        </CardBody>
                    </Card>
                </VStack>
            </Box>
            )}
        </Sidebar>
    )
}

export default Obra