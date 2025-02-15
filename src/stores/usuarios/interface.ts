import { z } from "zod";

export const schema = z.object({
    _id: z.string().optional(),
    name: z.string().min(3, { message: "Nome deve ter no mínimo 3 caracteres" }),
    email: z.string().email({ message: "Email inválido" }),
    password: z.string().min(3, { message: "Senha deve ter no mínimo 3 caracteres" }).optional(),
    confirmPassword: z.string().min(3, { message: "Senha deve ter no mínimo 3 caracteres" }).optional(),
    phoneNumber: z.string(),
    birthDate: z.string().optional(),
    admissionDate: z.string().optional(),
    hoursToWork: z.union([z.string(), z.number()]) // Aceita string ou number
        .transform((val) => {
            // Converte para número se for uma string
            if (typeof val === "string") {
                return parseFloat(val);
            }
            return val;
        })
        .refine((val) => !isNaN(val), { message: "hoursToWork deve ser um número válido" }) // Garante que é um número válido
        .optional(),
    roles: z.object({
        admin: z.boolean()
    }).optional(),
});

export type IUser = z.infer<typeof schema>;