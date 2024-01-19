import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, IconButton, useDisclosure } from "@chakra-ui/react";
import React from "react";

interface DrawerProps {
    isButton?: boolean
    buttonIcon?: React.ReactElement<any, string | React.JSXElementConstructor<any>> | undefined;
    buttonText?: string;
    buttonColorScheme?: string;
    headerText: string;
    children: React.ReactNode;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const DrawerComponent: React.FC<DrawerProps> = ({ buttonIcon, buttonText, headerText, buttonColorScheme, size, isButton, children }) => {
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
            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={onClose}
                size={size || 'md'}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader fontFamily="Poppins-Medium">{headerText}</DrawerHeader>

                    <DrawerBody fontFamily="Poppins-Regular">
                        {children}
                    </DrawerBody>

                    <DrawerFooter>
                        <Button variant='outline' mr={3} onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button colorScheme='teal'>Salvar</Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default DrawerComponent;