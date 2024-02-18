import { z } from "zod";

export const ConstructionDiarySchema = z.object({
    _id: z.string().optional(),
    item: z.string(),
    description: z.string(),
    supplier: z.object({
        _id: z.string().optional(),
        name: z.string().optional(),
        cpfCnpj: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
    }),
    nfNumber: z.string(),
    type: z.string(),
    value: z.string().optional().or(z.string().optional().transform(() => 0)).or(z.null().transform(() => 0)),
    status: z.string(),
    sendDate: z.string().optional(),
    paymentMethod: z.string(),
    paymentDate: z.string().optional(),
    observation: z.string().optional(),
    createdAt: z.date().optional().or(z.string().optional().transform(() => new Date())).or(z.null().transform(() => new Date())),
});

export type IConstructionDiary = z.infer<typeof ConstructionDiarySchema>

export const obraSchema = z.object({
    _id: z.string().optional(),
    name: z.string(),
    constructionAddress: z.string(),
    administration: z.object({
        value: z.string().optional().or(z.string().optional().transform(() => 0)).or(z.null().transform(() => 0)),
        installments: z.string().optional().or(z.string().optional().transform(() => 0)).or(z.null().transform(() => 0)),
        monthlyValue: z.string().optional().or(z.string().optional().transform(() => 0)).or(z.null().transform(() => 0)),
        percentage: z.string().optional().or(z.number().optional()).or(z.null().optional().transform(() => 0)),
    }).optional(),
    contract: z.object({
        value: z.string().optional().or(z.string().optional().transform(() => 0)).or(z.null().transform(() => 0)),
        installments: z.string().optional().or(z.string().optional().transform(() => 0)).or(z.null().transform(() => 0)),
        monthlyValue: z.string().optional().or(z.string().optional().transform(() => 0)).or(z.null().transform(() => 0)),
    }).optional(),
    constructionItems: z.array(z.string().optional()).optional(),
    extraLabor: z.string().optional().or(z.string().optional().transform(() => 0)).or(z.null().transform(() => 0)),
    extraAdm: z.string().optional().or(z.string().optional().transform(() => 0)).or(z.null().transform(() => 0)),
    builtArea: z.string().optional().or(z.string().optional().transform(() => 0)).or(z.null().transform(() => 0)),
    customerId: z.string(),
});

export type IObrasTable = z.infer<typeof obraSchema> & { diary: IConstructionDiary[] }

export const obraItemSchema = z.object({
    _id: z.string().optional(),
    name: z.string().min(1, { message: "Nome deve ter no mínimo 1 caractere" }),
    createdAt: z.string().optional(),
});

export type IObrasItem = z.infer<typeof obraItemSchema>

export const tiposLancamentoSchema = z.object({
    _id: z.string().optional(),
    name: z.string().min(1, { message: "Nome deve ter no mínimo 1 caractere" }),
    createdAt: z.string().optional(),
});

export type ITiposLancamento = z.infer<typeof obraItemSchema>

export enum ConstructionDiaryStatus {
    toPay = "À Pagar",
    paid = "Pago",
    sended = "Enviado"
}

export enum ConstructionDiaryPaymentMethod {
    pix = "Pix",
    boleto = "Boleto",
    cartao = "Cartão",
    transferencia = "Transferência",
}


