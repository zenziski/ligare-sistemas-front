import { Flex, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react"
import Sidebar from "../../components/Sidebar"
import Listagem from "./fragments/Listagem"

const DetalhesPonto = () => {

    return (
        <Sidebar>
            <Flex
                height="100%"
                width="100%"
                p={10}
                direction="column"
            >
                <Flex direction="row" mb="15px" justifyContent="space-between" >
                    <Text fontSize="4xl">
                        Detalhes Ponto
                    </Text>
                </Flex>
                <Tabs variant='enclosed'>
                    <TabList>
                        <Tab>Lista de Pontos</Tab>
                        <Tab>Two</Tab>
                        <Tab>Three</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Listagem />
                        </TabPanel>
                        <TabPanel>
                            <p>two!</p>
                        </TabPanel>
                        <TabPanel>
                            <p>three!</p>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Flex>
        </Sidebar>
    )
}

export default DetalhesPonto