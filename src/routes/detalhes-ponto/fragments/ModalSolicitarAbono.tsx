import {
  Button,
  CircularProgress,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
  Textarea,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import moment from "moment/moment";
import { useState } from "react";
import { corrigirPonto } from "../../../stores/ponto/service";

interface IModalSolicitarAbono {
  dia: string;
  setFlushHook: any;
}

const ModalSolicitarAbono = (props: IModalSolicitarAbono) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [loading, setLoading] = useState<boolean>(false);
  const [justificative, setJustificative] = useState<string>("");

  const handleSolicitarAbono = async () => {
    setLoading(true);
    try {
      if (props.dia === "") {
        toast({
          title: "Data inválida",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        return;
      }
      if (justificative === "") {
        toast({
          title: "Preencha a justificativa",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        return;
      }
      await corrigirPonto({
        dataCorrecao: moment(props.dia).toISOString(),
        tipo: "abono",
        justificative,
      });
      toast({
        title: "Solicitação enviada com sucesso",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      props.setFlushHook((prev: boolean) => !prev);
      onClose();
    } catch (err) {
      toast({
        title: "Erro ao solicitar abono",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

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
          <ModalHeader>
            Solicitar Abono {moment(props.dia).format("DD/MM/YYYY")}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea
              placeholder="Justificativa"
              value={justificative}
              onChange={(e) => setJustificative(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Fechar
            </Button>
            <Button
              colorScheme="blue"
              isDisabled={loading}
              onClick={handleSolicitarAbono}
            >
              {loading ? (
                <CircularProgress isIndeterminate size={15} />
              ) : (
                "Enviar"
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalSolicitarAbono;
