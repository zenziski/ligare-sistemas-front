import { Button, Divider, Flex, FormControl, FormLabel, Input, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useToast } from "@chakra-ui/react"
import DrawerComponent from "../../../components/Drawer"
import { useEffect, useState } from "react"
import { createMedicao, getAllTipoLancamento } from "../../../stores/obras/service"
import Helpers from "../../../utils/helper"

interface IMedicao {
    data: any
}

const Medicao = ({
    data
}: IMedicao) => {

    console.log(data);

    const toast = useToast()

    const [dataInicial, setDataInicial] = useState<string>('')
    const [dataFinal, setDataFinal] = useState<string>('')
    const [medicoes, setMedicoes] = useState<any[]>(data.measurement || [])
    const [tiposMedicao, setTiposMedicao] = useState<any[]>([])

    useEffect(() => {

        const fetchData = async () => {
            const response = await getAllTipoLancamento()
            setTiposMedicao(response)
        }
        fetchData()
        setMedicoes(data.measurement || [])

    }, [data])

    const handleSubmit = async () => {
        try {

            const response = await createMedicao(data._id, {
                initialDate: dataInicial,
                finalDate: dataFinal
            })

            setMedicoes([...medicoes, response])

        } catch (error) {
            console.log(error);
            toast({
                title: "Erro ao gerar medição",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top-right"
            })
        }
    }

    return (
        <>
            <DrawerComponent
                isButton
                buttonText="Medição"
                headerText="Medição"
                buttonColorScheme="purple"
                size="xl"
                hideFooter={true}
            >
                <Flex
                    as="section"
                    flexDirection="column"
                    gap={4}
                >
                    <Flex
                        as="form"
                        onSubmit={(e) => e.preventDefault()}
                        w="100%"
                        alignItems="center"
                        justifyContent="space-between"
                        h="100%"
                        gap={4}
                    >
                        <FormControl>
                            <FormLabel>Data inicial</FormLabel>
                            <Input type="date" value={dataInicial} onChange={(e) => setDataInicial(e.target.value)} />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Data Final</FormLabel>
                            <Input type="date" value={dataFinal} onChange={(e) => setDataFinal(e.target.value)} />
                        </FormControl>
                        <FormControl>
                            <FormLabel>&nbsp;</FormLabel>
                            <Button
                                type="submit"
                                colorScheme="purple"
                                isLoading={false}
                                loadingText="Gerando"
                                spinnerPlacement="end"
                                onClick={handleSubmit}
                            >
                                Gerar
                            </Button>
                        </FormControl>
                    </Flex>
                    <Divider />
                    <TableContainer>
                        <Table
                            size='sm'
                            variant="striped"
                            colorScheme="purple"
                        >
                            <Thead>
                                <Tr>
                                    <Th>Data inicial</Th>
                                    <Th>Data final</Th>
                                    {
                                        tiposMedicao.map((item, index) => (
                                            <Th key={index}>{item.name}</Th>
                                        ))
                                    }
                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    medicoes.map((item, index) => (
                                        <Tr key={index}>
                                            <Td>{Helpers.toViewDate(item.initialDate)}</Td>
                                            <Td>{Helpers.toViewDate(item.finalDate)}</Td>
                                            {
                                                tiposMedicao.map((tipo) => (
                                                    <Td key={tipo._id}>{Helpers.toBrazilianCurrency(item[tipo.name])}</Td>
                                                ))
                                            }
                                        </Tr>
                                    ))
                                }
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Flex>
            </DrawerComponent>
        </>
    )
}

export default Medicao