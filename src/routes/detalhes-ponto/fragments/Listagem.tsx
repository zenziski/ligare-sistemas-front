import {
  Box,
  Button,
  Flex,
  Input,
  Progress,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import {
  CheckCircleIcon,
  CloseIcon,
  DownloadIcon,
  TimeIcon,
  WarningTwoIcon,
} from "@chakra-ui/icons";
import ModalCorrigirBatida from "./ModalCorrigirBatida";
import { getRelatorioData, listarPontos } from "../../../stores/ponto/service";
import moment from "moment";
import { IPonto } from "../../../stores/ponto/interface";
import Helpers from "../../../utils/helper";
import UserContext from "../../../contexts/UserContext";
import { getAll } from "../../../stores/usuarios/service";
import { IUser } from "../../../stores/usuarios/interface";
import ModalSolicitarAbono from "./ModalSolicitarAbono.tsx";

const Listagem = () => {
  const toast = useToast();
  const { user } = useContext(UserContext);

  const [usuarios, setUsuarios] = useState<IUser[]>([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<string>("");
  const [startDate, setStartDate] = useState(
    moment().startOf("month").startOf("day").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    moment().endOf("month").endOf("day").format("YYYY-MM-DD")
  );
  const [pontos, setPontos] = useState<Record<string, IPonto[]>>({});
  const [saldoHoras, setSaldoHoras] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [flushHook, setFlushHook] = useState<boolean>(false);

  function groupByDay(pontos: IPonto[]): Record<string, IPonto[]> {
    return pontos.reduce((acc, ponto) => {
      const data = `${ponto.year}-${ponto.month}-${ponto.day}-${ponto.user}`;
      if (!acc[data]) {
        acc[data] = [];
      }
      acc[data].push(ponto);
      return acc;
    }, {} as Record<string, IPonto[]>);
  }

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const response = await listarPontos({
          startDate: moment(startDate).startOf("day").toISOString(),
          endDate: moment(endDate).endOf("day").toISOString(),
          userToFilter:
            user._id === usuarioSelecionado ? undefined : usuarioSelecionado,
        });
        setSaldoHoras(response.saldoHoras);
        setPontos(groupByDay(response.pontos));
      } catch (error) {
        toast({
          title: "Erro ao carregar lista de pontos",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [startDate, endDate, flushHook, usuarioSelecionado]);

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

  const handleDownloadRelatorio = async () => {
    const type = usuarioSelecionado ? "porUsuario" : "mensal";
    const filters = {
      year: moment(startDate).year(),
      month: moment(startDate).month() + 1,
      userId: type === "porUsuario" ? usuarioSelecionado : undefined,
    };
    const response = await getRelatorioData({ type, filters });
    Helpers.generateXlsxFile(
      response,
      type,
      type === "porUsuario"
        ? `ponto_${usuarios.find((us) => us._id === usuarioSelecionado)?.name}`
        : ""
    );
  };

  return (
    <Flex direction="column">
      <Flex
        direction="row"
        gap={5}
        width={"100%"}
        justifyContent={"space-between"}
      >
        <Flex direction={"row"} gap={5} width={"100%"}>
          <Flex direction={"row"} gap={5} justifyContent={"space-between"}>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            {user?.roles?.admin && (
              <Select
                placeholder="Selecione..."
                value={usuarioSelecionado}
                onChange={(e) => setUsuarioSelecionado(e.target.value)}
              >
                {usuarios
                  .filter((us) => !us.roles?.admin)
                  .map((usuario) => (
                    <option key={usuario._id} value={usuario._id}>
                      {usuario.name}
                    </option>
                  ))}
              </Select>
            )}
            <Box
              display={"flex"}
              alignItems={"center"}
              fontWeight={"bold"}
              width={300}
              color={
                saldoHoras < 0 ? "red" : saldoHoras > 0 ? "green" : "black"
              }
              whiteSpace={"nowrap"}
            >
              Saldo: &nbsp;
              {(() => {
                const horas = Math.floor(Math.abs(saldoHoras));
                const minutos = Math.fround(
                  (Math.abs(saldoHoras) % 1) * 60
                ).toFixed(0);
                const formattedTime = `${String(horas).padStart(
                  2,
                  "0"
                )}:${String(minutos).padStart(2, "0")}`;

                return saldoHoras < 0
                  ? `-${formattedTime}`
                  : `+${formattedTime}`;
              })()}
            </Box>
          </Flex>
        </Flex>
        {user?.roles?.admin && (
          <Flex>
            <Button
              colorScheme="green"
              leftIcon={<DownloadIcon />}
              onClick={() => handleDownloadRelatorio()}
            >
              Baixar relatório
            </Button>
          </Flex>
        )}
      </Flex>
      <Flex direction="column" gap={5} mt={5}>
        {loading && <Progress size="xs" isIndeterminate />}
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th></Th>
              {user?.roles?.admin && <Th>Usuário</Th>}
              <Th>Horários</Th>
              <Th>Saldo de Horas</Th>
              {!user?.roles?.admin && <Th>Ações</Th>}
            </Tr>
          </Thead>
          <Tbody>
            {Object.keys(pontos || {}).map((key) => {
              const date = key.split("-").slice(0, 3).join("-");
              return (
                <Tr key={key}>
                  <Td>
                    <Box fontSize={25} display={"flex"} alignItems={"center"}>
                      {pontos[key][0].saldo > 0 &&
                        !pontos[key].some((p) => p.type === "falta") && (
                          <CheckCircleIcon color={"green"} />
                        )}
                      {pontos[key][0].saldo < 0 &&
                        !pontos[key].some((p) => p.type === "falta") &&
                        !pontos[key].some((p) => p.type === "abono") && (
                          <WarningTwoIcon color={"orange"} />
                        )}
                      {pontos[key].some((p) => p.type === "falta") && (
                        <CloseIcon color={"red"} />
                      )}
                      {pontos[key].some(
                        (p) => p.type === "abono" && !p.isPending
                      ) && <CheckCircleIcon color={"blue.400"} />}
                      {pontos[key].some(
                        (p) => p.type === "abono" && p.isPending
                      ) && <TimeIcon color={"orange.400"} />}
                    </Box>
                  </Td>
                  {user?.roles?.admin && (
                    <Td>
                      {
                        usuarios.find((us) => us._id === pontos[key][0].user)
                          ?.name
                      }
                    </Td>
                  )}
                  <Td>
                    <Box display={"flex"} flexDirection={"column"} gap={1}>
                      <Box fontWeight="bold" fontSize={18}>
                        {Helpers.translateDayOfWeek(
                          moment(date).format("dddd")
                        )}
                        , {moment(date).format("DD/MM/YYYY")}
                      </Box>
                      <Flex>
                        {pontos[key]
                          .sort((a, b) => {
                            if (a.registration < b.registration) return -1;
                            if (a.registration > b.registration) return 1;
                            return 0;
                          })
                          .map((ponto, index) => (
                            <Box
                              key={ponto._id}
                              display={"flex"}
                              color={ponto.isPending ? "orange" : "black"}
                              fontWeight={"bold"}
                            >
                              <Text color={"gray"}>
                                {["falta", "abono"].includes(ponto.type)
                                  ? Helpers.capitalizeFirstLetter(ponto.type)
                                  : `${ponto.type.slice(0, 1).toUpperCase()}: `}
                              </Text>
                              &nbsp;
                              {ponto.registration &&
                                moment(ponto.registration).format("HH:mm")}
                              {index !== pontos[key].length - 1 && (
                                <>&nbsp;-&nbsp;</>
                              )}
                            </Box>
                          ))}
                      </Flex>
                    </Box>
                  </Td>
                  <Td>
                    <Box
                      display={"flex"}
                      alignItems={"center"}
                      fontWeight={"bold"}
                      color={
                        pontos[key].some((p) => p.type === "falta")
                          ? "red"
                          : pontos[key][0].saldo < 0
                          ? "orange"
                          : "green"
                      }
                    >
                      {(() => {
                        const saldo = pontos[key][0].saldo;
                        const horas = Math.floor(Math.abs(saldo));
                        const minutos = Math.fround(
                          (Math.abs(saldo) % 1) * 60
                        ).toFixed(0);
                        const formattedTime = `${String(horas).padStart(
                          2,
                          "0"
                        )}:${String(minutos).padStart(2, "0")}`;

                        return saldo < 0
                          ? `-${formattedTime}`
                          : `+${formattedTime}`;
                      })()}
                    </Box>
                  </Td>
                  {!user?.roles?.admin && (
                    <Td>
                      <Box display={"flex"} alignItems={"center"} gap={6}>
                        {pontos[key].some((p) => p.type === "falta") ? (
                          <ModalSolicitarAbono
                            dia={date}
                            setFlushHook={setFlushHook}
                          />
                        ) : (
                          <ModalCorrigirBatida
                            dia={date}
                            setFlushHook={setFlushHook}
                          />
                        )}
                      </Box>
                    </Td>
                  )}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Flex>
    </Flex>
  );
};

export default Listagem;
