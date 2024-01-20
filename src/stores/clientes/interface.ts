import { z } from "zod";

export const schema = z.object({
    _id: z.string().optional(),
    name: z.string().min(3, { message: "Nome deve ter no mínimo 3 caracteres" }),
    cpf: z.string().min(11, { message: "CPF inválido" }),
    rg: z.string(),
    email: z.string().email({ message: "Email inválido" }),
    birthDate: z.string(),
    billingAdress: z.string(),
});

export type IUserTable = z.infer<typeof schema>;