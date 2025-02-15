// import { AddIcon, CloseIcon, EditIcon, SearchIcon } from "@chakra-ui/icons"
// import DrawerComponent from "../../components/Drawer"
import Sidebar from "../../components/Sidebar"
import { Flex, Text, Grid, Tabs, Tab, TabList, TabPanel, TabPanels, Box } from "@chakra-ui/react"
import { useEffect, useState } from "react"
// import { IUser, schema } from "../../stores/usuarios/interface"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { getAll, createUser, updateUser } from "../../stores/usuarios/service"
// import moment from "moment"
// import PhoneInput from "../../components/PhoneInput"
import { List, TabType } from "./fragments/List"
import { getAccountPlanService } from "../../stores/financeiro/financeiro.service"

const Financeiro = () => {
    const [currentTab, setCurrentTab] = useState(0)
    const [data, setData] = useState({
        groups: [],
        subgroups: [],
        categories: []
    })

    useEffect(() => {
        const fetchData = async () => {
            const result = await getAccountPlanService()
            console.log(result);
            setData(result)
        }
        fetchData()
    }, [])

    useEffect(() => {
        let groups = data.groups
        let subgroups = data.subgroups
        let categories = data.categories
        groups = groups.filter((item: any) => item.type === tab[currentTab].toUpperCase())
        setData({
            groups: groups,
            subgroups: subgroups,
            categories: categories
        })
        console.log(data);
        
    }, [currentTab])

    const tab: TabType[] = ['receita', 'despesa', 'custo', 'investimento']
    return (
        <Sidebar>
            <Flex w="100%" h="100%" p={10} direction="column" fontFamily="Poppins-Regular">
                <Flex direction="row" mb="15px" justifyContent="space-between" >
                    <Text fontSize="4xl">
                        Plano de contas - {tab[currentTab].toUpperCase()}
                    </Text>
                </Flex>
                <Tabs variant='enclosed' onChange={(index) => setCurrentTab(index)}>
                    <TabList>
                        <Tab>Receita</Tab>
                        <Tab>Despesa</Tab>
                        <Tab>Custo</Tab>
                        <Tab>Investimento</Tab>
                    </TabList>
                    <TabPanels>
                        {
                            tab.map((_, index) => (
                                <TabPanel
                                    key={index}
                                >
                                    <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                                        <Box>
                                            <List type="group" tab={tab[currentTab]} data={data} key={tab[currentTab]} />
                                        </Box>
                                        <Box>
                                            <List type="subgroup" tab={tab[currentTab]} data={data} key={tab[currentTab]} />
                                        </Box>
                                        <Box>
                                            <List type="category" tab={tab[currentTab]} data={data} key={tab[currentTab]} />
                                        </Box>
                                    </Grid>
                                </TabPanel>
                            ))
                        }
                    </TabPanels>
                </Tabs>
            </Flex>
        </Sidebar >
    )
}

export default Financeiro