import { Flex, Grid, Text } from "@chakra-ui/layout";
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
            toast({
                title: "Sucesso!",
                description: "Tipo de lançamento criado com sucesso!",
                status: "success",
                duration: 9000,
                isClosable: true,
            })
        } catch (error: any) {
            toast({
                title: "Erro!",
                description: error?.response?.data?.message || "Erro ao criar tipo de lançamento!",
                status: "error",
                duration: 9000,
                isClosable: true,
            })
        }
    }

    const handleUpdate = async (data: ITiposLancamento) => {
        try {
            await updateTipoLancamento(data);
            const response = await getAllTipoLancamento();
            setTiposLancamento(response);
            toast({
                title: "Sucesso!",
                description: "Tipo de lançamento atualizado com sucesso!",
                status: "success",
                duration: 9000,
                isClosable: true,
            })
        } catch (error) {
            toast({
                title: "Erro!",
                description: "Erro ao atualizar tipo de lançamento!",
                status: "error",
                duration: 9000,
                isClosable: true,
            })
        }
    }

    const handleDelete = async (data: ITiposLancamento) => {
        try {
            if (data._id) {
                await removeTipoLancamento(data._id);
            }
            setTiposLancamento(tiposLancamento.filter(tipoLancamento => tipoLancamento._id !== data._id));
            toast({
                title: "Sucesso!",
                description: "Tipo de lançamento deletado com sucesso!",
                status: "success",
                duration: 5000,
                isClosable: true,
            })
        } catch (error) {
            toast({
                title: "Erro!",
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
        <Flex
            direction={'column'}
            w={'100%'}
            h={'100%'}
        >
            <Flex
                direction={'row'}
                mb={'15px'}
                justifyContent={'space-between'}
            >
                <Text fontSize="4xl">
                    Tipos de lançamento
                </Text>
                <DrawerComponent
                    headerText="Adicionar"
                    buttonText="Adicionar"
                    buttonIcon={<AddIcon />}
                    buttonColorScheme="green"
                    isButton
                    onAction={handleSubmit(handleCreate)}
                    isLoading={isSubmitting}
                    onOpenHook={() => {
                        reset();
                    }}
                >
                    <Grid
                        templateColumns="repeat(2, 1fr)"
                        gap={6}
                        fontFamily="Poppins-Regular"
                    >
                        <FormControl gridColumn="span 2">
                            <FormLabel>Nome da categoria</FormLabel>
                            <Input
                                placeholder="Digite..."
                                {...register("name")}
                            />
                            {errors.name && <Text color="red">{errors.name.message}</Text>}
                        </FormControl>
                    </Grid>
                </DrawerComponent>
            </Flex>
            <Flex
                w="100%"
                h="50px"
                borderRadius="md"
                bg="white"
                alignItems="center"
                px={4}
                mb={4}
            >
                <InputGroup>
                    <InputLeftElement
                        pointerEvents="none"
                        children={<SearchIcon color="gray.300" />}
                    />
                    <Input
                        type="text"
                        placeholder="Pesquisar..."
                        value={filter}
                        onChange={(e) => {
                            setFilter(e.target.value);
                        }}
                    />
                    <InputRightElement
                        children={filter !== '' && <IconButton onClick={() => setFilter('')} bg="transparent" aria-label="Abrir" icon={<CloseIcon />} />}
                    />
                </InputGroup>
            </Flex>
            <TableContainer>
                <Table>
                    <Thead>
                        <Tr>
                            <Th>Tipo Lançamento</Th>
                            <Th>Data de Cadastro</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            tiposLancamento.filter(tipoLancamento => tipoLancamento.name.toLowerCase().includes(filter.toLowerCase())).map((tipoLancamento) => (
                                <Tr key={tipoLancamento._id}>
                                    <Td>
                                        <Text>{tipoLancamento.name}</Text>
                                    </Td>
                                    <Td>
                                        <Flex
                                            direction="row"
                                            justifyContent="space-between"
                                            alignItems="center"
                                        >
                                            <Text>{Helpers.toViewDate(tipoLancamento?.createdAt ?? '')}</Text>
                                            <Flex>
                                                <DrawerComponent
                                                    headerText="Editar"
                                                    buttonText="Editar"
                                                    buttonIcon={<EditIcon />}
                                                    buttonColorScheme="teal"
                                                    onAction={handleSubmit(handleUpdate)}
                                                    isLoading={isSubmitting}
                                                    onOpenHook={() => {
                                                        setTipoLancamento(tipoLancamento);
                                                    }}
                                                >
                                                    <Grid
                                                        templateColumns="repeat(2, 1fr)"
                                                        gap={6}
                                                        fontFamily="Poppins-Regular"
                                                    >
                                                        <FormControl gridColumn="span 2">
                                                            <FormLabel>Nome da categoria</FormLabel>
                                                            <Input
                                                                placeholder="Digite..."
                                                                {...register("name")}
                                                            />
                                                            {errors.name && <Text color="red">{errors.name.message}</Text>}
                                                        </FormControl>
                                                    </Grid>
                                                </DrawerComponent>
                                                <ModalDelete
                                                    onDelete={() => {
                                                        handleDelete(tipoLancamento);
                                                    }}
                                                    headerText="Deletar tipo de lançamento"
                                                    buttonIcon={<DeleteIcon color={'red'} />}
                                                    buttonColorScheme="red"
                                                >
                                                    <Text>Você tem certeza que deseja deletar o tipo de lançamento {tipoLancamento.name}?</Text>
                                                </ModalDelete>
                                            </Flex>
                                        </Flex>
                                    </Td>
                                </Tr>
                            ))
                        }
                        {
                            tiposLancamento.filter(tipoLancamento => tipoLancamento.name.toLowerCase().includes(filter.toLowerCase())).length === 0 && (
                                <Tr>
                                    <Td colSpan={2}>
                                        <Text>Nenhum tipo de lançamento encontrado :(</Text>
                                    </Td>
                                </Tr>
                            )
                        }
                    </Tbody>
                </Table>
            </TableContainer>
        </Flex>
    )
}

export default TiposDeLancamento;