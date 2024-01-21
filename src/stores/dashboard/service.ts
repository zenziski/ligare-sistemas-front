import { Api } from "../../utils/api";
import { DashboardState } from "./interface";

export const getDashboard = async () => {
    const response = await Api.get<DashboardState>("/dashboard");
    return response.data;
}