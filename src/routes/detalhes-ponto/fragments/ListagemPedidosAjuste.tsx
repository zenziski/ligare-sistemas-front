import { CheckCircleIcon, CloseIcon, WarningTwoIcon } from "@chakra-ui/icons";
import { Box, CircularProgress, Flex, IconButton } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import moment from "moment";
import {
  aprovarCorrecao,
  listarSoliciacoesCorrecao,
} from "../../../stores/ponto/service";
import { IPonto } from "../../../stores/ponto/interface";
import { getAll } from "../../../stores/usuarios/service";
import { IUser } from "../../../stores/usuarios/interface";
import UserContext from "../../../contexts/UserContext";

const ListagemPedidosAjuste = () => {
  const toast = useToast();
  const { user } = useContext(UserContext);

  const [loading, setLoading] = useState(false);
  const [solicitacoes, setSolicitacoes] = useState<IPonto[]>([]);
  const [usuarios, setUsuarios] = useState<IUser[]>([]);
  const [flush, setFlush] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const response = await listarSoliciacoesCorrecao({
          userToFilter: undefined,
        });
        setSolicitacoes(response);
      } catch (error) {
        toast({
          title: "Erro ao carregar lista de solicitações de correção",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      }
      setLoading(false);
    };
    fetch();
  }, [flush]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await getAll();
        setUsuarios(response);
      } catch (error) {
        toast({
          title: "Erro ao carregar lista de pontos",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      }
    };
    if (user?.roles?.admin) fetch();
  }, [user]);

  const handleApprove = async (id: string, approved: boolean) => {
    setLoading(true);
    const response = await aprovarCorrecao({
      id,
      approved,
    });
    if (response) {
      toast({
        title: "Solicitação aprovada com sucesso",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } else {
      toast({
        title: "Erro ao aprovar solicitação",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
    setFlush(!flush);
  };
  return loading ? (
    <CircularProgress isIndeterminate color="green.300" />
  ) : (
    solicitacoes.length > 0 ? (
        <>
      <Flex direction="column" gap={5} mt={5}>
        {solicitacoes.map((key) => {
          return (
            <Flex
              key={key._id}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              p={5}
              borderRadius="md"
              borderWidth="1px"
            >
              <Flex direction="column">
                <Flex direction="row" alignItems="center" gap={2}>
                  <WarningTwoIcon fontSize={25} color={"orange"} />
                  <Box ml={2}>
                    <Box fontWeight={"bold"}>
                      {
                        usuarios.find((usuario) => usuario._id === key.user)
                          ?.name
                      }
                    </Box>
                    <Box fontSize="sm">
                      {key.type === "entrada" ? "Entrada " : "Saída "}-{" "}
                      {moment(key.registration).format("DD/MM/YYYY HH:mm")}
                    </Box>
                  </Box>
                </Flex>
              </Flex>
              <Flex direction="row" gap={4}>
                <IconButton
                  aria-label="Aceitar"
                  icon={<CheckCircleIcon />}
                  colorScheme="green"
                  onClick={() => {
                    handleApprove(key._id, true);
                  }}
                />
                <IconButton
                  aria-label="Recusar"
                  icon={<CloseIcon />}
                  colorScheme="red"
                  onClick={() => {
                    handleApprove(key._id, false);
                  }}
                />
              </Flex>
            </Flex>
          );
        })}
      </Flex>
    </>
    ) : "Nenhuma solicitação de ajuste de ponto"
  );
};

export default ListagemPedidosAjuste;
