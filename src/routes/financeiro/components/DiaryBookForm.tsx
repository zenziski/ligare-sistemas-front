/**
 * Componente para renderizar o formulário do Livro Diário
 * Isolado do componente principal para melhor organização
 */

import React from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Grid,
  Textarea,
  Text,
} from "@chakra-ui/react";
import { Controller, Control, FieldErrors } from "react-hook-form";
import MoneyInput from "../../../components/MoneyInput";
import { DiaryBookFormData } from "../utils/diaryBookValidation";
import { IGetAccountPlanService } from "../../../stores/financeiro/financeiro.interface";
import { IUser } from "../../../stores/usuarios/interface";
import { IObrasTable } from "../../../stores/obras/interface";
import { TYPE_MAPPING } from "../utils/diaryBookHelpers";

interface DiaryBookFormProps {
  control: Control<DiaryBookFormData>;
  register: any;
  errors: FieldErrors<DiaryBookFormData>;
  setValue: (name: keyof DiaryBookFormData, value: any) => void;

  // Dados para os selects
  accountPlanData: IGetAccountPlanService;
  users: IUser[];
  constructions: IObrasTable[];

  // Estados de seleção hierárquica
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedGroup: string;
  setSelectedGroup: (group: string) => void;
  selectedSubgroup: string;
  setSelectedSubgroup: (subgroup: string) => void;
}

export const DiaryBookForm: React.FC<DiaryBookFormProps> = ({
  control,
  register,
  errors,
  setValue,
  accountPlanData,
  users,
  constructions,
  selectedType,
  setSelectedType,
  selectedGroup,
  setSelectedGroup,
  selectedSubgroup,
  setSelectedSubgroup,
}) => {
  // Funções para filtrar dados baseado na seleção hierárquica
  const getAvailableGroups = () => {
    if (!selectedType) return [];
    const planType = TYPE_MAPPING[selectedType];
    return accountPlanData.groups.filter((group) => group.type === planType);
  };

  const getAvailableSubgroups = () => {
    if (!selectedGroup) return [];
    return accountPlanData.subgroups.filter(
      (subgroup) => subgroup.group === selectedGroup
    );
  };

  const getAvailableCategories = () => {
    if (!selectedSubgroup) return [];
    return accountPlanData.categories.filter(
      (category) => category.subgroup === selectedSubgroup
    );
  };

  // Handlers para mudanças nas seleções
  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    setValue("group", "");
    setValue("subgroup", "");
    setValue("category", "");
    setSelectedGroup("");
    setSelectedSubgroup("");
  };

  const handleGroupChange = (value: string) => {
    setSelectedGroup(value);
    setValue("subgroup", "");
    setValue("category", "");
    setSelectedSubgroup("");
  };

  const handleSubgroupChange = (value: string) => {
    setSelectedSubgroup(value);
    setValue("category", "");
  };

  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
      {/* Data */}
      <FormControl>
        <FormLabel fontWeight="medium" color="gray.700">
          Data
        </FormLabel>
        <Input {...register("date")} type="date" focusBorderColor="blue.400" />
        {errors.date && (
          <Text color="red.500" fontSize="sm">
            {errors.date.message}
          </Text>
        )}
      </FormControl>

      {/* Tipo */}
      <FormControl>
        <FormLabel fontWeight="medium" color="gray.700">
          Tipo
        </FormLabel>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              placeholder="Selecione o tipo"
              onChange={(e) => {
                field.onChange(e);
                handleTypeChange(e.target.value);
              }}
            >
              <option value="receita">Receita</option>
              <option value="despesa">Despesa</option>
              <option value="custo">Custo</option>
              <option value="investimento">Investimento</option>
            </Select>
          )}
        />
        {errors.type && (
          <Text color="red.500" fontSize="sm">
            {errors.type.message}
          </Text>
        )}
      </FormControl>

      {/* Grupo */}
      <FormControl>
        <FormLabel fontWeight="medium" color="gray.700">
          Grupo
        </FormLabel>
        <Controller
          name="group"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              placeholder="Selecione o grupo"
              isDisabled={!selectedType}
              onChange={(e) => {
                field.onChange(e);
                handleGroupChange(e.target.value);
              }}
            >
              {getAvailableGroups().map((group) => (
                <option key={group._id} value={group._id}>
                  {group.name}
                </option>
              ))}
            </Select>
          )}
        />
        {errors.group && (
          <Text color="red.500" fontSize="sm">
            {errors.group.message}
          </Text>
        )}
      </FormControl>

      {/* Subgrupo */}
      <FormControl>
        <FormLabel fontWeight="medium" color="gray.700">
          Subgrupo
        </FormLabel>
        <Controller
          name="subgroup"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              placeholder="Selecione o subgrupo"
              isDisabled={!selectedGroup}
              onChange={(e) => {
                field.onChange(e);
                handleSubgroupChange(e.target.value);
              }}
            >
              {getAvailableSubgroups().map((subgroup) => (
                <option key={subgroup._id} value={subgroup._id}>
                  {subgroup.name}
                </option>
              ))}
            </Select>
          )}
        />
        {errors.subgroup && (
          <Text color="red.500" fontSize="sm">
            {errors.subgroup.message}
          </Text>
        )}
      </FormControl>

      {/* Categoria */}
      <FormControl>
        <FormLabel fontWeight="medium" color="gray.700">
          Categoria
        </FormLabel>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              placeholder="Selecione a categoria (opcional)"
              isDisabled={!selectedSubgroup}
            >
              {getAvailableCategories().map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </Select>
          )}
        />
      </FormControl>

      {/* Funcionário */}
      <FormControl>
        <FormLabel fontWeight="medium" color="gray.700">
          Funcionário
        </FormLabel>
        <Controller
          name="employee"
          control={control}
          render={({ field }) => (
            <Select {...field} placeholder="Selecione o funcionário (opcional)">
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </Select>
          )}
        />
      </FormControl>

      {/* Obra */}
      <FormControl>
        <FormLabel fontWeight="medium" color="gray.700">
          Obra
        </FormLabel>
        <Controller
          name="construction"
          control={control}
          render={({ field }) => (
            <Select {...field} placeholder="Selecione a obra (opcional)">
              {constructions.map((construction) => (
                <option key={construction._id} value={construction._id}>
                  {construction.name}
                </option>
              ))}
            </Select>
          )}
        />
      </FormControl>

      {/* Conta Bancária */}
      <FormControl>
        <FormLabel fontWeight="medium" color="gray.700">
          Conta Bancária
        </FormLabel>
        <Input
          {...register("bankAccount")}
          placeholder="Ex: Conta Corrente, Poupança"
          focusBorderColor="blue.400"
        />
        {errors.bankAccount && (
          <Text color="red.500" fontSize="sm">
            {errors.bankAccount.message}
          </Text>
        )}
      </FormControl>

      {/* Valor */}
      <FormControl>
        <FormLabel fontWeight="medium" color="gray.700">
          Valor
        </FormLabel>
        <MoneyInput control={control} name="value" defaultValue={null} />
        {errors.value && (
          <Text color="red.500" fontSize="sm">
            {errors.value.message}
          </Text>
        )}
      </FormControl>

      {/* Saldo */}
      <FormControl>
        <FormLabel fontWeight="medium" color="gray.700">
          Saldo
        </FormLabel>
        <MoneyInput control={control} name="balance" defaultValue={null} />
        {errors.balance && (
          <Text color="red.500" fontSize="sm">
            {errors.balance.message}
          </Text>
        )}
      </FormControl>

      {/* Observação */}
      <FormControl gridColumn="span 2">
        <FormLabel fontWeight="medium" color="gray.700">
          Observação
        </FormLabel>
        <Textarea
          {...register("observation")}
          placeholder="Observações adicionais (opcional)"
          focusBorderColor="blue.400"
          rows={3}
        />
      </FormControl>
    </Grid>
  );
};
