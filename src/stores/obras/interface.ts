import { z } from "zod";

export const schema = z.object({
    _id: z.string().optional(),
    
});

export type IFornecedorTable = z.infer<typeof schema>


interface IObraTable {
    slug?: string;
    nomeObra: string;
    enderecoObra: string;
    formaContrato: string;
    parcelas: number;
    valorMensal: number;
}

interface IConfigTable {
    nome: string;
    dataCadastro: string;
}