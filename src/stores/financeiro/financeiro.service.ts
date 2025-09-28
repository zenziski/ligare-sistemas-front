import { Api } from "../../utils/api";
import {
  IAccountPlan,
  IGetAccountPlanService,
  ICreateAccountPlanService,
  IUpdateAccountPlanService,
  IRemoveAccountPlanService,
} from "./financeiro.interface";

export const getAccountPlanService: () => Promise<IGetAccountPlanService> =
  async () => {
    const response = await Api.get("/account-plan");
    return response.data;
  };


export const createAccountPlanService = async (data: ICreateAccountPlanService) => {
  const response = await Api.post<IAccountPlan>("/account-plan", data);
  return response.data;
};


export const updateAccountPlanService = async (data: IUpdateAccountPlanService) => {
  const response = await Api.put<IAccountPlan>(
    `/account-plan/${data.id}`,
    data
  );
  return response.data;
};


export const removeAccountPlanService = async (data: IRemoveAccountPlanService) => {
  const response = await Api.delete<IAccountPlan>(
    `/account-plan/${data.id}/${data.type}`
  );
  return response.data;
};
