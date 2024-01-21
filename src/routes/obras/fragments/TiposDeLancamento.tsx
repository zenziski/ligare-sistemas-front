import { Flex, Text } from "@chakra-ui/layout";
import DrawerComponent from "../../../components/Drawer";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/input";
import { DeleteIcon, EditIcon, SearchIcon } from "@chakra-ui/icons";
import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import { IconButton } from "@chakra-ui/button";

const TiposDeLancamento = () => {
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
                    headerText="Teste"
                    buttonText="Teste"
                    buttonIcon={<Text>Teste</Text>}
                    buttonColorScheme="teal"
                    isButton
                >
                    <Text>
                        Teste
                    </Text>
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
                    <Input type="text" placeholder="Pesquisar..." />
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
                        <Tr>
                            <Td>
                                <Text>Teste</Text>
                            </Td>
                            <Td>
                                <Flex
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <Text>Teste</Text>
                                    <Flex>
                                        <IconButton bg="transparent" aria-label="Abrir" icon={<EditIcon />} />
                                        <IconButton bg="transparent" aria-label="Abrir" icon={<DeleteIcon />} />
                                    </Flex>
                                </Flex>
                            </Td>
                        </Tr>
                    </Tbody>
                </Table>
            </TableContainer>
        </Flex>
    )
}

export default TiposDeLancamento;