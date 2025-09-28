import React, { useState, useCallback, useMemo } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  HStack,
  VStack,
  Tooltip,
  Text,
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useColorModeValue,
  Badge,
  useDisclosure,
  Spinner,
  useToast,
  Input,
} from "@chakra-ui/react";
import {
  EditIcon,
  DeleteIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from "@chakra-ui/icons";
import { motion, AnimatePresence } from "framer-motion";

// Enhanced Components
import { EnhancedDrawer } from "./EnhancedDrawer";
import { EditModal, DeleteAlert } from "./EnhancedModals";

// Services and Types
import {
  createAccountPlanService,
  updateAccountPlanService,
  removeAccountPlanService,
} from "../../../stores/financeiro/financeiro.service";

const MotionTr = motion(Tr);
const MotionBox = motion(Box);

// Types
interface GroupItem {
  _id?: string;
  name: string;
  type: string;
}

interface SubgroupItem {
  _id?: string;
  name: string;
  group: string;
}

interface CategoryItem {
  _id?: string;
  name: string;
  subgroup: string;
}

interface HierarchicalData {
  groups: GroupItem[];
  subgroups: SubgroupItem[];
  categories: CategoryItem[];
}

interface HierarchicalTableProps {
  data: HierarchicalData;
  tab: string;
  onDataChange: () => void;
  isLoading?: boolean;
}

interface ExpandedState {
  [groupId: string]: {
    isExpanded: boolean;
    subgroups: {
      [subgroupId: string]: boolean;
    };
  };
}

/**
 * Tabela hierárquica expansível para plano de contas
 * Permite expandir grupos -> subgrupos -> categorias na mesma tabela
 * Inclui criação contextual baseada no nível expandido
 */
export const HierarchicalTable: React.FC<HierarchicalTableProps> = ({
  data,
  tab,
  onDataChange,
  isLoading = false,
}) => {
  // Estados principais
  const [expandedState, setExpandedState] = useState<ExpandedState>({});
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deletingItem, setDeletingItem] = useState<any>(null);
  const [loadingStates, setLoadingStates] = useState({
    creating: false,
    updating: false,
    deleting: false,
  });

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    contextGroupId: "",
    contextSubgroupId: "",
    itemType: "group" as "group" | "subgroup" | "category",
  });

  // Modal controls
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const toast = useToast();

  // Theme
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const expandedBg = useColorModeValue("blue.25", "blue.900");

  // Cores por tipo
  const typeColors = {
    group: "blue",
    subgroup: "purple",
    category: "teal",
  };

  // Toggle expansion
  const toggleGroupExpansion = useCallback((groupId: string) => {
    setExpandedState((prev) => ({
      ...prev,
      [groupId]: {
        isExpanded: !prev[groupId]?.isExpanded,
        subgroups: prev[groupId]?.subgroups || {},
      },
    }));
  }, []);

  const toggleSubgroupExpansion = useCallback(
    (groupId: string, subgroupId: string) => {
      setExpandedState((prev) => ({
        ...prev,
        [groupId]: {
          ...prev[groupId],
          subgroups: {
            ...prev[groupId]?.subgroups,
            [subgroupId]: !prev[groupId]?.subgroups?.[subgroupId],
          },
        },
      }));
    },
    []
  );

  // Get filtered data based on current tab
  const filteredData = useMemo(() => {
    const currentTabType = tab.toUpperCase();
    return {
      groups: data.groups.filter((group) => group.type === currentTabType),
      subgroups: data.subgroups,
      categories: data.categories,
    };
  }, [data, tab]);

  // Get subgroups for a group
  const getSubgroupsForGroup = useCallback(
    (groupId: string) => {
      return filteredData.subgroups.filter(
        (subgroup) => subgroup.group === groupId
      );
    },
    [filteredData.subgroups]
  );

  // Get categories for a subgroup
  const getCategoriesForSubgroup = useCallback(
    (subgroupId: string) => {
      return filteredData.categories.filter(
        (category) => category.subgroup === subgroupId
      );
    },
    [filteredData.categories]
  );

  // CRUD Operations
  const handleCreate = useCallback(async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe o nome",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoadingStates((prev) => ({ ...prev, creating: true }));

    try {
      const payload: any = {
        name: formData.name.trim(),
        planType: tab.toUpperCase(),
        type: formData.itemType,
      };

      // Set parent based on context
      if (formData.itemType === "subgroup" && formData.contextGroupId) {
        payload.parent = formData.contextGroupId;
      } else if (
        formData.itemType === "category" &&
        formData.contextSubgroupId
      ) {
        payload.parent = formData.contextSubgroupId;
      }

      console.log("Payload de criação:", payload);

      await createAccountPlanService(payload);

      toast({
        title: `${formData.itemType} criado com sucesso!`,
        description: `"${formData.name}" foi adicionado à sua lista`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });

      // Reset form
      setFormData({
        name: "",
        contextGroupId: "",
        contextSubgroupId: "",
        itemType: "group",
      });

      onDataChange();
    } catch (error) {
      console.error("Erro ao criar:", error);
      toast({
        title: "Erro ao criar",
        description: `Não foi possível criar o ${formData.itemType}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, creating: false }));
    }
  }, [formData, tab, toast, onDataChange]);

  const handleEdit = useCallback(
    (item: any, type: "group" | "subgroup" | "category") => {
      setEditingItem({ ...item, type });
      setFormData({
        name: item.name,
        contextGroupId: type === "subgroup" ? item.group : "",
        contextSubgroupId: type === "category" ? item.subgroup : "",
        itemType: type,
      });
      onEditOpen();
    },
    [onEditOpen]
  );

  const handleUpdate = useCallback(async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe o nome",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoadingStates((prev) => ({ ...prev, updating: true }));

    try {
      const payload: any = {
        id: editingItem._id,
        name: formData.name.trim(),
        planType: tab.toUpperCase(),
        type: editingItem.type,
      };

      if (editingItem.type === "subgroup" && formData.contextGroupId) {
        payload.parent = formData.contextGroupId;
      } else if (
        editingItem.type === "category" &&
        formData.contextSubgroupId
      ) {
        payload.parent = formData.contextSubgroupId;
      }

      await updateAccountPlanService(payload);

      toast({
        title: `${editingItem.type} atualizado!`,
        description: `"${formData.name}" foi atualizado com sucesso`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });

      onEditClose();
      setEditingItem(null);
      setFormData({
        name: "",
        contextGroupId: "",
        contextSubgroupId: "",
        itemType: "group",
      });
      onDataChange();
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      toast({
        title: "Erro ao atualizar",
        description: `Não foi possível atualizar o ${editingItem.type}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, updating: false }));
    }
  }, [formData, editingItem, tab, toast, onEditClose, onDataChange]);

  const handleDelete = useCallback(
    (item: any, type: "group" | "subgroup" | "category") => {
      setDeletingItem({ ...item, type });
      onDeleteOpen();
    },
    [onDeleteOpen]
  );

  const confirmDelete = useCallback(async () => {
    setLoadingStates((prev) => ({ ...prev, deleting: true }));

    try {
      await removeAccountPlanService({
        id: deletingItem._id,
        type: deletingItem.type,
      });

      toast({
        title: `${deletingItem.type} excluído!`,
        description: `"${deletingItem.name}" foi removido com sucesso`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });

      onDeleteClose();
      setDeletingItem(null);
      onDataChange();
    } catch (error) {
      console.error("Erro ao excluir:", error);
      toast({
        title: "Erro ao excluir",
        description: `Não foi possível excluir o ${deletingItem.type}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, deleting: false }));
    }
  }, [deletingItem, toast, onDeleteClose, onDataChange]);

  // Loading state
  if (isLoading) {
    return (
      <Box
        // bg={cardBg}
        // borderWidth={1}
        // borderColor={borderColor}
        borderRadius="xl"
        p={8}
        textAlign="center"
      >
        <VStack spacing={4}>
          <Spinner size="lg" color="blue.500" />
          <Text color="gray.600">Carregando plano de contas...</Text>
        </VStack>
      </Box>
    );
  }

  // Empty state
  if (!filteredData.groups.length) {
    return (
      <Box
        // bg={cardBg}
        // borderWidth={1}
        // borderColor={borderColor}
        borderRadius="xl"
        overflow="hidden"
      >
        {/* Header with Add Group Button */}
        <HStack
          justify="space-between"
          p={6}
          borderBottomWidth={1}
          borderColor={borderColor}
        >
          <VStack align="start" spacing={1}>
            <Text fontSize="lg" fontWeight="bold" color="gray.800">
              Plano de Contas - {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
            <Text fontSize="sm" color="gray.600">
              Organize suas contas em uma estrutura hierárquica
            </Text>
          </VStack>
          <EnhancedDrawer
            title="Criar Grupo"
            color="blue"
            onAction={handleCreate}
            isLoading={loadingStates.creating}
            buttonText="Criar Grupo"
          >
            <VStack spacing={4} align="stretch">
              <Text fontSize="md" fontWeight="semibold" color="blue.600">
                Novo Grupo
              </Text>
              <Text fontSize="sm" color="gray.600">
                Grupos são as categorias principais do seu plano de contas
              </Text>
              <Box>
                <Text fontSize="sm" fontWeight="medium" mb={2}>
                  Nome do Grupo *
                </Text>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                      itemType: "group",
                    }))
                  }
                  placeholder="Ex: Receitas Operacionais"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </Box>
            </VStack>
          </EnhancedDrawer>
        </HStack>

        {/* Empty State */}
        <Box p={8}>
          <Alert status="info" borderRadius="lg">
            <AlertIcon />
            <VStack align="start" spacing={2}>
              <AlertTitle>Nenhum grupo encontrado!</AlertTitle>
              <AlertDescription>
                Comece criando seu primeiro grupo para organizar seu plano de
                contas.
              </AlertDescription>
            </VStack>
          </Alert>
        </Box>
      </Box>
    );
  }

  return (
    <>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        // bg={cardBg}
        // borderWidth={1}
        // borderColor={borderColor}
        // borderRadius="xl"
        overflow="hidden"
        // shadow="lg"
      >
        {/* Header */}
        <HStack
          justify="space-between"
          p={6}
          borderBottomWidth={1}
          borderColor={borderColor}
        >
          <VStack align="start" spacing={1}>
            <Text fontSize="lg" fontWeight="bold" color="gray.800">
              Plano de Contas - {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
            <HStack spacing={4}>
              <Text fontSize="sm" color="gray.600">
                {filteredData.groups.length} grupos •{" "}
                {filteredData.subgroups.length} subgrupos •{" "}
                {filteredData.categories.length} categorias
              </Text>
            </HStack>
          </VStack>
          <EnhancedDrawer
            title="Criar Grupo"
            color="blue"
            onAction={handleCreate}
            isLoading={loadingStates.creating}
            buttonText="Criar Grupo"
          >
            <VStack spacing={4} align="stretch">
              <Text fontSize="md" fontWeight="semibold" color="blue.600">
                Novo Grupo
              </Text>
              <Text fontSize="sm" color="gray.600">
                Grupos são as categorias principais do seu plano de contas
              </Text>
              <Box>
                <Text fontSize="sm" fontWeight="medium" mb={2}>
                  Nome do Grupo *
                </Text>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                      itemType: "group",
                    }))
                  }
                  placeholder="Ex: Receitas Operacionais"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </Box>
            </VStack>
          </EnhancedDrawer>
        </HStack>

        {/* Hierarchical Table */}
        <Box overflowX="auto">
          <Table variant="simple" size="md">
            <Thead bg={useColorModeValue("gray.50", "gray.900")}>
              <Tr>
                <Th width="50px" textAlign="center">
                  <Text fontSize="xs" color="gray.600">
                    #
                  </Text>
                </Th>
                <Th>
                  <Text fontSize="sm" fontWeight="bold" color="gray.700">
                    Nome
                  </Text>
                </Th>
                <Th width="100px" textAlign="center">
                  <Text fontSize="sm" fontWeight="bold" color="gray.700">
                    Tipo
                  </Text>
                </Th>
                <Th width="150px" textAlign="center">
                  <Text fontSize="sm" fontWeight="bold" color="gray.700">
                    Ações
                  </Text>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              <AnimatePresence>
                {filteredData.groups.map((group, groupIndex) => {
                  if (!group._id) return null;
                  const subgroups = getSubgroupsForGroup(group._id);
                  const isGroupExpanded = expandedState[group._id]?.isExpanded;

                  return (
                    <React.Fragment key={group._id}>
                      {/* GROUP ROW */}
                      <MotionTr
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, delay: groupIndex * 0.05 }}
                        bg={isGroupExpanded ? expandedBg : "transparent"}
                        _hover={{ bg: hoverBg }}
                        borderLeftWidth={4}
                        borderLeftColor={`${typeColors.group}.400`}
                      >
                        {/* Expand/Collapse Button */}
                        <Td textAlign="center" py={4}>
                          <IconButton
                            aria-label={
                              isGroupExpanded
                                ? "Colapsar grupo"
                                : "Expandir grupo"
                            }
                            icon={
                              isGroupExpanded ? (
                                <ChevronDownIcon />
                              ) : (
                                <ChevronRightIcon />
                              )
                            }
                            size="sm"
                            variant="ghost"
                            colorScheme="blue"
                            onClick={() =>
                              group._id && toggleGroupExpansion(group._id)
                            }
                            isDisabled={subgroups.length === 0}
                            opacity={subgroups.length === 0 ? 0.3 : 1}
                          />
                        </Td>

                        {/* Group Name */}
                        <Td>
                          <HStack spacing={3}>
                            <Badge
                              colorScheme="blue"
                              variant="subtle"
                              px={2}
                              py={1}
                              borderRadius="md"
                            >
                              Grupo
                            </Badge>
                            <Text fontWeight="semibold" fontSize="md">
                              {group.name}
                            </Text>
                            {subgroups.length > 0 && (
                              <Badge
                                size="sm"
                                colorScheme="gray"
                                variant="outline"
                              >
                                {subgroups.length} subgrupos
                              </Badge>
                            )}
                          </HStack>
                        </Td>

                        {/* Type Badge */}
                        <Td textAlign="center">
                          <Badge
                            colorScheme="blue"
                            variant="solid"
                            borderRadius="full"
                          >
                            Grupo
                          </Badge>
                        </Td>

                        {/* Actions */}
                        <Td textAlign="center">
                          <HStack spacing={1} justify="center">
                            {/* Add Subgroup Button */}
                            <EnhancedDrawer
                              title="Criar Subgrupo"
                              color="purple"
                              onAction={handleCreate}
                              isLoading={loadingStates.creating}
                              buttonText="Criar Subgrupo"
                            >
                              <VStack spacing={4} align="stretch">
                                <Text
                                  fontSize="md"
                                  fontWeight="semibold"
                                  color="purple.600"
                                >
                                  Novo Subgrupo
                                </Text>
                                <Box
                                  bg="purple.50"
                                  p={3}
                                  borderRadius="lg"
                                  border="1px solid"
                                  borderColor="purple.200"
                                >
                                  <Text fontSize="sm" color="purple.700">
                                    <strong>Grupo:</strong> {group.name}
                                  </Text>
                                </Box>
                                <Box>
                                  <Text
                                    fontSize="sm"
                                    fontWeight="medium"
                                    mb={2}
                                  >
                                    Nome do Subgrupo *
                                  </Text>
                                  <Input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                      setFormData((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                        itemType: "subgroup",
                                        contextGroupId: group._id || "",
                                      }))
                                    }
                                    placeholder="Ex: Vendas de Produtos"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  />
                                </Box>
                              </VStack>
                            </EnhancedDrawer>

                            <Tooltip label="Editar grupo" hasArrow>
                              <IconButton
                                aria-label="Editar grupo"
                                icon={<EditIcon />}
                                size="sm"
                                colorScheme="blue"
                                variant="ghost"
                                onClick={() => handleEdit(group, "group")}
                              />
                            </Tooltip>

                            <Tooltip label="Excluir grupo" hasArrow>
                              <IconButton
                                aria-label="Excluir grupo"
                                icon={<DeleteIcon />}
                                size="sm"
                                colorScheme="red"
                                variant="ghost"
                                onClick={() => handleDelete(group, "group")}
                              />
                            </Tooltip>
                          </HStack>
                        </Td>
                      </MotionTr>

                      {/* SUBGROUPS */}
                      <AnimatePresence>
                        {isGroupExpanded &&
                          subgroups.map((subgroup, subgroupIndex) => {
                            if (!subgroup._id || !group._id) return null;
                            const categories = getCategoriesForSubgroup(
                              subgroup._id
                            );
                            const isSubgroupExpanded =
                              expandedState[group._id]?.subgroups?.[
                                subgroup._id
                              ];

                            return (
                              <React.Fragment key={subgroup._id}>
                                {/* SUBGROUP ROW */}
                                <MotionTr
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -10 }}
                                  transition={{
                                    duration: 0.2,
                                    delay: subgroupIndex * 0.05,
                                  }}
                                  bg={
                                    isSubgroupExpanded
                                      ? useColorModeValue(
                                          "purple.25",
                                          "purple.900"
                                        )
                                      : useColorModeValue("gray.25", "gray.800")
                                  }
                                  _hover={{
                                    bg: useColorModeValue(
                                      "purple.50",
                                      "purple.800"
                                    ),
                                  }}
                                  borderLeftWidth={4}
                                  borderLeftColor={`${typeColors.subgroup}.400`}
                                >
                                  <Td textAlign="center" py={3}>
                                    <Box pl={4}>
                                      <IconButton
                                        aria-label={
                                          isSubgroupExpanded
                                            ? "Colapsar subgrupo"
                                            : "Expandir subgrupo"
                                        }
                                        icon={
                                          isSubgroupExpanded ? (
                                            <ChevronDownIcon />
                                          ) : (
                                            <ChevronRightIcon />
                                          )
                                        }
                                        size="xs"
                                        variant="ghost"
                                        colorScheme="purple"
                                        onClick={() =>
                                          group._id &&
                                          subgroup._id &&
                                          toggleSubgroupExpansion(
                                            group._id,
                                            subgroup._id
                                          )
                                        }
                                        isDisabled={categories.length === 0}
                                        opacity={
                                          categories.length === 0 ? 0.3 : 1
                                        }
                                      />
                                    </Box>
                                  </Td>

                                  <Td>
                                    <HStack spacing={3} pl={8}>
                                      <Badge
                                        colorScheme="purple"
                                        variant="subtle"
                                        px={2}
                                        py={1}
                                        borderRadius="md"
                                      >
                                        Subgrupo
                                      </Badge>
                                      <Text fontWeight="medium" fontSize="sm">
                                        {subgroup.name}
                                      </Text>
                                      {categories.length > 0 && (
                                        <Badge
                                          size="sm"
                                          colorScheme="gray"
                                          variant="outline"
                                        >
                                          {categories.length} categorias
                                        </Badge>
                                      )}
                                    </HStack>
                                  </Td>

                                  <Td textAlign="center">
                                    <Badge
                                      colorScheme="purple"
                                      variant="solid"
                                      borderRadius="full"
                                      size="sm"
                                    >
                                      Subgrupo
                                    </Badge>
                                  </Td>

                                  <Td textAlign="center">
                                    <HStack spacing={1} justify="center">
                                      {/* Add Category Button */}
                                      <EnhancedDrawer
                                        title="Criar Categoria"
                                        color="teal"
                                        onAction={handleCreate}
                                        isLoading={loadingStates.creating}
                                        buttonText="Criar Categoria"
                                      >
                                        <VStack spacing={4} align="stretch">
                                          <Text
                                            fontSize="md"
                                            fontWeight="semibold"
                                            color="teal.600"
                                          >
                                            Nova Categoria
                                          </Text>
                                          <VStack spacing={2} align="stretch">
                                            <Box
                                              bg="blue.50"
                                              p={2}
                                              borderRadius="md"
                                              border="1px solid"
                                              borderColor="blue.200"
                                            >
                                              <Text
                                                fontSize="xs"
                                                color="blue.700"
                                              >
                                                <strong>Grupo:</strong>{" "}
                                                {group.name}
                                              </Text>
                                            </Box>
                                            <Box
                                              bg="purple.50"
                                              p={2}
                                              borderRadius="md"
                                              border="1px solid"
                                              borderColor="purple.200"
                                            >
                                              <Text
                                                fontSize="xs"
                                                color="purple.700"
                                              >
                                                <strong>Subgrupo:</strong>{" "}
                                                {subgroup.name}
                                              </Text>
                                            </Box>
                                          </VStack>
                                          <Box>
                                            <Text
                                              fontSize="sm"
                                              fontWeight="medium"
                                              mb={2}
                                            >
                                              Nome da Categoria *
                                            </Text>
                                            <Input
                                              type="text"
                                              value={formData.name}
                                              onChange={(e) =>
                                                setFormData((prev) => ({
                                                  ...prev,
                                                  name: e.target.value,
                                                  itemType: "category",
                                                  contextSubgroupId:
                                                    subgroup._id || "",
                                                  contextGroupId:
                                                    group._id || "",
                                                }))
                                              }
                                              placeholder="Ex: Venda de Software"
                                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            />
                                          </Box>
                                        </VStack>
                                      </EnhancedDrawer>

                                      <Tooltip label="Editar subgrupo" hasArrow>
                                        <IconButton
                                          aria-label="Editar subgrupo"
                                          icon={<EditIcon />}
                                          size="xs"
                                          colorScheme="purple"
                                          variant="ghost"
                                          onClick={() =>
                                            handleEdit(subgroup, "subgroup")
                                          }
                                        />
                                      </Tooltip>

                                      <Tooltip
                                        label="Excluir subgrupo"
                                        hasArrow
                                      >
                                        <IconButton
                                          aria-label="Excluir subgrupo"
                                          icon={<DeleteIcon />}
                                          size="xs"
                                          colorScheme="red"
                                          variant="ghost"
                                          onClick={() =>
                                            handleDelete(subgroup, "subgroup")
                                          }
                                        />
                                      </Tooltip>
                                    </HStack>
                                  </Td>
                                </MotionTr>

                                {/* CATEGORIES */}
                                <AnimatePresence>
                                  {isSubgroupExpanded &&
                                    categories.map(
                                      (category, categoryIndex) => {
                                        if (!category._id) return null;
                                        return (
                                          <MotionTr
                                            key={category._id}
                                            initial={{ opacity: 0, x: -5 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -5 }}
                                            transition={{
                                              duration: 0.15,
                                              delay: categoryIndex * 0.03,
                                            }}
                                            bg={useColorModeValue(
                                              "teal.25",
                                              "teal.900"
                                            )}
                                            _hover={{
                                              bg: useColorModeValue(
                                                "teal.50",
                                                "teal.800"
                                              ),
                                            }}
                                            borderLeftWidth={4}
                                            borderLeftColor={`${typeColors.category}.400`}
                                          >
                                            <Td textAlign="center" py={2}>
                                              <Box pl={8}>
                                                <Box
                                                  w={2}
                                                  h={2}
                                                  bg="teal.400"
                                                  borderRadius="full"
                                                />
                                              </Box>
                                            </Td>

                                            <Td>
                                              <HStack spacing={3} pl={12}>
                                                <Badge
                                                  colorScheme="teal"
                                                  variant="subtle"
                                                  px={2}
                                                  py={1}
                                                  borderRadius="md"
                                                  size="sm"
                                                >
                                                  Categoria
                                                </Badge>
                                                <Text
                                                  fontWeight="medium"
                                                  fontSize="sm"
                                                >
                                                  {category.name}
                                                </Text>
                                              </HStack>
                                            </Td>

                                            <Td textAlign="center">
                                              <Badge
                                                colorScheme="teal"
                                                variant="solid"
                                                borderRadius="full"
                                                size="sm"
                                              >
                                                Categoria
                                              </Badge>
                                            </Td>

                                            <Td textAlign="center">
                                              <HStack
                                                spacing={1}
                                                justify="center"
                                              >
                                                <Tooltip
                                                  label="Editar categoria"
                                                  hasArrow
                                                >
                                                  <IconButton
                                                    aria-label="Editar categoria"
                                                    icon={<EditIcon />}
                                                    size="xs"
                                                    colorScheme="teal"
                                                    variant="ghost"
                                                    onClick={() =>
                                                      handleEdit(
                                                        category,
                                                        "category"
                                                      )
                                                    }
                                                  />
                                                </Tooltip>

                                                <Tooltip
                                                  label="Excluir categoria"
                                                  hasArrow
                                                >
                                                  <IconButton
                                                    aria-label="Excluir categoria"
                                                    icon={<DeleteIcon />}
                                                    size="xs"
                                                    colorScheme="red"
                                                    variant="ghost"
                                                    onClick={() =>
                                                      handleDelete(
                                                        category,
                                                        "category"
                                                      )
                                                    }
                                                  />
                                                </Tooltip>
                                              </HStack>
                                            </Td>
                                          </MotionTr>
                                        );
                                      }
                                    )}
                                </AnimatePresence>
                              </React.Fragment>
                            );
                          })}
                      </AnimatePresence>
                    </React.Fragment>
                  );
                })}
              </AnimatePresence>
            </Tbody>
          </Table>
        </Box>
      </MotionBox>

      {/* Edit Modal */}
      <EditModal
        isOpen={isEditOpen}
        onClose={() => {
          onEditClose();
          setEditingItem(null);
          setFormData({
            name: "",
            contextGroupId: "",
            contextSubgroupId: "",
            itemType: "group",
          });
        }}
        title={`Editar ${editingItem?.type || "Item"}`}
        onSave={handleUpdate}
        isLoading={loadingStates.updating}
        color={
          editingItem?.type
            ? typeColors[editingItem.type as keyof typeof typeColors]
            : "blue"
        }
      >
        <VStack spacing={4} align="stretch">
          <Box>
            <Text fontSize="sm" fontWeight="medium" mb={2}>
              Nome do {editingItem?.type} *
            </Text>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder={`Nome do ${editingItem?.type}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </Box>
        </VStack>
      </EditModal>

      {/* Delete Alert */}
      <DeleteAlert
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={confirmDelete}
        itemName={deletingItem?.name || ""}
        itemType={deletingItem?.type || "item"}
        isLoading={loadingStates.deleting}
        cancelRef={cancelRef}
      />
    </>
  );
};
