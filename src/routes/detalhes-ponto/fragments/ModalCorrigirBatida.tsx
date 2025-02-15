import { HamburgerIcon } from "@chakra-ui/icons"
import { Button, CircularProgress, Flex, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, RadioGroup, Stack, useDisclosure } from "@chakra-ui/react"
import { useState } from "react"
import { useToast } from "@chakra-ui/react"
import moment from "moment"
import { corrigirPonto } from "../../../stores/ponto/service"

interface IModalCorrigirBatidaProps {
    // Props definition
    dia: string,
    setFlushHook: any
}

const ModalCorrigirBatida = (props: IModalCorrigirBatidaProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()

    const [tipo, setTipo] = useState<string>('entrada')
    const [horario, setHorario] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    const handleEnviar = async () => {
        setLoading(true)
        try {
            console.log(moment(`${props.dia} ${horario}`).toISOString());
            await corrigirPonto({
                dataCorrecao: moment(`${props.dia} ${horario}`).toISOString(),
                tipo
            })
            toast({
                title: "Correção enviada com sucesso",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top-right"
            })
            props.setFlushHook((prev: boolean) => !prev)
            onClose()
        } catch (error) {
            console.log(error);
            toast({
                title: "Erro ao enviar correção",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-right"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <IconButton
                aria-label="delete"
                icon={<HamburgerIcon />}
                onClick={onOpen}
            />

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Corrigir Batida {moment(props.dia).format('DD/MM/YYYY')}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex
                            direction="column"
                            gap={5}
                        >
                            <Input
                                placeholder="Corrigir Batida"
                                type="time"
                                value={horario}
                                onChange={(e) => setHorario(e.target.value)}
                            />
                            <RadioGroup
                                onChange={setTipo}
                                value={tipo}
                            >
                                <Stack direction={'row'}>
                                    <Radio value="entrada">Entrada</Radio>
                                    <Radio value="saida">Saída</Radio>
                                </Stack>
                            </RadioGroup>
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <Button mr={3} onClick={onClose}>
                            Fechar
                        </Button>
                        <Button
                            colorScheme="blue"
                            isDisabled={loading}
                            onClick={handleEnviar}
                        >
                            {loading ? <CircularProgress isIndeterminate size={15} /> : 'Enviar'}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ModalCorrigirBatida