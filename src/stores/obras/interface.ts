import { z } from "zod";

export const obraSchema = z.object({
    _id: z.string().optional(),
    name: z.string(),
    constructionAddress: z.string(),
    administration: z.object({
        value: z.number().optional().or(z.string().optional().transform(() => 0)).or(z.null().transform(() => 0)),
        installments: z.number().optional().or(z.string().optional().transform(() => 0)).or(z.null().transform(() => 0)),
        monthlyValue: z.number().optional().or(z.string().optional().transform(() => 0)).or(z.null().transform(() => 0)),
    }).optional(),
    contract: z.object({
        value: z.number().optional().or(z.string().optional().transform(() => 0)).or(z.null().transform(() => 0)),
        installments: z.number().optional().or(z.string().optional().transform(() => 0)).or(z.null().transform(() => 0)),
        monthlyValue: z.number().optional().or(z.string().optional().transform(() => 0)).or(z.null().transform(() => 0)),
    }).optional(),
    constructionItems: z.array(z.string().optional()).optional(),
    extraLabor: z.number().optional().or(z.string().optional().transform(() => 0)).or(z.null().transform(() => 0)),
    extraAdm: z.number().optional().or(z.string().optional().transform(() => 0)).or(z.null().transform(() => 0)),
    builtArea: z.number().optional().or(z.string().optional().transform(() => 0)).or(z.null().transform(() => 0)),
    customerId: z.string(),
});

export type IObrasTable = z.infer<typeof obraSchema>

export const obraItemSchema = z.object({
    _id: z.string().optional(),
    name: z.string(),
});

export type IObrasItem = z.infer<typeof obraItemSchema>