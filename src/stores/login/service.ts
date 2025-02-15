import { Api } from "../../utils/api";
import { IUser } from "../usuarios/interface";

export const login = async (data: any) => {
    const response = await Api.post("/auth/login", data);
    return response.data;
}

export const me = async () => {
    const response = await Api.get<IUser>("/auth/me");
    return response.data;
}