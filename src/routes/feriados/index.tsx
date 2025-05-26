import {
  Flex,
  Progress,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import moment from "moment";
import { IFeriado } from "../../stores/ponto/interface";
import { deleteFeriado, getFeriados } from "../../stores/ponto/service";
import ModalDelete from "../../components/ModalDelete";
import { DeleteIcon } from "@chakra-ui/icons";
import ModalCriarFeriado from "./fragments/ModalCriarFeriado";

const Feriados = () => {
  const toast = useToast();

  const [feriados, setFeriados] = useState<IFeriado[]>([] as IFeriado[]);
  const [loading, setLoading] = useState<boolean>(false);
  const [flushHook, setFlushHook] = useState<boolean>(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const result = await getFeriados();
        setFeriados(result);
      } catch (error) {
        toast({
          title: "Erro ao buscar feriados",
          description:
            "Ocorreu um erro ao buscar os feriados, tente novamente mais tarde",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [flushHook]);

  return (
    <Sidebar>
      <Flex height="100%" width="100%" p={10} direction="column">
        <Flex direction="row" mb="15px" justifyContent="space-between">
          <Text fontSize="4xl">Feriados</Text>
        </Flex>
        <Flex justifyContent={"flex-end"}>
          <ModalCriarFeriado onFlushHook={() => setFlushHook(!flushHook)} />
        </Flex>
        <TableContainer mt={10} width="100%" height="100%" overflow="auto">
          <Table>
            <Thead>
              <Tr>
                <Th>Feriado</Th>
                <Th>Data</Th>
                <Th>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {loading && (
                <Tr>
                  <Th colSpan={3}>
                    {loading && <Progress size="xs" isIndeterminate />}
                  </Th>
                </Tr>
              )}
              {feriados.map((feriado) => (
                <Tr>
                  <Th>{feriado.description}</Th>
                  <Th>
                    {moment(
                      `${feriado.year || new Date().getFullYear()}-${
                        feriado.month
                      }-${feriado.day}`
                    ).format(feriado.year ? "DD/MM/YYYY" : "DD/MM")}
                  </Th>
                  <Th>
                    <ModalDelete
                      headerText="Remover Feriado"
                      buttonColorScheme="red"
                      buttonIcon={<DeleteIcon />}
                      onDelete={async () => {
                        await deleteFeriado(feriado._id);
                        setFlushHook(!flushHook);
                      }}
                    >
                      Remover Feriado {feriado.description}
                    </ModalDelete>
                  </Th>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>
    </Sidebar>
  );
};

export default Feriados;
