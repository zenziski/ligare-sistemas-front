import { Flex, Text, useToast } from "@chakra-ui/react";
import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import moment from "moment";
import { IFeriado } from "../../stores/ponto/interface";
import { deleteFeriado, getFeriados } from "../../stores/ponto/service";
import ModalDelete from "../../components/ModalDelete";
import { DeleteIcon } from "@chakra-ui/icons";
import ModalCriarFeriado from "./fragments/ModalCriarFeriado";
import StyledTable from "../../components/StyledTable";

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
        <Flex justifyContent={"flex-end"} mb="15px">
          <ModalCriarFeriado onFlushHook={() => setFlushHook(!flushHook)} />
        </Flex>
        <StyledTable
          columns={[
            {
              key: "description",
              label: "Feriado",
              render: (feriado) => <Text>{feriado.description}</Text>,
            },
            {
              key: "date",
              label: "Data",
              render: (feriado) => (
                <Text>
                  {moment(
                    `${feriado.year || new Date().getFullYear()}-${
                      feriado.month
                    }-${feriado.day}`
                  ).format(feriado.year ? "DD/MM/YYYY" : "DD/MM")}
                </Text>
              ),
            },
            {
              key: "acoes",
              label: "Ações",
              width: "140px",
              render: (feriado) => (
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
              ),
            },
          ]}
          data={feriados}
          loading={loading}
          emptyMessage={"Nenhum feriado cadastrado."}
          rowProps={() => ({
            _hover: {
              bg: "gray.50",
              boxShadow: "inset 0 0 0 1px var(--chakra-colors-gray-100)",
            },
            transition: "all 0.15s",
          })}
        />
      </Flex>
    </Sidebar>
  );
};

export default Feriados;
