import { Api } from '../../utils/api';
import { IFornecedorTable } from './interface';


export const getAll = async () => {
    const response = await Api.get<IFornecedorTable[]>('/supplier');
    return response.data;
};

export const getOne = async (id: string) => {
    const response = await Api.get<IFornecedorTable>(`/supplier/${id}`);
    return response.data;
};

export const createSupplier = async (data: IFornecedorTable) => {
    const response = await Api.post<IFornecedorTable>('/supplier', data);
    return response.data;
};

export const updateSupplier = async (data: IFornecedorTable) => {
    console.log(data);
    const response = await Api.patch<IFornecedorTable>(`/supplier/${data._id}`, data);
    return response.data;
};

export const removeSupplier = async (id: string) => {
    const response = await Api.delete<IFornecedorTable>(`/supplier/${id}`);
    return response.data;
};