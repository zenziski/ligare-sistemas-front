import { Box, Divider, Flex, GridItem, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import StatComponent from "../../components/Stats";
import { DashboardState } from "../../stores/dashboard/interface";
import { getDashboard } from "../../stores/dashboard/service";
import Helpers from "../../utils/helper";
import Chart from "react-apexcharts";

const Home = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<DashboardState>({} as DashboardState);
    const [chartData, setChartData] = useState<any>();

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            const response = await getDashboard();
            setData(response);
            let temp: any = {}
            response.administrationPaymentPerConstruction.forEach((item) => {
                let futurePayments = item.futurePayments && Object.entries(item.futurePayments);
                futurePayments.forEach((futurePayment) => {
                    if (temp[futurePayment[0]]) {
                        temp[futurePayment[0]] += parseFloat(futurePayment[1].toFixed(2));
                    } else {
                        temp[futurePayment[0]] = parseFloat(futurePayment[1].toFixed(2));
                    }
                })
            });
            temp = Object.entries(temp);
            const monthNames: any = {
                '01': 'JAN',
                '02': 'FEV',
                '03': 'MAR',
                '04': 'ABR',
                '05': 'MAI',
                '06': 'JUN',
                '07': 'JUL',
                '08': 'AGO',
                '09': 'SET',
                '10': 'OUT',
                '11': 'NOV',
                '12': 'DEZ'
            };
            setChartData({
                labels: temp.map((item: any) => {
                    const [year, month] = item[0].split('-');
                    return `${monthNames[month]}/${year}`;
                }), data: temp.map((item: any) => item[1])
            });
            setLoading(false);
        }
        getData();
    }, []);
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
                            Dashboard
                        </Text>
                    </Flex>
                    <Flex
                        justifyContent={["center", "center", "center", "center", "center", "space-around"]}
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
                                label="Total de obras"
                                value={data.totalConstructions}
                                helpText="Total de obras cadastradas"
                            />
                        </GridItem>
                        <GridItem
                            mb={2}
                            mr={2}
                            width={['100%', '100%', '100%', 'auto']}
                        >
                            <StatComponent
                                label="Valor de administração total"
                                value={Helpers.toBrazilianCurrency(data.totalAdministrationCost)}
                                helpText="Valor total de administração"
                            />
                        </GridItem>
                        <GridItem
                            mb={2}
                            mr={2}
                            width={['100%', '100%', '100%', 'auto']}
                        >
                            <StatComponent
                                label="Total recebido"
                                value={Helpers.toBrazilianCurrency(data.totalAlreadyPaid)}
                                helpText="Valor total recebido"
                            />
                        </GridItem>
                        <GridItem
                            mb={2}
                            mr={2}
                            width={['100%', '100%', '100%', 'auto']}
                        >
                            <StatComponent
                                label="À receber no próximo mês"
                                value={Helpers.toBrazilianCurrency(data.totalFutureValuePerMonth)}
                                helpText="Valor total das parcelas correntes"
                            />
                        </GridItem>
                        <GridItem
                            mb={2}
                            mr={2}
                            width={['100%', '100%', '100%', 'auto']}
                        >
                            <StatComponent
                                label="Meses até a última parcela"
                                value={data.maxMonths}
                                helpText="Valor total das parcelas correntes"
                            />
                        </GridItem>
                    </Flex>
                    <Divider />
                    {chartData && (
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
                                            text: 'Total a receber por mês',
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
                                            categories: [...chartData.labels],
                                        }
                                    }}
                                    series={[{
                                        name: "Gastos por item",
                                        data: [...chartData.data]
                                    }]}
                                    type="bar"
                                    width="100%"
                                    height="100%"
                                />
                            </Box>
                        </Flex>
                    )}
                </Flex>
            )}
        </Sidebar>
    )
}

export default Home;