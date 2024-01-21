import { Api } from '../../utils/api';
import { IObrasItem, IObrasTable, ITiposLancamento } from './interface';


export const getAllConstruction = async () => {
    const response = await Api.get<IObrasTable[]>('/construction');
    return response.data;
};

export const getOneConstruction = async (id: string) => {
    const response = await Api.get<IObrasTable>(`/construction/${id}`);
    return response.data;
};

export const createConstruction = async (data: IObrasTable) => {
    const response = await Api.post<IObrasTable>('/construction', data);
    return response.data;
};

export const updateConstruction = async (data: IObrasTable) => {
    const response = await Api.patch<IObrasTable>(`/construction/${data._id}`, data);
    return response.data;
};

export const removeConstruction = async (id: string) => {
    const response = await Api.delete<IObrasTable>(`/construction/${id}`);
    return response.data;
};

export const getAllConstructionItems = async () => {
    const response = await Api.get<IObrasItem[]>('/construction-item');
    return response.data;
};

export const getOneConstructionItem = async (id: string) => {
    const response = await Api.get<IObrasItem>(`/construction-item/${id}`);
    return response.data;
};

export const createConstructionItem = async (data: IObrasItem) => {
    const response = await Api.post<IObrasItem>('/construction-item', data);
    return response.data;
};

export const updateConstructionItem = async (data: IObrasItem) => {
    const response = await Api.put<IObrasItem>(`/construction-item/${data._id}`, data);
    return response.data;
};

export const removeConstructionItem = async (id: string) => {
    const response = await Api.delete<IObrasItem>(`/construction-item/${id}`);
    return response.data;
};

export const addConstructionDiary = async (id: string, data: any) => {
    const response = await Api.patch<IObrasTable>(`/construction/${id}/diary`, data);
    return response.data;
}

export const editConstructionDiary = async (idObra: string, idDiary: string, data: any) => {
    const response = await Api.patch<IObrasTable>(`/construction/${idObra}/diary/${idDiary}`, data);
    return response.data;
}

export const createTipoLancamento = async (data: any) => {
    const response = await Api.post<ITiposLancamento>('/entry-type', data);
    return response.data;
}

export const getAllTipoLancamento = async () => {
    const response = await Api.get<ITiposLancamento[]>('/entry-type');
    return response.data;
};

export const getOneTipoLancamento = async (id: string) => {
    const response = await Api.get<ITiposLancamento>(`/entry-type/${id}`);
    return response.data;
};

export const updateTipoLancamento = async (data: ITiposLancamento) => {
    const response = await Api.put<ITiposLancamento>(`/entry-type/${data._id}`, data);
    return response.data;
};

export const removeTipoLancamento = async (id: string) => {
    const response = await Api.delete<ITiposLancamento>(`/entry-type/${id}`);
    return response.data;
};

export const createMedicao = async (id: string, dates: any) => {
    const response = await Api.patch<any>(`/construction/${id}/measurements`, dates);
    return response.data;
}

export const getAllMedicao = async (id: string) => {
    const response = await Api.get<any[]>(`/construction/${id}/measurements`);
    return response.data;
}

export const deleteMedicao = async (idObra: string, idMedicao: string) => {
    const response = await Api.delete<any>(`/construction/${idObra}/measurements/${idMedicao}`);
    return response.data;
}