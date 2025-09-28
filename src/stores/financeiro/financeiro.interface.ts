import { z } from "zod";

export const accountPlanSchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  type: z.string().optional(),
  parent: z.string().optional(),
  planType: z.string(),
});

export type IAccountPlan = z.infer<typeof accountPlanSchema>;

export const CategrorySchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  subgroup: z.string(),
});

export type ICategory = z.infer<typeof CategrorySchema>;

export const groupSchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  type: z.string(),
});

export type IGroup = z.infer<typeof groupSchema>;

export const subGroupSchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  group: z.string(),
  description: z.string().optional(),
  contractor: z.boolean().optional(),
});

export type ISubGroup = z.infer<typeof subGroupSchema>;

export const getAccountPlanServiceSchema = z.object({
  groups: z.array(groupSchema),
  subgroups: z.array(subGroupSchema),
  categories: z.array(CategrorySchema),
});

export type IGetAccountPlanService = z.infer<
  typeof getAccountPlanServiceSchema
>;

// Interface para criação de grupo, subgrupo ou categoria
export const createAccountPlanServiceSchema = z.object({
  name: z.string(),
  type: z.enum(["group", "subgroup", "category"]),
  planType: z.string().optional(), // Para grupo
  parent: z.string().optional(),   // Para subgrupo/categoria
  description: z.string().optional(), // Para subgrupo
  contractor: z.boolean().optional(), // Para subgrupo
});

export type ICreateAccountPlanService = z.infer<typeof createAccountPlanServiceSchema>;

// Interface para atualização
export const updateAccountPlanServiceSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["group", "subgroup", "category"]),
  planType: z.string().optional(),
  parent: z.string().optional(),
  description: z.string().optional(),
  contractor: z.boolean().optional(),
});

export type IUpdateAccountPlanService = z.infer<typeof updateAccountPlanServiceSchema>;

// Interface para remoção
export const removeAccountPlanServiceSchema = z.object({
  id: z.string(),
  type: z.enum(["group", "subgroup", "category"]),
});

export type IRemoveAccountPlanService = z.infer<typeof removeAccountPlanServiceSchema>;

// DiaryBook interface - Livro Diário
export const diaryBookSchema = z.object({
  _id: z.string().optional(),
  date: z.date(),
  type: z.string(),
  group: z.string(),
  subgroup: z.string(),
  category: z.string().optional(),
  employee: z.string().optional(),
  construction: z.string().optional(),
  observation: z.string().optional(),
  bankAccount: z.string(),
  value: z.number(),
  balance: z.number(),
  month: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type IDiaryBook = z.infer<typeof diaryBookSchema>;