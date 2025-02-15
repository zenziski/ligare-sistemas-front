import { Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { DashboardState } from "../../stores/dashboard/interface";
import { getDashboard } from "../../stores/dashboard/service";

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
            console.log(data, chartData);
            
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
                    Em construção
                </Flex>
            )}
        </Sidebar>
    )
}

export default Home;