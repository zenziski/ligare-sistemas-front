import { AddIcon } from "@chakra-ui/icons"
import { Button, Flex, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast } from "@chakra-ui/react"
import { useDisclosure } from "@chakra-ui/react"
import { useState } from "react"
import { createFeriado } from "../../../stores/ponto/service"

interface ModalCriarFeriadoProps {
    onFlushHook?: () => void
}

const ModalCriarFeriado = (props: ModalCriarFeriadoProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()

    const [description, setDescription] = useState<string>('')
    const [year, setYear] = useState<number>()
    const [month, setMonth] = useState<number>()
    const [day, setDay] = useState<number>()
    const [loading, setLoading] = useState<boolean>(false)

    const handleCreate = async () => {
        setLoading(true)
        try {
            if (description === '' || !month || !day) {
                throw new Error('Preencha todos os campos')
            }
            await createFeriado({ description, year, month, day })
            toast({
                title: 'Feriado criado',
                description: 'O feriado foi criado com sucesso',
                status: 'success',
                duration: 9000,
                isClosable: true
            })
            onClose()
            setLoading(false)
            if (props.onFlushHook) {
                props.onFlushHook()
            }
        } catch (error) {
            toast({
                title: 'Erro ao criar feriado',
                description: error instanceof Error ? error.message : 'Erro ao criar feriado',
                status: 'error',
                duration: 9000,
                isClosable: true
            })
            setLoading(false)
        }
    }

    return (
        <>
            <Button
                onClick={onOpen}
                colorScheme="blue"
            >
                Criar Feriado
                <AddIcon ml={2} />
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Criar Feriado</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex
                            direction="column"
                            justifyContent="space-between"
                            height="100%"
                            gap={2}
                        >
                            <Input
                                placeholder="Nome"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <Flex
                                gap={2}
                            >
                                <Input
                                    placeholder="Dia"
                                    value={day}
                                    onChange={(e) => setDay(Number(e.target.value))}
                                    type="number"
                                    min={1}
                                    max={31}
                                />
                                <Input
                                    placeholder="Mês"
                                    value={month}
                                    onChange={(e) => setMonth(Number(e.target.value))}
                                    type="number"
                                    min={1}
                                    max={12}
                                />
                                <Input
                                    placeholder="Ano"
                                    value={year}
                                    onChange={(e) => setYear(Number(e.target.value))}
                                    type="number"
                                    min={2025}
                                />

                            </Flex>
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <Flex
                            gap={2}
                        >
                            <Button onClick={onClose}>Fechar</Button>
                            <Button
                                colorScheme="blue"
                                mr={3}
                                onClick={handleCreate}
                                isLoading={loading}
                            >
                                Criar
                            </Button>
                        </Flex>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ModalCriarFeriado