import { AbsoluteCenter, Box, Button, Divider, Flex, FormControl, FormLabel, Grid, Input, InputGroup, InputLeftElement, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react"
import Sidebar from "../../components/Sidebar"
import DrawerComponent from "../../components/Drawer"
import { AddIcon, EditIcon, SearchIcon } from "@chakra-ui/icons"
import InputMask from "react-input-mask"

const Obras = () => {

    const EditButton = (props: any) => {
        //TODO: TIPAR ESSA PORRA
        return (
            <DrawerComponent
                buttonIcon={<EditIcon />}
                headerText="Editar Obra"
                buttonColorScheme="blue"
                size="md"
            >
                oi
            </DrawerComponent>
        )
    }

    const renderInput = (inputProps: any): React.ReactNode => (
        <Input {...inputProps} placeholder="Digite..." />
    );

    return (
        <Sidebar>
            <Flex w="100%" h="100%" p={10} direction="column" fontFamily="Poppins-Regular">
                <Flex direction={'row'} mb={'15px'} justifyContent={'space-between'}>
                    <Text fontSize="4xl">
                        Obras
                    </Text>
                    <DrawerComponent
                        buttonIcon={<AddIcon />}
                        buttonText="Adicionar"
                        headerText="Adicionar obra"
                        buttonColorScheme="green"
                        size="md"
                        isButton
                    >
                        <Grid templateColumns="repeat(2, 1fr)" gap={6} fontFamily="Poppins-Regular">
                            <FormControl gridColumn="span 2">
                                <FormLabel>Nome da Obra</FormLabel>
                                <Input placeholder="Digite..." />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Endereço da Obra</FormLabel>
                                <Input placeholder="Digite..." />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Endereço de Cobrança</FormLabel>
                                <Input placeholder="Digite..." />
                            </FormControl>
                            <Box position='relative' gridColumn="span 2" >
                                <Divider
                                    borderColor={'gray.500'}
                                />
                                <AbsoluteCenter bg='white' px='4'>
                                    Administração
                                </AbsoluteCenter>
                            </Box>
                            <FormControl gridColumn="span 2">
                                <FormLabel>Contrato</FormLabel>
                                <InputGroup>
                                    <InputMask mask="R$ 999.999.999,99" maskChar={null}>
                                        {renderInput}
                                    </InputMask>
                                </InputGroup>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Parcelas</FormLabel>
                                <Input type="number" placeholder="Digite..." />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Valor Mensal</FormLabel>
                                <Input placeholder="Digite..." />
                            </FormControl>
                            <Box position='relative' gridColumn="span 2" >
                                <Divider
                                    borderColor={'gray.500'}
                                />
                                <AbsoluteCenter bg='white' px='4'>
                                    Empreitada
                                </AbsoluteCenter>
                            </Box>
                            <FormControl gridColumn="span 2">
                                <FormLabel>Contrato</FormLabel>
                                <Input placeholder="Digite..." />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Parcelas</FormLabel>
                                <Input type="number" placeholder="Digite..." />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Valor Mensal</FormLabel>
                                <Input placeholder="Digite..." />
                            </FormControl>
                            <Divider gridColumn="span 2" borderColor={'gray.500'} />
                            <FormControl>
                                <FormLabel>Extras (mão de obra)</FormLabel>
                                <Input type="number" placeholder="Digite..." />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Extra (adm)</FormLabel>
                                <Input placeholder="Digite..." />
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
                        <Input type="text" placeholder="Pesquisar..." />
                    </InputGroup>
                </Flex>
                <TableContainer>
                    <Table variant={'striped'}>
                        <Thead>
                            <Tr>
                                <Th>Nome da Obra</Th>
                                <Th>Endereço da Obra</Th>
                                <Th>Endereço de Cobrança</Th>
                                <Th>Contrato - Administração</Th>
                                <Th>Parcelas</Th>
                                <Th>Valor Mensal</Th>
                                <Th>{' '}</Th>
                                <Th>{' '}</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            <Tr>
                                <Td>Obra do Matheus</Td>
                                <Td>Rua XXX</Td>
                                <Td>Rua tal asdkjasd </Td>
                                <Td> </Td>
                                <Td> </Td>
                                <Td> </Td>
                                <Td><EditButton /></Td>
                                <Td>
                                    <Button>
                                        Detalhes
                                    </Button>
                                </Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </TableContainer>
            </Flex>
        </Sidebar>
    )
}

export default Obras