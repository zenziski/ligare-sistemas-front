import { Api } from "../../utils/api";
import {
  IAccountPlan,
  IGetAccountPlanService,
  ICreateAccountPlanService,
  IUpdateAccountPlanService,
  IRemoveAccountPlanService,
  IDiaryBook,
} from "./financeiro.interface";

export const getAccountPlanService: () => Promise<IGetAccountPlanService> =
  async () => {
    const response = await Api.get("/account-plan");
    return response.data;
  };

export const createAccountPlanService = async (
  data: ICreateAccountPlanService
) => {
  const response = await Api.post<IAccountPlan>("/account-plan", data);
  return response.data;
};

export const updateAccountPlanService = async (
  data: IUpdateAccountPlanService
) => {
  const response = await Api.put<IAccountPlan>(
    `/account-plan/${data.id}`,
    data
  );
  return response.data;
};

export const removeAccountPlanService = async (
  data: IRemoveAccountPlanService
) => {
  const response = await Api.delete<IAccountPlan>(
    `/account-plan/${data.id}/${data.type}`
  );
  return response.data;
};

// DiaryBook Services - Livro Diário
export const createDiaryBookService = async (
  data: Partial<IDiaryBook>
): Promise<IDiaryBook> => {
  const response = await Api.post<IDiaryBook>("/diary-book", data);
  return response.data;
};

export const findAllDiaryBooksService = async (): Promise<IDiaryBook[]> => {
  const response = await Api.get<IDiaryBook[]>("/diary-book");
  return response.data;
};

export const findOneDiaryBookService = async (
  id: string
): Promise<IDiaryBook> => {
  const response = await Api.get<IDiaryBook>(`/diary-book/${id}`);
  return response.data;
};

export const updateDiaryBookService = async (
  id: string,
  data: Partial<IDiaryBook>
): Promise<IDiaryBook> => {
  const response = await Api.put<IDiaryBook>(`/diary-book/${id}`, data);
  return response.data;
};

export const removeDiaryBookService = async (
  id: string
): Promise<{ deleted: boolean }> => {
  const response = await Api.delete<{ deleted: boolean }>(`/diary-book/${id}`);
  return response.data;
};
