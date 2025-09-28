import { z } from "zod";

// Função utilitária para validar valores monetários
const validateMoneyValue = (val: string, required: boolean = true) => {
  if (!required && !val) return true;

  const cleaned = val
    .replace(/R\$\s?/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const parsedValue = parseFloat(cleaned);
  return !isNaN(parsedValue) && (required ? parsedValue > 0 : true);
};

// Schema de validação para o formulário do Livro Diário
export const diaryBookFormSchema = z.object({
  _id: z.string().optional(),
  date: z.string().min(1, "Data é obrigatória"),
  type: z.enum(["receita", "despesa", "custo", "investimento"], {
    errorMap: () => ({ message: "Tipo é obrigatório" }),
  }),
  group: z.string().min(1, "Grupo é obrigatório"),
  subgroup: z.string().min(1, "Subgrupo é obrigatório"),
  category: z.string().optional(),
  employee: z.string().optional(),
  construction: z.string().optional(),
  observation: z.string().optional(),
  bankAccount: z.string().min(1, "Conta bancária é obrigatória"),
  value: z
    .string()
    .min(1, "Valor é obrigatório")
    .refine((val) => validateMoneyValue(val, true), {
      message: "Valor deve ser um número válido maior que zero",
    }),
  balance: z
    .string()
    .min(1, "Saldo é obrigatório")
    .refine((val) => validateMoneyValue(val, false), {
      message: "Saldo deve ser um número válido",
    }),
  month: z.number().min(1).max(12).optional(),
});

export type DiaryBookFormData = z.infer<typeof diaryBookFormSchema>;
