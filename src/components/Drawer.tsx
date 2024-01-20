import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, IconButton, Spinner, useDisclosure } from "@chakra-ui/react";
import React from "react";

interface DrawerProps {
    isButton?: boolean
    buttonIcon?: React.ReactElement<any, string | React.JSXElementConstructor<any>> | undefined;
    buttonText?: string;
    buttonColorScheme?: string;
    headerText: string;
    children: React.ReactNode;
    onAction?: () => void;
    onOpenHook?: () => void;
    isLoading?: boolean;
    isDisabled?: boolean;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const DrawerComponent: React.FC<DrawerProps> = ({ buttonIcon, buttonText, headerText, buttonColorScheme, size, isButton, onAction, onOpenHook, isDisabled, isLoading, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            {isButton ?
                (
                    <Button leftIcon={buttonIcon} colorScheme={buttonColorScheme || 'teal'} onClick={() => {
                        onOpen();
                        onOpenHook && onOpenHook();
                    }}>
                        {buttonText || ''}
                    </Button>
                ) : (
                    <IconButton bg="transparent" aria-label="Abrir" icon={buttonIcon} onClick={() => {
                        onOpen();
                        onOpenHook && onOpenHook();
                    }} />
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
                        <Button colorScheme='teal' onClick={() => {
                            if (onAction) {
                                try {
                                    onAction();
                                } catch (error) { }
                            }
                        }} isDisabled={isLoading || isDisabled}>{isLoading && <Spinner />}Salvar</Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default DrawerComponent;