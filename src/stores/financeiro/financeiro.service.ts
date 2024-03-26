import { Api } from "../../utils/api";
import { IAccountPlan } from "./financeiro.interface";

export const getAccountPlanService = async () => {
    const response = await Api.get('/account-plan');
    return response.data;
}

export const createAccountPlanService = async (data: any) => {
    const response = await Api.post<IAccountPlan>('/account-plan', data);
    return response.data;
};

export const updateGroup = async (data: any) => {
    const response = await Api.patch<IAccountPlan>(`/account-plan/${data._id}`, data);
    return response.data;
}

export const removeGroup = async (id: string, type: string) => {
    const response = await Api.delete<IAccountPlan>(`/account-plan/${id}/${type}`);
    return response.data;
}