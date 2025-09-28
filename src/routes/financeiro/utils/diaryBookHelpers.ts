/**
 * Utilitários para manipulação de valores monetários e busca de dados
 */

import { IGetAccountPlanService } from "../../../stores/financeiro/financeiro.interface";
import { IUser } from "../../../stores/usuarios/interface";
import { IObrasTable } from "../../../stores/obras/interface";

// Função para converter valor monetário string para number
export const parseMoneyValue = (value: string): number => {
  if (!value) return 0;

  // Remove R$, espaços e converte separadores
  const cleanValue = value
    .toString()
    .replace(/R\$\s?/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? 0 : parsed;
};

// Função para buscar nome seguro (sempre retorna string)
const getNameSafely = (item: any, fallback: string = ""): string => {
  if (!item) return fallback;
  return String(item.name || item._id || fallback);
};

// Funções para buscar nomes pelos IDs
export const createNameResolvers = (
  accountPlanData: IGetAccountPlanService,
  users: IUser[],
  constructions: IObrasTable[]
) => {
  return {
    getGroupName: (groupId: string): string => {
      if (!groupId) return "";
      const group = accountPlanData.groups.find((g) => g._id === groupId);
      return getNameSafely(group, groupId);
    },

    getSubgroupName: (subgroupId: string): string => {
      if (!subgroupId) return "";
      const subgroup = accountPlanData.subgroups.find(
        (s) => s._id === subgroupId
      );
      return getNameSafely(subgroup, subgroupId);
    },

    getCategoryName: (categoryId: string): string => {
      if (!categoryId) return "";
      const category = accountPlanData.categories.find(
        (c) => c._id === categoryId
      );
      return getNameSafely(category, categoryId);
    },

    getUserName: (userId: string): string => {
      if (!userId) return "";
      const user = users.find((u) => u._id === userId);
      return getNameSafely(user, userId);
    },

    getConstructionName: (constructionId: string): string => {
      if (!constructionId) return "";
      const construction = constructions.find((c) => c._id === constructionId);
      return getNameSafely(construction, constructionId);
    },
  };
};

// Mapeamento de tipos para o plano de contas
export const TYPE_MAPPING: { [key: string]: string } = {
  receita: "RECEITA",
  despesa: "DESPESA",
  custo: "CUSTO",
  investimento: "INVESTIMENTO",
};

// Função para obter esquema de cores por tipo
export const getTypeColorScheme = (type: string): string => {
  const colorMap: { [key: string]: string } = {
    receita: "green",
    despesa: "red",
    custo: "orange",
    investimento: "blue",
  };
  return colorMap[type] || "gray";
};
