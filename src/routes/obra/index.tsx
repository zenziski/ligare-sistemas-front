import { EditIcon } from "@chakra-ui/icons"
import Sidebar from "../../components/Sidebar"
import { Flex, Text, Grid, FormControl, FormLabel, Input, Table, Thead, Tbody, Tr, Th, Td, TableContainer, InputGroup, InputLeftElement, Checkbox, Avatar, IconButton, Badge, Card, CardBody, Stat, StatHelpText, StatLabel, StatNumber, StatArrow, StatGroup, GridItem } from "@chakra-ui/react"
import { useParams } from "react-router-dom"
import Helpers from "../../utils/helper";
import Chart from "react-apexcharts";
import StatComponent from "../../components/Stats";


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
        descricao: "Teste",
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
                <Grid gap={4} mb={4} templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(3, 1fr)", '2xl': "repeat(6, 1fr)" }}>
                    <GridItem>
                        <StatComponent
                            label="Material"
                            value={Helpers.toBrazilianCurrency(1000.25)}
                            hasArrow
                            arrowType="increase"
                            helpText="10,5% nos últimos 30 dias"
                        />
                    </GridItem>
                    <GridItem>
                        <StatComponent
                            label="Mão de obra"
                            value={Helpers.toBrazilianCurrency(1000.25)}
                            hasArrow
                            arrowType="decrease"
                            helpText="5,4% nos últimos 30 dias"
                        />
                    </GridItem>

                    <GridItem>
                        <StatComponent
                            label="Mat/Mo Terceiros"
                            value={Helpers.toBrazilianCurrency(1000.25)}
                            hasArrow
                            arrowType="increase"
                            helpText="92% nos últimos 30 dias"
                        />
                    </GridItem>
                    <GridItem>
                        <StatComponent
                            label="Administração"
                            value={Helpers.toBrazilianCurrency(1000.25)}
                            helpText="Valor total da obra"
                        />
                    </GridItem>
                    <GridItem>
                        <StatComponent
                            label="Total da Obra"
                            value={Helpers.toBrazilianCurrency(1000.25)}
                            helpText="Valor total da obra"
                        />
                    </GridItem>
                    <GridItem>
                        <StatComponent
                            label="Valor m²"
                            value={Helpers.toBrazilianCurrency(1000.25)}
                            helpText="Valor do metro quadrado"
                        />
                    </GridItem>
                </Grid>
                <Flex w="100vw" h="70vh" mb={8} direction="row">
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
                        width="650px"
                        height="100%"
                    />
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
                        width="650px"
                        height="100%"
                    />
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
                        width="650px"
                        height="100%"
                    />
                </Flex>
                <TableContainer >
                    <Table variant="striped" maxW="100vw">
                        <Thead>
                            <Tr>
                                <Th>Criado em</Th>
                                <Th>Descrição</Th>
                                <Th>Fornecedor</Th>
                                <Th>Valor</Th>
                                <Th>N° NF</Th>
                                <Th>Status</Th>
                                <Th>Forma de pagamento</Th>
                                <Th>Data de pagamento</Th>
                                <Th>Item</Th>
                                <Th>Tipo</Th>
                                <Th>Data de envio</Th>
                                <Th>Observação</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {diarioItems.map((item, index) => (
                                <Tr key={index}>
                                    <Td>{item.createdAt}</Td>
                                    <Td>{item.descricao}</Td>
                                    <Td>{item.fornecedor}</Td>
                                    <Td>{item.valor}</Td>
                                    <Td>{item.numeroNf}</Td>
                                    <Td>{item.status}</Td>
                                    <Td>{item.formaPagamento}</Td>
                                    <Td>{Helpers.toViewDate(String(item.dataPagamento))}</Td>
                                    <Td>{item.item}</Td>
                                    <Td>{item.tipo}</Td>
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