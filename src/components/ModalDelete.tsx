import { Button, IconButton } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/modal";

interface ModalDeleteProps {
    onDelete: () => void;
    children: React.ReactNode;
    isButton?: boolean;
    buttonIcon?: React.ReactElement<any, string | React.JSXElementConstructor<any>> | undefined;
    buttonText?: string;
    buttonColorScheme?: string;
    headerText: string;
}

const ModalDelete = ({
    onDelete,
    children,
    isButton,
    buttonIcon,
    buttonText,
    buttonColorScheme,
    headerText
}: ModalDeleteProps) => {

    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            {isButton ?
                (
                    <Button leftIcon={buttonIcon} colorScheme={buttonColorScheme || 'teal'} onClick={onOpen}>
                        {buttonText || ''}
                    </Button>
                ) : (
                    <IconButton bg="transparent" aria-label="Abrir" icon={buttonIcon} onClick={onOpen} />
                )}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{headerText}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {children}
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button colorScheme="red" onClick={onDelete}>
                            Deletar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ModalDelete;