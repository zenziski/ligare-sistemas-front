import { z } from "zod";

export const schema = z.object({
    _id: z.string(),
    year: z.number(),
    month: z.number(),
    day: z.number(),
    registration: z.date(),
    saldo: z.number(),
    type: z.string(),
    user: z.string(),
    isPending: z.boolean(),
    isCorrected: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type IPonto = z.infer<typeof schema>;