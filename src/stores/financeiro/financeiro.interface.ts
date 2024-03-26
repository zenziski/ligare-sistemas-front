import { z } from "zod";

export const accountPlanSchema = z.object({
    _id: z.string().optional(),
    name: z.string(),
    type: z.string().optional(),
    parent: z.string().optional(),
    planType: z.string(),
});

export type IAccountPlan = z.infer<typeof accountPlanSchema>