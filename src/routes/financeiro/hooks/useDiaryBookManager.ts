import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createDiaryBookService,
  findAllDiaryBooksService,
  updateDiaryBookService,
  removeDiaryBookService,
  getAccountPlanService,
} from "../../../stores/financeiro/financeiro.service";
import {
  IDiaryBook,
  IGetAccountPlanService,
} from "../../../stores/financeiro/financeiro.interface";
import { getAll as getAllUsers } from "../../../stores/usuarios/service";
import { IUser } from "../../../stores/usuarios/interface";
import { getAllConstruction } from "../../../stores/obras/service";
import { IObrasTable } from "../../../stores/obras/interface";

import {
  diaryBookFormSchema,
  DiaryBookFormData,
} from "../utils/diaryBookValidation";
import { parseMoneyValue } from "../utils/diaryBookHelpers";
import Helpers from "../../../utils/helper";

export const useDiaryBookManager = () => {
  const toast = useToast();

  // Estados principais
  const [loading, setLoading] = useState<boolean>(false);
  const [diaryBooks, setDiaryBooks] = useState<IDiaryBook[]>([]);
  const [currentDiaryBook, setCurrentDiaryBook] = useState<IDiaryBook>(
    {} as IDiaryBook
  );
  const [searchTerm, setSearchTerm] = useState("");

  // Estados para dados auxiliares
  const [accountPlanData, setAccountPlanData] =
    useState<IGetAccountPlanService>({
      groups: [],
      subgroups: [],
      categories: [],
    });
  const [users, setUsers] = useState<IUser[]>([]);
  const [constructions, setConstructions] = useState<IObrasTable[]>([]);

  // Estados para seleções hierárquicas
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [selectedSubgroup, setSelectedSubgroup] = useState<string>("");

  // Configuração do formulário
  const formMethods = useForm<DiaryBookFormData>({
    resolver: zodResolver(diaryBookFormSchema),
    shouldFocusError: false,
  });

  const { setValue, reset } = formMethods;

  // Carregar dados iniciais
  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [
        diaryBooksResponse,
        accountPlanResponse,
        usersResponse,
        constructionsResponse,
      ] = await Promise.all([
        findAllDiaryBooksService(),
        getAccountPlanService(),
        getAllUsers(),
        getAllConstruction(),
      ]);

      setDiaryBooks(diaryBooksResponse);
      setAccountPlanData(accountPlanResponse);
      setUsers(usersResponse);
      setConstructions(constructionsResponse);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar dados",
        description: error?.response?.data?.message || "Erro desconhecido",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Preencher formulário para edição
  const populateFormForEdit = (diaryBook: IDiaryBook) => {
    if (!diaryBook._id) {
      clearForm();
      return;
    }

    setValue("_id", diaryBook._id);
    setValue("date", Helpers.toViewDate2(diaryBook.date?.toString() || ""));
    setValue(
      "type",
      diaryBook.type as "receita" | "despesa" | "custo" | "investimento"
    );
    setValue("group", diaryBook.group);
    setValue("subgroup", diaryBook.subgroup);
    setValue("category", diaryBook.category || "");
    setValue("employee", diaryBook.employee || "");
    setValue("construction", diaryBook.construction || "");
    setValue("observation", diaryBook.observation || "");
    setValue("bankAccount", diaryBook.bankAccount);
    setValue(
      "value",
      diaryBook.value
        ? `R$ ${diaryBook.value.toFixed(2).replace(".", ",")}`
        : ""
    );
    setValue(
      "balance",
      diaryBook.balance
        ? `R$ ${diaryBook.balance.toFixed(2).replace(".", ",")}`
        : ""
    );
    setValue("month", diaryBook.month);

    // Definir seleções para controle dinâmico
    setSelectedType(diaryBook.type);
    setSelectedGroup(diaryBook.group);
    setSelectedSubgroup(diaryBook.subgroup);
  };

  // Limpar formulário e seleções
  const clearForm = () => {
    reset();
    setSelectedType("");
    setSelectedGroup("");
    setSelectedSubgroup("");
  };

  // Operações CRUD
  const createDiaryBook = async (data: DiaryBookFormData) => {
    try {
      // Validação adicional
      if (
        !data.type ||
        !data.group ||
        !data.subgroup ||
        !data.bankAccount ||
        !data.value ||
        !data.balance
      ) {
        toast({
          title: "Erro de validação",
          description: "Por favor, preencha todos os campos obrigatórios",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      const formattedData = {
        ...data,
        category: data.category || undefined,
        date: new Date(data.date),
        value: parseMoneyValue(data.value),
        balance: parseMoneyValue(data.balance),
        month: new Date(data.date).getMonth() + 1,
      };

      const response = await createDiaryBookService(formattedData);
      setDiaryBooks((prev) => [...prev, response]);
      clearForm();

      toast({
        title: "Entrada criada com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: error?.response?.data?.message || "Erro ao criar entrada!",
        description:
          error?.response?.data?.details ||
          "Verifique os dados e tente novamente",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const updateDiaryBook = async (data: DiaryBookFormData) => {
    try {
      const formattedData = {
        ...data,
        date: new Date(data.date),
        value: parseMoneyValue(data.value),
        balance: parseMoneyValue(data.balance),
        month: new Date(data.date).getMonth() + 1,
      };

      await updateDiaryBookService(data._id!, formattedData);
      const updatedDiaryBooks = await findAllDiaryBooksService();
      setDiaryBooks(updatedDiaryBooks);
      setCurrentDiaryBook({} as IDiaryBook);
      reset();

      toast({
        title: "Entrada editada com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: error?.response?.data?.message || "Erro ao editar entrada!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const deleteDiaryBook = async (id: string) => {
    try {
      await removeDiaryBookService(id);
      setDiaryBooks((prev) => prev.filter((book) => book._id !== id));

      toast({
        title: "Entrada removida com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: error?.response?.data?.message || "Erro ao remover entrada!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Carregar dados na inicialização
  useEffect(() => {
    loadInitialData();
  }, []);

  // Atualizar formulário quando currentDiaryBook mudar
  useEffect(() => {
    populateFormForEdit(currentDiaryBook);
  }, [currentDiaryBook, setValue]);

  return {
    // Estados
    loading,
    diaryBooks,
    currentDiaryBook,
    setCurrentDiaryBook,
    searchTerm,
    setSearchTerm,
    accountPlanData,
    users,
    constructions,
    selectedType,
    setSelectedType,
    selectedGroup,
    setSelectedGroup,
    selectedSubgroup,
    setSelectedSubgroup,

    // Métodos do formulário
    formMethods,
    clearForm,

    // Operações CRUD
    createDiaryBook,
    updateDiaryBook,
    deleteDiaryBook,
  };
};
