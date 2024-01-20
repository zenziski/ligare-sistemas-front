import { z } from "zod";

export const schema = z.object({
    _id: z.string().optional(),
    name: z.string().min(3, { message: "Nome deve ter no mínimo 3 caracteres" }),
    cpfCnpj: z.string(),
    email: z.string().email({ message: "Email inválido"}),
    phone: z.string()
});

export type IFornecedorTable = z.infer<typeof schema>