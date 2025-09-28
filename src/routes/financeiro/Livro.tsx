import { AddIcon } from "@chakra-ui/icons";
import DrawerComponent from "../../components/Drawer";
import Sidebar from "../../components/Sidebar";
import {
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  TableContainer,
  Tabs,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useState } from "react";

const Livro = () => {
  const [loading] = useState<boolean>(false);
  return (
    <Sidebar>
      {loading ? (
        <Flex justifyContent="center" alignItems="center" height="100vh">
          <Text fontSize="2xl">Carregando...</Text>
        </Flex>
      ) : (
        <Flex
          w="100%"
          h="100%"
          p={10}
          direction="column"
          fontFamily="Poppins-Regular"
        >
          <Tabs variant="enclosed" onChange={() => {}}>
            <TabList>
              <Tab>Livro Diário</Tab>
              <Tab>Contas a Pagar</Tab>
              <Tab>Contas a Receber</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Flex direction="column">
                  <Flex direction="row" justifyContent="space-between">
                    <Text fontSize="2xl">Filtros</Text>
                  </Flex>
                  <TableContainer>
                    <Table variant="striped">
                      <Thead>
                        <Tr>
                          <Th>Data</Th>
                          <Th>Mês</Th>
                          <Th>Tipo</Th>
                          <Th>Grupo</Th>
                          <Th>Subgrupo</Th>
                          <Th>Categoria</Th>
                          <Th>Conta Bancária</Th>
                          <Th>Valor</Th>
                          <Th>Saldo</Th>
                          <Th>Obs</Th>
                        </Tr>
                      </Thead>
                      <Tbody></Tbody>
                    </Table>
                  </TableContainer>
                </Flex>
              </TabPanel>
              <TabPanel>
                <Flex direction="column">
                  <Flex direction="row" justifyContent="space-between">
                    <Text fontSize="2xl">Filtros</Text>
                    <DrawerComponent
                      headerText="Adicionar Entrada"
                      buttonText="Adicionar"
                      buttonIcon={<AddIcon />}
                    >
                      oi
                    </DrawerComponent>
                  </Flex>
                  <TableContainer>
                    <Table variant="striped">
                      <Thead>
                        <Tr>
                          <Th>Data</Th>
                          <Th>Grupo</Th>
                          <Th>Subgrupo</Th>
                          <Th>Categoria</Th>
                          <Th>Data Prevista</Th>
                          <Th>Valor</Th>
                          <Th>Saldo</Th>
                          <Th>Mês</Th>
                          <Th>Ações</Th>
                        </Tr>
                      </Thead>
                      <Tbody></Tbody>
                    </Table>
                  </TableContainer>
                </Flex>
              </TabPanel>
              <TabPanel>
                <Flex direction="column">
                  <Flex direction="row" justifyContent="space-between">
                    <Text fontSize="2xl">Filtros</Text>
                    <DrawerComponent
                      headerText="Adicionar Entrada"
                      buttonText="Adicionar"
                      buttonIcon={<AddIcon />}
                    >
                      oi
                    </DrawerComponent>
                  </Flex>
                  <TableContainer>
                    <Table variant="striped">
                      <Thead>
                        <Tr>
                          <Th>Data</Th>
                          <Th>Grupo</Th>
                          <Th>Subgrupo</Th>
                          <Th>Categoria</Th>
                          <Th>Data Prevista</Th>
                          <Th>Valor</Th>
                          <Th>Mês</Th>
                          <Th>Ações</Th>
                        </Tr>
                      </Thead>
                      <Tbody></Tbody>
                    </Table>
                  </TableContainer>
                </Flex>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
      )}
    </Sidebar>
  );
};

export default Livro;
