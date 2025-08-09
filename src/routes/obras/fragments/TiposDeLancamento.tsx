import { 
    Flex, 
    Text, 
    Card, 
    CardBody, 
    CardHeader, 
    VStack, 
    HStack, 
    Button 
} from "@chakra-ui/react";
import DrawerComponent from "../../../components/Drawer";
import { Input, InputGroup, InputLeftElement, InputRightElement } from "@chakra-ui/input";
import { AddIcon, CloseIcon, DeleteIcon, EditIcon, SearchIcon } from "@chakra-ui/icons";
import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import { IconButton } from "@chakra-ui/button";
import { useToast } from "@chakra-ui/toast";
import { useForm } from "react-hook-form";
import { ITiposLancamento, tiposLancamentoSchema } from "../../../stores/obras/interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { createTipoLancamento, getAllTipoLancamento, updateTipoLancamento, removeTipoLancamento } from "../../../stores/obras/service";
import Helpers from "../../../utils/helper";
import ModalDelete from "../../../components/ModalDelete";

const TiposDeLancamento = () => {

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue
    } = useForm<ITiposLancamento>({
        shouldFocusError: true,
        resolver: zodResolver(tiposLancamentoSchema),
    })

    const toast = useToast();
    const [tiposLancamento, setTiposLancamento] = useState<ITiposLancamento[]>([]);
    const [tipoLancamento, setTipoLancamento] = useState<ITiposLancamento>({} as ITiposLancamento);
    const [filter, setFilter] = useState<string>('');

    const handleCreate = async (data: ITiposLancamento) => {
        try {
            const response = await createTipoLancamento(data);
            setTiposLancamento([...tiposLancamento, response]);
            reset();
            toast({
                title: "Tipo de lançamento criado",
                description: "Tipo de lançamento criado com sucesso!",
                status: "success",
                duration: 5000,
                isClosable: true,
            })
        } catch (error) {
            console.log(error);
            toast({
                title: "Erro ao criar tipo de lançamento",
                description: "Erro ao criar tipo de lançamento!",
                status: "error",
                duration: 5000,
                isClosable: true,
            })
        }
    }

    const handleUpdate = async (data: ITiposLancamento) => {
        try {
            const response = await updateTipoLancamento(data);
            setTiposLancamento(tiposLancamento.map((tipo) => tipo._id === response._id ? response : tipo));
            reset();
            toast({
                title: "Tipo de lançamento editado",
                description: "Tipo de lançamento editado com sucesso!",
                status: "success",
                duration: 5000,
                isClosable: true,
            })
        } catch (error) {
            console.log(error);
            toast({
                title: "Erro ao editar tipo de lançamento",
                description: "Erro ao editar tipo de lançamento!",
                status: "error",
                duration: 5000,
                isClosable: true,
            })
        }
    }

    const handleDelete = async (tipoLancamento: ITiposLancamento) => {
        try {
            await removeTipoLancamento(tipoLancamento._id!);
            setTiposLancamento(tiposLancamento.filter((tipo) => tipo._id !== tipoLancamento._id));
            toast({
                title: "Tipo de lançamento deletado",
                description: "Tipo de lançamento deletado com sucesso!",
                status: "success",
                duration: 5000,
                isClosable: true,
            })
        } catch (error) {
            console.log(error);
            toast({
                title: "Erro ao deletar tipo de lançamento",
                description: "Erro ao deletar tipo de lançamento!",
                status: "error",
                duration: 5000,
                isClosable: true,
            })
        }
    }

    useEffect(() => {
        setValue('name', tipoLancamento.name)
        setValue('_id', tipoLancamento._id)
    }, [tipoLancamento, setValue])

    useEffect(() => {
        const getTiposLancamento = async () => {
            const response = await getAllTipoLancamento();
            setTiposLancamento(response);
        }
        getTiposLancamento();
    }, [])

    return (
        <VStack spacing={6} align="stretch">
            <Card>
                <CardHeader>
                    <Flex justify="space-between" align="center">
                        <VStack align="start" spacing={1}>
                            <Text fontSize="xl" fontWeight="bold">
                                Tipos de Lançamento
                            </Text>
                            <Text color="gray.600" fontSize="sm">
                                Gerencie os tipos de lançamento disponíveis para as obras
                            </Text>
                        </VStack>
                        
                        <DrawerComponent
                            headerText="Novo Tipo de Lançamento"
                            buttonText="Novo Tipo"
                            buttonIcon={<AddIcon />}
                            buttonColorScheme="green"
                            isButton
                            onAction={handleSubmit(handleCreate)}
                            isLoading={isSubmitting}
                            onOpenHook={() => {
                                reset();
                            }}
                        >
                            <FormControl>
                                <FormLabel fontWeight="medium">Nome do Tipo de Lançamento</FormLabel>
                                <Input
                                    placeholder="Ex: Material, Mão de obra, Equipamento..."
                                    {...register("name")}
                                />
                                {errors.name && <Text color="red.500" fontSize="sm">{errors.name.message}</Text>}
                            </FormControl>
                        </DrawerComponent>
                    </Flex>
                </CardHeader>
                
                <CardBody>
                    <VStack spacing={4} align="stretch">
                        {/* Barra de busca */}
                        <InputGroup maxW="400px">
                            <InputLeftElement pointerEvents="none">
                                <SearchIcon color="gray.400" />
                            </InputLeftElement>
                            <Input
                                type="text"
                                placeholder="Buscar tipos de lançamento..."
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                bg="white"
                                border="1px"
                                borderColor="gray.200"
                                _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px blue.400" }}
                            />
                            {filter !== '' && (
                                <InputRightElement>
                                    <IconButton 
                                        onClick={() => setFilter('')} 
                                        bg="transparent" 
                                        aria-label="Limpar busca" 
                                        icon={<CloseIcon />} 
                                        size="sm"
                                    />
                                </InputRightElement>
                            )}
                        </InputGroup>

                        {/* Tabela */}
                        <TableContainer>
                            <Table variant="simple">
                                <Thead>
                                    <Tr>
                                        <Th>Nome do Tipo</Th>
                                        <Th>Data de Cadastro</Th>
                                        <Th width="120px">Ações</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {tiposLancamento
                                        .filter(tipo => tipo.name.toLowerCase().includes(filter.toLowerCase()))
                                        .map((tipo) => (
                                        <Tr key={tipo._id}>
                                            <Td fontWeight="medium">{tipo.name}</Td>
                                            <Td color="gray.600">
                                                {Helpers.toViewDate(tipo?.createdAt ?? '')}
                                            </Td>
                                            <Td>
                                                <HStack spacing={2}>
                                                    <DrawerComponent
                                                        headerText="Editar Tipo de Lançamento"
                                                        buttonText=""
                                                        buttonIcon={<EditIcon />}
                                                        buttonColorScheme="blue"
                                                        onAction={handleSubmit(handleUpdate)}
                                                        isLoading={isSubmitting}
                                                        onOpenHook={() => {
                                                            setTipoLancamento(tipo);
                                                        }}
                                                    >
                                                        <FormControl>
                                                            <FormLabel fontWeight="medium">Nome do Tipo de Lançamento</FormLabel>
                                                            <Input
                                                                placeholder="Nome do tipo de lançamento"
                                                                {...register("name")}
                                                            />
                                                            {errors.name && <Text color="red.500" fontSize="sm">{errors.name.message}</Text>}
                                                        </FormControl>
                                                    </DrawerComponent>
                                                    
                                                    <ModalDelete
                                                        onDelete={() => {
                                                            handleDelete(tipo);
                                                        }}
                                                        headerText="Excluir Tipo de Lançamento"
                                                        buttonIcon={<DeleteIcon />}
                                                        buttonColorScheme="red"
                                                    >
                                                        <Text>Você tem certeza que deseja excluir o tipo de lançamento <strong>{tipo.name}</strong>?</Text>
                                                        <Text fontSize="sm" color="gray.600" mt={2}>
                                                            Esta ação não pode ser desfeita.
                                                        </Text>
                                                    </ModalDelete>
                                                </HStack>
                                            </Td>
                                        </Tr>
                                    ))}
                                    
                                    {tiposLancamento.filter(tipo => tipo.name.toLowerCase().includes(filter.toLowerCase())).length === 0 && (
                                        <Tr>
                                            <Td colSpan={3} textAlign="center" py={8}>
                                                <Text color="gray.500">
                                                    {filter ? 'Nenhum tipo de lançamento encontrado.' : 'Nenhum tipo de lançamento cadastrado ainda.'}
                                                </Text>
                                            </Td>
                                        </Tr>
                                    )}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </VStack>
                </CardBody>
            </Card>
        </VStack>
    )
}

export default TiposDeLancamento;