import { Api } from "../../utils/api";
import { IUser } from "./interface";

export const getAll = async () => {
    const response = await Api.get<IUser[]>('/users');
    return response.data;
};

export const createUser = async (data: IUser) => {
    const response = await Api.post<IUser>('/users', data);
    return response.data;
}

export const updateUser = async (data: IUser) => {
    const response = await Api.put<IUser>(`/users`, data);
    return response.data;
}