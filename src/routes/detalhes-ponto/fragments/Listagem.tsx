import { Box, Flex, Input, Progress, Select, Text } from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { CheckCircleIcon, CloseIcon, WarningTwoIcon } from "@chakra-ui/icons";
import ModalCorrigirBatida from "./ModalCorrigirBatida";
import { listarPontos } from "../../../stores/ponto/service";
import moment from "moment";
import { IPonto } from "../../../stores/ponto/interface";
import Helpers from "../../../utils/helper";
import UserContext from "../../../contexts/UserContext";
import { getAll } from "../../../stores/usuarios/service";
import { IUser } from "../../../stores/usuarios/interface";

const Listagem = () => {

    const toast = useToast()
    const { user } = useContext(UserContext)

    const [usuarios, setUsuarios] = useState<IUser[]>([]);
    const [usuarioSelecionado, setUsuarioSelecionado] = useState<string>('');
    const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
    const [pontos, setPontos] = useState<Record<string, IPonto[]>>({});
    const [saldoHoras, setSaldoHoras] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [flushHook, setFlushHook] = useState<boolean>(false);

    function groupByDay(pontos: IPonto[]): Record<string, IPonto[]> {
        return pontos.reduce((acc, ponto) => {
            const data = `${ponto.year}-${ponto.month}-${ponto.day}`;
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
                    startDate: moment(startDate).startOf('day').toISOString(),
                    endDate: moment(endDate).endOf('day').toISOString(),
                    userToFilter: user._id === usuarioSelecionado ? undefined : usuarioSelecionado
                })
                setSaldoHoras(response.saldoHoras);
                setPontos(groupByDay(response.pontos));
            } catch (error) {
                toast({
                    title: "Erro ao carregar lista de pontos",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top-right"
                })
            } finally {
                setLoading(false);
            }
        }

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
                    position: "top-right"
                })
            }
        }
        if (user?.roles?.admin) fetch();

    }, [user])

    return (
        <Flex
            direction="column"
        >
            <Flex
                direction="row"
                gap={5}
                maxWidth={800}
                width={'100%'}
            >
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
                {
                    user?.roles?.admin && <Select
                        placeholder="Usuários"
                        value={usuarioSelecionado}
                        onChange={(e) => setUsuarioSelecionado(e.target.value)}
                    >
                        {
                            usuarios.map((usuario) => (
                                <option
                                    key={usuario._id}
                                    value={usuario._id}
                                >
                                    {usuario.name}
                                </option>
                            ))
                        }
                    </Select>
                }
                <Box
                    display={'flex'}
                    alignItems={'center'}
                    fontWeight={'bold'}
                    width={300}
                    color={
                        saldoHoras < 0 ? 'red' :
                            saldoHoras > 0 ? 'green' :
                                'black'
                    }
                >
                    Saldo: &nbsp;
                    {(() => {
                        const horas = Math.floor(Math.abs(saldoHoras)); // Pegando o valor absoluto das horas
                        const minutos = Math.floor((Math.abs(saldoHoras) % 1) * 60); // Pegando os minutos
                        const formattedTime = `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;

                        return saldoHoras < 0 ? `-${formattedTime}` : `+${formattedTime}`
                    })()}
                </Box>
            </Flex>
            <Flex
                direction="column"
                gap={5}
                mt={5}
            >
                {
                    loading && <Progress size="xs" isIndeterminate />
                }
                {
                    Object.keys(pontos || {}).map((key) => {
                        return (
                            <Flex
                                borderBottom="1px solid #ccc"
                                pb={2}
                                gap={4}
                                key={key}
                            >
                                <Box
                                    fontSize={25}
                                    display={'flex'}
                                    alignItems={'center'}
                                >
                                    {(pontos[key][0].saldo > 0 && !pontos[key].some(p => p.type === 'falta')) && <CheckCircleIcon color={'green'} />}
                                    {(pontos[key][0].saldo < 0 && !pontos[key].some(p => p.type === 'falta')) && <WarningTwoIcon color={'orange'} />}
                                    {pontos[key].some(p => p.type === 'falta') && <CloseIcon color={'red'} />}
                                </Box>
                                <Box
                                    minWidth={300}
                                >
                                    <Box
                                        fontWeight="bold"
                                        fontSize={18}
                                    >
                                        {Helpers.translateDayOfWeek(moment(key).format('dddd'))}, {moment(key).format('DD/MM/YYYY')}
                                    </Box>
                                    <Flex>
                                        {
                                            pontos[key].sort((a, b) => {
                                                if (a.registration < b.registration) return -1;
                                                if (a.registration > b.registration) return 1;
                                                return 0;
                                            }).map((ponto, index) => (
                                                <Box
                                                    key={ponto._id}
                                                    display={'flex'}
                                                    color={ponto.isPending ? 'orange' : 'black'}
                                                    fontWeight={'bold'}
                                                >
                                                    <Text
                                                        color={'gray'}
                                                    >{ponto.type.slice(0, 1).toUpperCase()}:</Text>
                                                    &nbsp;
                                                    {ponto.registration && moment(ponto.registration).format('HH:mm')}
                                                    {
                                                        index !== pontos[key].length - 1 && <>&nbsp;-&nbsp;</>
                                                    }
                                                </Box>
                                            ))
                                        }
                                    </Flex>
                                </Box>
                                <Box
                                    display={'flex'}
                                    alignItems={'center'}
                                    fontWeight={'bold'}
                                    color={
                                        pontos[key].some(p => p.type === 'falta') ? 'red' :
                                            pontos[key][0].saldo < 0 ? 'orange' :
                                                'green'
                                    }
                                >
                                    {(() => {
                                        const saldo = pontos[key][0].saldo;
                                        const horas = Math.floor(Math.abs(saldo)); // Pegando o valor absoluto das horas
                                        const minutos = Math.floor((Math.abs(saldo) % 1) * 60); // Pegando os minutos
                                        const formattedTime = `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;

                                        return saldo < 0 ? `-${formattedTime}` : `+${formattedTime}`;
                                    })()}
                                </Box>
                                <Box
                                    ml="auto"
                                    display={'flex'}
                                    alignItems={'center'}
                                    gap={6}
                                >

                                    <ModalCorrigirBatida
                                        dia={key}
                                        setFlushHook={setFlushHook}
                                    />
                                </Box>
                            </Flex>
                        )
                    })
                }
            </Flex>
        </Flex>
    )
}

export default Listagem