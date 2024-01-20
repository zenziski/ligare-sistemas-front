import { Api } from '../../utils/api';
import { IUserTable } from './interface';


export const getAll = async () => {
    const response = await Api.get<IUserTable[]>('/customer');
    return response.data;
};

export const getOne = async (id: string) => {
    const response = await Api.get<IUserTable>(`/customer/${id}`);
    return response.data;
};

export const createCustomer = async (data: IUserTable) => {
    const response = await Api.post<IUserTable>('/customer', data);
    return response.data;
};

export const updateCustomer = async (data: IUserTable) => {
    const response = await Api.patch<IUserTable>(`/customer/${data._id}`, data);
    return response.data;
};

export const removeCustomer = async (id: string) => {
    const response = await Api.delete<IUserTable>(`/customer/${id}`);
    return response.data;
};