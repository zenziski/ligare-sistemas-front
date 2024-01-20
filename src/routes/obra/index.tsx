import Sidebar from "../../components/Sidebar"
import { Flex, Text, Grid, Table, Thead, Tbody, Tr, Th, Td, TableContainer, GridItem, Box, Button } from "@chakra-ui/react"
import { useParams } from "react-router-dom"
import Helpers from "../../utils/helper";
import Chart from "react-apexcharts";
import StatComponent from "../../components/Stats";
import DrawerComponent from "../../components/Drawer";
import { AddIcon, SettingsIcon } from "@chakra-ui/icons";

interface IDiarioItem {
    createdAt: string;
    item: string;
    descricao: string;
    fornecedor: string;
    numeroNf: string;
    tipo: string;
    valor: number;
    status: string;
    dataEnvio: Date;
    formaPagamento: string;
    dataPagamento: Date;
    observacao: string;
};

const Obra = () => {

    const { id } = useParams<{ id: string }>()

    const diarioItems = Array<IDiarioItem>(10).fill({
        createdAt: "17/01/2024",
        item: "Teste",
        descricao: "Fornecimento concreto e Locação de um equipamento para bombeamento",
        fornecedor: "Teste",
        numeroNf: "Teste",
        tipo: "Teste",
        valor: 100,
        status: "Teste",
        dataEnvio: new Date(),
        formaPagamento: "Teste",
        dataPagamento: new Date(),
        observacao: "Teste",
    })

    return (
        <Sidebar>
            <Flex w="100%" h="100%" p={10} direction="column" fontFamily="Poppins-Regular">
                <Flex direction="row" mb="15px" justifyContent="space-between" >
                    <Text fontSize="4xl">
                        {/*TODO: mudar para nome da obra quand tiver api*/}
                        {id}
                    </Text>
                </Flex>
                <Flex
                    justifyContent={["center", "center", "center", "center", "center", "flex-start"]}
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
                    <DrawerComponent
                        isButton
                        buttonIcon={<AddIcon />}
                        buttonText="Adicionar"
                        headerText="Adicionar Item Diario"
                        buttonColorScheme="green"
                        size="md"
                    >
                        Oi
                    </DrawerComponent>
                    <DrawerComponent
                        isButton
                        buttonIcon={<SettingsIcon />}
                        buttonText="Configurar"
                        headerText="Configurar Obra"
                        buttonColorScheme="blue"
                        size="md"
                    >
                        Oi
                    </DrawerComponent>
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
                            </Tr>
                        </Thead>
                        <Tbody>
                            {diarioItems.map((item, index) => (
                                <Tr key={index}>
                                    <Td>{item.createdAt}</Td>
                                    <Td maxW={'350px'} whiteSpace="normal">{item.descricao}</Td>
                                    <Td>{item.fornecedor}</Td>
                                    <Td>{item.valor}</Td>
                                    <Td>{item.numeroNf}</Td>
                                    <Td>
                                        <Text>
                                            {item.status}
                                        </Text>
                                        <Text
                                            color={'gray'}
                                            fontSize={'sm'}
                                        >
                                            {item.formaPagamento}
                                        </Text>
                                    </Td>
                                    <Td>{Helpers.toViewDate(String(item.dataPagamento))}</Td>
                                    <Td>
                                        {item.item}
                                        <Text
                                            color={'gray'}
                                            fontSize={'sm'}
                                        >
                                            {item.tipo}
                                        </Text>
                                    </Td>
                                    <Td>{Helpers.toViewDate(String(item.dataEnvio))}</Td>
                                    <Td>{item.observacao}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Flex>
        </Sidebar>
    )
}

export default Obra