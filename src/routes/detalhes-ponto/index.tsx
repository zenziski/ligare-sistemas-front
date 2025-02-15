import {
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import Sidebar from "../../components/Sidebar";
import Listagem from "./fragments/Listagem";
import ListagemPedidosAjuste from "./fragments/ListagemPedidosAjuste";
import { useContext } from "react";
import UserContext from "../../contexts/UserContext";

const DetalhesPonto = () => {
  const { user } = useContext(UserContext);
  return (
    <Sidebar>
      <Flex height="100%" width="100%" p={10} direction="column">
        <Flex direction="row" mb="15px" justifyContent="space-between">
          <Text fontSize="4xl">Detalhes Ponto</Text>
        </Flex>
        <Tabs variant="enclosed">
          <TabList>
            <Tab>Lista de Pontos</Tab>
            {user?.roles?.admin && <Tab>Solicitações de Ajuste</Tab>}
          </TabList>
          <TabPanels>
            <TabPanel>
              <Listagem />
            </TabPanel>
            {user?.roles?.admin && (
              <TabPanel>
                <ListagemPedidosAjuste />
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </Flex>
    </Sidebar>
  );
};

export default DetalhesPonto;
