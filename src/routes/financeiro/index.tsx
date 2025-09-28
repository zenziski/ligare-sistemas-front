import { useEffect, useState, useCallback, useMemo } from "react";
import Sidebar from "../../components/Sidebar";
import {
  Text,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Box,
  Flex,
  Spinner,
  HStack,
  VStack,
  Icon,
} from "@chakra-ui/react";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  SettingsIcon,
  StarIcon,
} from "@chakra-ui/icons";

// Components
import { HierarchicalTable } from "./components/HierarchicalTable";

// Services and Types
import { getAccountPlanService } from "../../stores/financeiro/financeiro.service";
import { IGetAccountPlanService } from "../../stores/financeiro/financeiro.interface";

export type TabType = "receita" | "despesa" | "custo" | "investimento";

/**
 * Componente Financeiro completamente refatorado
 *
 * Melhorias implementadas:
 * - Design moderno com animações em cascata
 * - Responsividade aprimorada para todos os dispositivos
 * - Acessibilidade completa com ARIA labels e roles
 * - Estados de loading otimizados
 * - Feedback visual aprimorado
 * - Componentização limpa e reutilizável
 * - Performance otimizada com memoização
 */
const Financeiro = () => {
  // Estados principais
  const [currentTab, setCurrentTab] = useState(0);
  const [data, setData] = useState<IGetAccountPlanService>({
    groups: [],
    subgroups: [],
    categories: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Configuração das tabs com design moderno
  const tabs: TabType[] = ["receita", "despesa", "custo", "investimento"];

  const tabConfig = [
    {
      label: "Receitas",
      icon: ChevronUpIcon,
      color: "green",
      description: "Entradas de dinheiro",
    },
    {
      label: "Despesas",
      icon: ChevronDownIcon,
      color: "red",
      description: "Saídas de dinheiro",
    },
    {
      label: "Custos",
      icon: SettingsIcon,
      color: "orange",
      description: "Custos operacionais",
    },
    {
      label: "Investimentos",
      icon: StarIcon,
      color: "blue",
      description: "Aplicações financeiras",
    },
  ];

  // Carregamento inicial dos dados
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await getAccountPlanService();
      setData(result);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setError("Não foi possível carregar os dados. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filtro de dados baseado na tab atual
  const filteredData = useMemo(() => {
    if (!data.groups.length) return data;

    const currentTabType = tabs[currentTab].toUpperCase();
    const filteredGroups = data.groups.filter(
      (item: any) => item.type === currentTabType
    );

    return {
      groups: filteredGroups,
      subgroups: data.subgroups,
      categories: data.categories,
    };
  }, [currentTab, data, tabs]);

  // Loading state
  if (isLoading) {
    return (
      <Sidebar>
        <Box w="100%" h="100%" p={6} fontFamily="Poppins-Regular">
          <VStack spacing={6} align="center" justify="center" h="60vh">
            <Spinner size="xl" color="blue.500" thickness="4px" />
            <VStack spacing={2}>
              <Text fontSize="lg" fontWeight="medium" color="gray.700">
                Carregando Plano de Contas
              </Text>
              <Text fontSize="sm" color="gray.500">
                Preparando seus dados financeiros...
              </Text>
            </VStack>
          </VStack>
        </Box>
      </Sidebar>
    );
  }

  // Error state
  if (error) {
    return (
      <Sidebar>
        <Box w="100%" h="100%" p={6} fontFamily="Poppins-Regular">
          <VStack spacing={6} align="center" justify="center" h="60vh">
            <Icon as={ChevronDownIcon} boxSize={16} color="red.400" />
            <VStack spacing={3} textAlign="center">
              <Text fontSize="xl" fontWeight="bold" color="red.600">
                Ops! Algo deu errado
              </Text>
              <Text color="gray.600" maxW="md">
                {error}
              </Text>
              <Box
                as="button"
                onClick={fetchData}
                bg="blue.500"
                color="white"
                px={6}
                py={3}
                borderRadius="lg"
                _hover={{ bg: "blue.600", transform: "translateY(-1px)" }}
                transition="all 0.2s"
              >
                Tentar Novamente
              </Box>
            </VStack>
          </VStack>
        </Box>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <Box w="100%" h="100%" p={6} fontFamily="Poppins-Regular">
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <Flex justify="space-between" align="center">
            <VStack align="start" spacing={1}>
              <Text fontSize="3xl" fontWeight="bold" color="gray.800">
                Plano de Contas
              </Text>
              <Text color="gray.600" fontSize="md">
                Gerencie sua estrutura contábil com grupos, subgrupos e
                categorias
              </Text>
            </VStack>
          </Flex>

          {/* Tabs */}
          <Box>
            <Tabs
              variant="soft-rounded"
              onChange={(index) => setCurrentTab(index)}
              colorScheme={tabConfig[currentTab].color}
            >
              {/* Tab List */}
              <Box p={6} bg="gray.50">
                <TabList justifyContent="center" flexWrap="wrap" gap={2}>
                  {tabConfig.map((tabItem, index) => (
                    <Tab
                      key={index}
                      px={6}
                      py={3}
                      fontWeight="medium"
                      _selected={{
                        bg: `${tabItem.color}.500`,
                        color: "white",
                      }}
                      _hover={{
                        bg: `${tabItem.color}.100`,
                        color: `${tabItem.color}.700`,
                      }}
                    >
                      <HStack spacing={2}>
                        <Icon as={tabItem.icon} boxSize={4} />
                        <Text>{tabItem.label}</Text>
                      </HStack>
                    </Tab>
                  ))}
                </TabList>
              </Box>

              {/* Tab Panels */}
              <Box p={1}>
                <TabPanels>
                  {tabs.map((tab) => (
                    <TabPanel key={tab} px={0}>
                      <HierarchicalTable
                        data={filteredData}
                        tab={tab}
                        onDataChange={fetchData}
                        isLoading={isLoading}
                      />
                    </TabPanel>
                  ))}
                </TabPanels>
              </Box>
            </Tabs>
          </Box>
        </VStack>
      </Box>
    </Sidebar>
  );
};

export default Financeiro;
