import { Api } from "../../utils/api";
import { IFeriado, IPonto } from "./interface";

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
    justificative?: string
}) => {
    const response = await Api.post<IPonto>('/ponto/corrigir', data);
    return response.data;
}

export const listarSoliciacoesCorrecao = async (data: {
    userToFilter?: string
}) => {
    const response = await Api.post<IPonto[]>('/ponto/listar-solicitacoes', data);
    return response.data;
}

export const aprovarCorrecao = async (data: {
    id: string,
    approved: boolean
}) => {
    const response = await Api.post<IPonto>('/ponto/aprovar-correcao', { id: data.id, aprovado: data.approved });
    return response.data;
}

export const getRelatorioData = async (data: { type: string, filters: any }) => {
    const response = await Api.post('/ponto/relatorio', data);
    return response.data;
}

export const getFeriados = async () => {
    const response = await Api.get<IFeriado[]>('/ponto/feriados');
    return response.data;
}

export const createFeriado = async (data: {
    year?: number,
    month: number,
    day: number,
    description: string
}) => {
    const response = await Api.post<IFeriado>('/ponto/feriados', data);
    return response.data;
}

export const deleteFeriado = async (id: string) => {
    const response = await Api.delete<IFeriado>(`/ponto/feriados/${id}`);
    return response.data;
}