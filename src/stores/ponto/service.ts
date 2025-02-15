import { Api } from "../../utils/api";
import { IPonto } from "./interface";

export const registrarPonto = async () => {
    const response = await Api.post<IPonto>('/ponto/registrar');
    return response.data;
}

export const listarPontos = async (data: {
    startDate: string,
    endDate: string
    userToFilter?: string
}) => {
    const response = await Api.post('/ponto/listar', data);
    return response.data as {
        horasTrabalhadas: number,
        pontos: IPonto[]
        saldoHoras: number
    }
}

export const corrigirPonto = async (data: {
    dataCorrecao: string,
    tipo: string,
}) => {
    const response = await Api.post<IPonto>('/ponto/corrigir', data);
    return response.data;
}

export const listarSoliciacoesCorrecao = async (data: {
    userToFilter: string
}) => {
    const response = await Api.post<IPonto[]>('/ponto/solicitacoes-correcao', data);
    return response.data;
}