import { Api } from "../../utils/api";

export const login = async (data: any) => {
    const response = await Api.post("/auth/login", data);
    return response.data;
}