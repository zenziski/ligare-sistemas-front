import { Button, Divider, Flex, FormControl, FormLabel, Input, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useToast, Text } from "@chakra-ui/react"
import DrawerComponent from "../../../components/Drawer"
import { useEffect, useState } from "react"
import { createMedicao, getAllTipoLancamento } from "../../../stores/obras/service"
import Helpers from "../../../utils/helper"
import { DownloadIcon } from "@chakra-ui/icons"

interface IMedicao {
    data: any
}

const Medicao = ({
    data
}: IMedicao) => {
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
            toast({
                title: "Medição gerada com sucesso!",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top-right"
            })
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

    const handleExportMedicoes = () => {
        if (medicoes.length === 0) {
            toast({
                title: "Nenhuma medição para exportar",
                description: "Não há medições disponíveis para exportar.",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "top-right"
            });
            return;
        }

        try {
            Helpers.generateMedicaoXlsxFile(medicoes, tiposMedicao, data?.name || 'obra');
            toast({
                title: "Arquivo exportado com sucesso!",
                description: `${medicoes.length} medições exportadas para Excel.`,
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top-right"
            });
        } catch (error) {
            toast({
                title: "Erro ao exportar arquivo",
                description: "Ocorreu um erro ao gerar o arquivo Excel.",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top-right"
            });
        }
    };

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
                    
                    {/* Header with export button */}
                    <Flex justify="space-between" align="center" mb={4}>
                        <Text fontSize="md" fontWeight="semibold" color="purple.600">
                            📊 Medições Geradas ({medicoes.length})
                        </Text>
                        <Button
                            leftIcon={<DownloadIcon />}
                            colorScheme="green"
                            variant="outline"
                            size="sm"
                            onClick={handleExportMedicoes}
                            isDisabled={medicoes.length === 0}
                        >
                            Exportar Excel
                        </Button>
                    </Flex>

                    <TableContainer>
                        {medicoes.length === 0 ? (
                            <Flex 
                                direction="column" 
                                align="center" 
                                justify="center" 
                                py={12} 
                                color="gray.500"
                                textAlign="center"
                            >
                                <Text fontSize="lg" mb={2}>📋 Nenhuma medição gerada ainda</Text>
                                <Text fontSize="sm">
                                    Use o formulário acima para gerar sua primeira medição
                                </Text>
                            </Flex>
                        ) : (
                            <Table
                                size='sm'
                                variant="striped"
                                colorScheme="purple"
                            >
                                <Thead>
                                    <Tr>
                                        <Th>Medição</Th>
                                        <Th>Data inicial</Th>
                                        <Th>Data final</Th>
                                        <Th>Período</Th>
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
                                                <Td fontWeight="medium">Medição {index + 1}</Td>
                                                <Td>{Helpers.toViewDate(item.initialDate)}</Td>
                                                <Td>{Helpers.toViewDate(item.finalDate)}</Td>
                                                <Td fontSize="sm" color="gray.600">
                                                    {Helpers.toViewDate(item.initialDate)} - {Helpers.toViewDate(item.finalDate)}
                                                </Td>
                                                {
                                                    tiposMedicao.map((tipo) => (
                                                        <Td key={tipo._id} fontWeight="medium" color="green.600">
                                                            {Helpers.toBrazilianCurrency(item[tipo.name] || 0)}
                                                        </Td>
                                                    ))
                                                }
                                            </Tr>
                                        ))
                                    }
                                    {/* Total Row */}
                                    {medicoes.length > 1 && (
                                        <Tr bg="purple.50" fontWeight="bold">
                                            <Td fontWeight="bold">TOTAL</Td>
                                            <Td>-</Td>
                                            <Td>-</Td>
                                            <Td fontSize="sm" color="purple.600">
                                                {medicoes.length} medições
                                            </Td>
                                            {
                                                tiposMedicao.map((tipo) => {
                                                    const total = medicoes.reduce((acc, medicao) => acc + (medicao[tipo.name] || 0), 0);
                                                    return (
                                                        <Td key={tipo._id} fontWeight="bold" color="purple.700">
                                                            {Helpers.toBrazilianCurrency(total)}
                                                        </Td>
                                                    );
                                                })
                                            }
                                        </Tr>
                                    )}
                                </Tbody>
                            </Table>
                        )}
                    </TableContainer>
                </Flex>
            </DrawerComponent>
        </>
    )
}

export default Medicao