import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  Text,
  HStack,
  Icon,
  Box,
  useColorModeValue,
} from '@chakra-ui/react';
import { WarningIcon, CheckCircleIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';

const MotionModalContent = motion(ModalContent);
const MotionAlertDialogContent = motion(AlertDialogContent);

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSave: () => void;
  isLoading: boolean;
  color: string;
}

interface DeleteAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemType: string;
  isLoading: boolean;
  cancelRef: React.RefObject<HTMLButtonElement>;
}

/**
 * Modal otimizado para edição com animações suaves
 */
export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  onSave,
  isLoading,
  color,
}) => {
  const overlayBg = useColorModeValue('blackAlpha.300', 'blackAlpha.600');

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="lg"
      isCentered
      motionPreset="slideInBottom"
    >
      <ModalOverlay bg={overlayBg} backdropFilter="blur(10px)" />
      <MotionModalContent
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.2 }}
        borderRadius="xl"
        shadow="2xl"
        border="1px solid"
        borderColor={useColorModeValue('gray.200', 'gray.700')}
      >
        {/* Header com gradiente */}
        <Box
          bgGradient={`linear(to-r, ${color}.500, ${color}.600)`}
          borderTopRadius="xl"
          p={6}
          color="white"
        >
          <ModalHeader p={0} fontSize="xl" fontWeight="bold">
            <HStack spacing={3}>
              <Icon as={CheckCircleIcon} boxSize={6} />
              <Text>{title}</Text>
            </HStack>
          </ModalHeader>
        </Box>
        
        <ModalCloseButton color="white" top={6} right={6} />
        
        <ModalBody px={6} py={6}>
          {children}
        </ModalBody>

        <ModalFooter px={6} pb={6} pt={0}>
          <HStack spacing={3} width="100%" justify="flex-end">
            <Button
              variant="ghost"
              onClick={onClose}
              size="lg"
              borderRadius="lg"
              _hover={{ bg: 'gray.100' }}
            >
              Cancelar
            </Button>
            <Button
              colorScheme={color}
              onClick={onSave}
              isLoading={isLoading}
              loadingText="Salvando..."
              size="lg"
              borderRadius="lg"
              px={8}
              _hover={{ transform: 'translateY(-1px)', shadow: 'lg' }}
              transition="all 0.2s ease"
            >
              Salvar Alterações
            </Button>
          </HStack>
        </ModalFooter>
      </MotionModalContent>
    </Modal>
  );
};

/**
 * Alert Dialog moderno para confirmação de exclusão
 */
export const DeleteAlert: React.FC<DeleteAlertProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType,
  isLoading,
  cancelRef,
}) => {
  const overlayBg = useColorModeValue('blackAlpha.300', 'blackAlpha.600');

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
      motionPreset="slideInBottom"
    >
      <ModalOverlay bg={overlayBg} backdropFilter="blur(10px)" />
      <MotionAlertDialogContent
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.2 }}
        borderRadius="xl"
        shadow="2xl"
        border="1px solid"
        borderColor={useColorModeValue('gray.200', 'gray.700')}
      >
        {/* Header com fundo vermelho */}
        <Box
          bg="red.500"
          borderTopRadius="xl"
          p={6}
          color="white"
        >
          <AlertDialogHeader p={0} fontSize="xl" fontWeight="bold">
            <HStack spacing={3}>
              <Icon as={WarningIcon} boxSize={6} />
              <Text>Confirmar Exclusão</Text>
            </HStack>
          </AlertDialogHeader>
        </Box>

        <AlertDialogBody px={6} py={6}>
          <Box>
            <Text fontSize="md" mb={3}>
              Tem certeza que deseja excluir{' '}
              <Text as="span" fontWeight="bold" color="red.600">
                "{itemName}"
              </Text>
              ?
            </Text>
            <Box
              bg="red.50"
              border="1px solid"
              borderColor="red.200"
              borderRadius="lg"
              p={4}
            >
              <Text fontSize="sm" color="red.700">
                ⚠️ Esta ação não pode ser desfeita. O {itemType} será removido permanentemente.
              </Text>
            </Box>
          </Box>
        </AlertDialogBody>

        <AlertDialogFooter px={6} pb={6} pt={0}>
          <HStack spacing={3} width="100%" justify="flex-end">
            <Button 
              ref={cancelRef} 
              onClick={onClose}
              size="lg"
              borderRadius="lg"
              variant="ghost"
              _hover={{ bg: 'gray.100' }}
            >
              Cancelar
            </Button>
            <Button
              colorScheme="red"
              onClick={onConfirm}
              ml={3}
              isLoading={isLoading}
              loadingText="Excluindo..."
              size="lg"
              borderRadius="lg"
              px={8}
              _hover={{ transform: 'translateY(-1px)', shadow: 'lg' }}
              transition="all 0.2s ease"
            >
              Excluir
            </Button>
          </HStack>
        </AlertDialogFooter>
      </MotionAlertDialogContent>
    </AlertDialog>
  );
};