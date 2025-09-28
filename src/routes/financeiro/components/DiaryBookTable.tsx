import React, { useState, useMemo } from "react";
import {
  Table,
  TableContainer,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Badge,
  IconButton,
  HStack,
  Skeleton,
  Flex,
  Select,
  Box,
  Grid,
  GridItem,
  Button,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, TriangleUpIcon, TriangleDownIcon } from "@chakra-ui/icons";
import { IDiaryBook } from "../../../stores/financeiro/financeiro.interface";
import ModalDelete from "../../../components/ModalDelete";
import Helpers from "../../../utils/helper";
import {
  createNameResolvers,
  getTypeColorScheme,
} from "../utils/diaryBookHelpers";
import { IGetAccountPlanService } from "../../../stores/financeiro/financeiro.interface";
import { IUser } from "../../../stores/usuarios/interface";
import { IObrasTable } from "../../../stores/obras/interface";

interface DiaryBookTableProps {
  diaryBooks: IDiaryBook[];
  loading: boolean;
  searchTerm: string;
  accountPlanData: IGetAccountPlanService;
  users: IUser[];
  constructions: IObrasTable[];
  onEdit: (diaryBook: IDiaryBook) => void;
  onDelete: (id: string) => void;
}

export const DiaryBookTable: React.FC<DiaryBookTableProps> = ({
  diaryBooks,
  loading,
  searchTerm,
  accountPlanData,
  users,
  constructions,
  onEdit,
  onDelete,
}) => {
  // Estados para filtros e ordenação
  const [filters, setFilters] = useState({
    tipo: '',
    grupo: '',
    subgrupo: '',
    categoria: '',
    funcionario: '',
    obra: '',
    contaBancaria: '',
  });
  
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Criar resolvers de nomes
  const nameResolvers = createNameResolvers(
    accountPlanData,
    users,
    constructions
  );

  // Componente para marcador de empreiteiro
  const ContractorBadge: React.FC<{ isContractor: boolean }> = ({
    isContractor,
  }) => {
    if (!isContractor) return null;

    return (
      <Flex align="center" gap={1} mt={1}>
        <Badge
          colorScheme="gray"
          variant="subtle"
          size="sm"
          fontSize="xs"
          px={1}
          py={0.5}
          borderRadius="md"
        >
          Empreiteiro
        </Badge>
      </Flex>
    );
  };

  // Função para ordenação
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Função para limpar filtros
  const clearFilters = () => {
    setFilters({
      tipo: '',
      grupo: '',
      subgrupo: '',
      categoria: '',
      funcionario: '',
      obra: '',
      contaBancaria: '',
    });
  };

  // Função para obter valor para ordenação
  const getSortValue = (book: any, key: string) => {
    const getFieldValue = (field: any) => field && field.name ? field.name : field;
    
    switch (key) {
      case 'data':
        return new Date(book.date).getTime();
      case 'tipo':
        return book.type || '';
      case 'grupo':
        return getFieldValue(book.group) || '';
      case 'subgrupo':
        return getFieldValue(book.subgroup) || '';
      case 'categoria':
        return getFieldValue(book.category) || '';
      case 'funcionario':
        return getFieldValue(book.employee) || '';
      case 'obra':
        return getFieldValue(book.construction) || '';
      case 'contaBancaria':
        return book.bankAccount || '';
      case 'valor':
        return Number(book.value) || 0;
      case 'saldo':
        return Number(book.balance) || 0;
      default:
        return '';
    }
  };

  // Extrair opções únicas para os selects
  const filterOptions = useMemo(() => {
    const tipos = [...new Set(diaryBooks.map(book => book.type).filter(Boolean))];
    const grupos = [...new Set(diaryBooks.map(book => {
      const group = book.group as any;
      return group && group.name ? group.name : group;
    }).filter(Boolean))];
    const subgrupos = [...new Set(diaryBooks.map(book => {
      const subgroup = book.subgroup as any;
      return subgroup && subgroup.name ? subgroup.name : subgroup;
    }).filter(Boolean))];
    const categorias = [...new Set(diaryBooks.map(book => {
      const category = book.category as any;
      return category && category.name ? category.name : category;
    }).filter(Boolean))];
    const funcionarios = [...new Set(diaryBooks.map(book => {
      const employee = book.employee as any;
      return employee && employee.name ? employee.name : employee;
    }).filter(Boolean))];
    const obras = [...new Set(diaryBooks.map(book => {
      const construction = book.construction as any;
      return construction && construction.name ? construction.name : construction;
    }).filter(Boolean))];
    const contas = [...new Set(diaryBooks.map(book => book.bankAccount).filter(Boolean))];

    return {
      tipos: tipos.sort(),
      grupos: grupos.sort(),
      subgrupos: subgrupos.sort(),
      categorias: categorias.sort(),
      funcionarios: funcionarios.sort(),
      obras: obras.sort(),
      contas: contas.sort()
    };
  }, [diaryBooks]);

  // Filtrar e ordenar dados
  const processedDiaryBooks = useMemo(() => {
    let filtered = diaryBooks.filter((book) => {
      // Filtro geral por searchTerm
      const matchesSearch = 
        book.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nameResolvers
          .getGroupName(book.group)
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        nameResolvers
          .getSubgroupName(book.subgroup)
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (book.category &&
          nameResolvers
            .getCategoryName(book.category)
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (book.employee &&
          nameResolvers
            .getUserName(book.employee)
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (book.construction &&
          nameResolvers
            .getConstructionName(book.construction)
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        book.observation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.bankAccount?.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtros específicos por coluna
      const getFieldValue = (field: any) => field && field.name ? field.name : field;
      
      const matchesFilters = 
        (!filters.tipo || book.type === filters.tipo) &&
        (!filters.grupo || getFieldValue(book.group) === filters.grupo) &&
        (!filters.subgrupo || getFieldValue(book.subgroup) === filters.subgrupo) &&
        (!filters.categoria || getFieldValue(book.category) === filters.categoria) &&
        (!filters.funcionario || getFieldValue(book.employee) === filters.funcionario) &&
        (!filters.obra || getFieldValue(book.construction) === filters.obra) &&
        (!filters.contaBancaria || book.bankAccount === filters.contaBancaria);

      return matchesSearch && matchesFilters;
    });

    // Aplicar ordenação
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = getSortValue(a, sortConfig.key);
        const bValue = getSortValue(b, sortConfig.key);
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [diaryBooks, searchTerm, filters, sortConfig, nameResolvers]);

  // Componente para cabeçalho ordenável
  const SortableHeader: React.FC<{ 
    children: React.ReactNode; 
    sortKey: string; 
    width?: string;
  }> = ({ children, sortKey, width }) => {
    const isActive = sortConfig?.key === sortKey;
    const isDesc = isActive && sortConfig.direction === 'desc';
    
    return (
      <Th 
        cursor="pointer" 
        onClick={() => handleSort(sortKey)}
        _hover={{ bg: "gray.100" }}
        width={width}
      >
        <Flex align="center" gap={1}>
          {children}
          <Box>
            <TriangleUpIcon 
              boxSize={2} 
              color={isActive && !isDesc ? "blue.500" : "gray.300"} 
            />
            <TriangleDownIcon 
              boxSize={2} 
              color={isActive && isDesc ? "blue.500" : "gray.300"} 
              mt={-1}
            />
          </Box>
        </Flex>
      </Th>
    );
  };

  return (
    <Box>
      {/* Filtros */}
      <Box mb={4} p={4} bg="gray.50" borderRadius="md">
        <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={3} mb={3}>
          <GridItem>
            <Text fontSize="sm" mb={1} fontWeight="medium">Tipo</Text>
            <Select
              size="sm"
              placeholder="Todos os tipos"
              value={filters.tipo}
              onChange={(e) => setFilters({...filters, tipo: e.target.value})}
            >
              {filterOptions.tipos.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </Select>
          </GridItem>
          
          <GridItem>
            <Text fontSize="sm" mb={1} fontWeight="medium">Grupo</Text>
            <Select
              size="sm"
              placeholder="Todos os grupos"
              value={filters.grupo}
              onChange={(e) => setFilters({...filters, grupo: e.target.value})}
            >
              {filterOptions.grupos.map(grupo => (
                <option key={grupo} value={grupo}>{grupo}</option>
              ))}
            </Select>
          </GridItem>
          
          <GridItem>
            <Text fontSize="sm" mb={1} fontWeight="medium">Subgrupo</Text>
            <Select
              size="sm"
              placeholder="Todos os subgrupos"
              value={filters.subgrupo}
              onChange={(e) => setFilters({...filters, subgrupo: e.target.value})}
            >
              {filterOptions.subgrupos.map(subgrupo => (
                <option key={subgrupo} value={subgrupo}>{subgrupo}</option>
              ))}
            </Select>
          </GridItem>
          
          <GridItem>
            <Text fontSize="sm" mb={1} fontWeight="medium">Categoria</Text>
            <Select
              size="sm"
              placeholder="Todas as categorias"
              value={filters.categoria}
              onChange={(e) => setFilters({...filters, categoria: e.target.value})}
            >
              {filterOptions.categorias.map(categoria => (
                <option key={categoria} value={categoria}>{categoria}</option>
              ))}
            </Select>
          </GridItem>
          
          <GridItem>
            <Text fontSize="sm" mb={1} fontWeight="medium">Funcionário</Text>
            <Select
              size="sm"
              placeholder="Todos os funcionários"
              value={filters.funcionario}
              onChange={(e) => setFilters({...filters, funcionario: e.target.value})}
            >
              {filterOptions.funcionarios.map(funcionario => (
                <option key={funcionario} value={funcionario}>{funcionario}</option>
              ))}
            </Select>
          </GridItem>
          
          <GridItem>
            <Text fontSize="sm" mb={1} fontWeight="medium">Obra</Text>
            <Select
              size="sm"
              placeholder="Todas as obras"
              value={filters.obra}
              onChange={(e) => setFilters({...filters, obra: e.target.value})}
            >
              {filterOptions.obras.map(obra => (
                <option key={obra} value={obra}>{obra}</option>
              ))}
            </Select>
          </GridItem>
          
          <GridItem>
            <Text fontSize="sm" mb={1} fontWeight="medium">Conta Bancária</Text>
            <Select
              size="sm"
              placeholder="Todas as contas"
              value={filters.contaBancaria}
              onChange={(e) => setFilters({...filters, contaBancaria: e.target.value})}
            >
              {filterOptions.contas.map(conta => (
                <option key={conta} value={conta}>{conta}</option>
              ))}
            </Select>
          </GridItem>
        </Grid>
        
        <Button size="sm" variant="outline" onClick={clearFilters}>
          Limpar Filtros
        </Button>
      </Box>

      <TableContainer>
        <Table
          variant="simple"
          size="md"
          sx={{
            th: { bg: "gray.50", fontSize: "sm", py: 3 },
            td: { py: 3, fontSize: "sm" },
          }}
        >
          <Thead>
            <Tr>
              <SortableHeader sortKey="data">Data</SortableHeader>
              <SortableHeader sortKey="tipo">Tipo</SortableHeader>
              <SortableHeader sortKey="grupo">Grupo</SortableHeader>
              <SortableHeader sortKey="subgrupo">Subgrupo</SortableHeader>
              <SortableHeader sortKey="categoria">Categoria</SortableHeader>
              <SortableHeader sortKey="funcionario">Funcionário</SortableHeader>
              <SortableHeader sortKey="obra">Obra</SortableHeader>
              <SortableHeader sortKey="contaBancaria">Conta Bancária</SortableHeader>
              <SortableHeader sortKey="valor">Valor</SortableHeader>
              <SortableHeader sortKey="saldo">Saldo</SortableHeader>
              <Th width="140px">Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loading ? (
              // Skeleton loading
              [...Array(5)].map((_, i) => (
                <Tr key={i}>
                  {[...Array(11)].map((_, j) => (
                    <Td key={j}>
                      <Skeleton height="20px" />
                    </Td>
                  ))}
                </Tr>
              ))
            ) : processedDiaryBooks.length > 0 ? (
              processedDiaryBooks.map((book: any) => (
                <Tr
                  key={book._id}
                  _hover={{
                    bg: "gray.50",
                    boxShadow: "sm",
                  }}
                >
                  <Td>
                    <Text fontWeight="medium">
                      {Helpers.toViewDate(book.date?.toString() || "")}
                    </Text>
                  </Td>

                  <Td>
                    <Badge
                      colorScheme={getTypeColorScheme(book.type)}
                      variant="subtle"
                    >
                      {String(book.type || "")}
                    </Badge>
                  </Td>

                  <Td>
                    <Text>{book.group ? book.group.name : "-"}</Text>
                  </Td>

                  <Td>
                    <Flex direction="column">
                      <Text>{book.subgroup ? book.subgroup.name : "-"}</Text>
                      <ContractorBadge isContractor={book.subgroup?.contractor} />
                    </Flex>
                  </Td>

                  <Td>
                    <Text color="gray.600">
                      {book.category ? book.category?.name : "-"}
                    </Text>
                  </Td>

                  <Td>
                    <Text color="gray.600">
                      {book.employee ? book.employee?.name : "-"}
                    </Text>
                  </Td>

                  <Td>
                    <Text color="gray.600">
                      {book.construction ? book.construction?.name : "-"}
                    </Text>
                  </Td>

                  <Td>
                    <Text>{String(book.bankAccount || "")}</Text>
                  </Td>

                  <Td>
                    <Text
                      fontWeight="bold"
                      color={`${getTypeColorScheme(book.type)}.600`}
                    >
                      {Helpers.toBrazilianCurrency(book.value)}
                    </Text>
                  </Td>

                  <Td>
                    <Text fontWeight="medium" color="blue.600">
                      {Helpers.toBrazilianCurrency(book.balance)}
                    </Text>
                  </Td>

                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        aria-label="Editar entrada"
                        icon={<EditIcon />}
                        size="sm"
                        colorScheme="blue"
                        variant="ghost"
                        onClick={() => onEdit(book)}
                      />
                      <ModalDelete
                        headerText="Confirmar Exclusão"
                        onDelete={() => onDelete(book._id!)}
                        buttonIcon={<DeleteIcon />}
                      >
                        Tem certeza que deseja excluir esta entrada?
                      </ModalDelete>
                    </HStack>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={11} textAlign="center" py={8}>
                  <Text color="gray.500" fontSize="lg">
                    {searchTerm || Object.values(filters).some(f => f !== '')
                      ? "Nenhuma entrada encontrada para sua busca"
                      : "Nenhuma entrada cadastrada ainda"}
                  </Text>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
