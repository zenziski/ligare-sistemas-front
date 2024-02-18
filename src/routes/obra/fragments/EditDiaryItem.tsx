import { EditIcon } from "@chakra-ui/icons"
import DrawerComponent from "../../../components/Drawer"
import { ConstructionDiarySchema, IConstructionDiary, IObrasItem, ITiposLancamento } from "../../../stores/obras/interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Grid, FormControl, FormLabel, Input, Text, InputGroup, Select, useToast } from "@chakra-ui/react";
import MoneyInput from "../../../components/MoneyInput";
import { useEffect } from "react";
import { IFornecedorTable } from "../../../stores/fornecedores/interface";
import { editConstructionDiary } from "../../../stores/obras/service";
import Helpers from "../../../utils/helper";

const EditDiaryItem = ({
    id,
    flushHook,
    refresh,
    item,
    fornecedores,
    entryType,
    constructionItems
}: { id: string, flushHook: any, refresh: boolean, item: IConstructionDiary, fornecedores: IFornecedorTable[], entryType: ITiposLancamento[], constructionItems: IObrasItem[] }) => {
    const toast = useToast()
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        control,
    } = useForm<IConstructionDiary>({
        resolver: zodResolver(ConstructionDiarySchema),
        shouldFocusError: false
    });

    useEffect(() => {
        if (item) {
            reset({
                ...item,
                sendDate: item.sendDate ? item.sendDate?.split('T')[0] : "",
                paymentDate: item.paymentDate ? item.paymentDate?.split('T')[0] : "",
                value: Helpers.toBrazilianCurrency(item?.value)
            });
        }
    }, [item])

    const handleEditItem = async (data: IConstructionDiary) => {
        try {
            console.log(data);
            const value = data.value?.toString()?.replace("R$", "")?.replace(" ", "")?.replace(" ", "")?.replace(/\./g, "")?.replace(",", ".");
            await editConstructionDiary(id, item._id!, {
                ...data,
                supplier: data.supplier._id,
                value: parseFloat(value || "0")
            });
            toast({
                title: "Item adicionado com sucesso",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top-right"
            })
            reset();
            flushHook(!refresh);
        } catch (error) {
            toast({
                title: "Erro ao adicionar item",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top-right"
            })
            console.log(error);
        }
    }

    return (
        <DrawerComponent
            buttonIcon={<EditIcon />}
            buttonText="Editar"
            headerText="Editar item do diário de obra"
            size="lg"
            onAction={() => handleSubmit(handleEditItem)()}
            isLoading={isSubmitting}
        >
            <Grid templateColumns="repeat(2, 1fr)" gap={6} fontFamily="Poppins-Regular">
                <FormControl gridColumn="span 2">
                    <FormLabel>Descrição</FormLabel>
                    <Input {...register("description")} placeholder="Cimento" />
                    {errors.description && <Text color="red.500">{errors.description.message}</Text>}
                </FormControl>
                <FormControl gridColumn="span 2">
                    <FormLabel>Fornecedor</FormLabel>
                    <Controller
                        name="supplier._id"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <Select defaultValue="" {...field}>
                                <option disabled key={1} value="">Selecione o fornecedor</option>
                                {fornecedores.sort((a, b) => a.name.localeCompare(b.name)).map((fornecedor) => {
                                    return (
                                        <option key={fornecedor._id} value={fornecedor._id}>{fornecedor.name}</option>
                                    )
                                })}
                            </Select>
                        )}
                    />
                    {errors.description && <Text color="red.500">{errors.description.message}</Text>}
                </FormControl>
                <FormControl>
                    <FormLabel>Valor</FormLabel>
                    <InputGroup>
                        <MoneyInput
                            control={control}
                            name="value"
                            defaultValue={null}
                        />
                    </InputGroup>
                    {errors.value && <Text color="red.500">{errors.value.message}</Text>}
                </FormControl>
                <FormControl>
                    <FormLabel>Número da NF</FormLabel>
                    <Input {...register("nfNumber")} placeholder="123" />
                    {errors.nfNumber && <Text color="red.500">{errors.nfNumber.message}</Text>}
                </FormControl>
                <FormControl>
                    <FormLabel>Item</FormLabel>
                    <Controller
                        name="item"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <Select defaultValue="" {...field}>
                                <option disabled key={1} value="">Selecione o item</option>
                                {constructionItems.map((item) => {
                                    return (
                                        <option key={item._id} value={item.name}>{item.name}</option>
                                    )
                                })}
                            </Select>
                        )}
                    />
                    {errors.item && <Text color="red.500">{errors.item.message}</Text>}
                </FormControl>
                <FormControl>
                    <FormLabel>Tipo</FormLabel>
                    <Controller
                        name="type"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <Select defaultValue="" {...field}>
                                <option disabled key={1} value="">Selecione o tipo</option>
                                {entryType.map((item) => {
                                    return (
                                        <option key={item._id} value={item.name}>{item.name}</option>
                                    )
                                })}
                            </Select>
                        )}
                    />
                    {errors.type && <Text color="red.500">{errors.type.message}</Text>}
                </FormControl>

                <FormControl>
                    <FormLabel>Status</FormLabel>
                    <Controller
                        name="status"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <Select defaultValue="" {...field}>
                                <option disabled key={0} value="">Selecione o status</option>
                                <option key={1} value="paid">Pago</option>
                                <option key={2} value="toPay">À pagar</option>
                                <option key={3} value="sended">Enviado</option>
                            </Select>
                        )}
                    />
                    {errors.status && <Text color="red.500">{errors.status.message}</Text>}
                </FormControl>
                <FormControl>
                    <FormLabel>Forma de pagamento</FormLabel>
                    <Controller
                        name="paymentMethod"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <Select defaultValue="" {...field}>
                                <option disabled key={0} value="">Selecione o método</option>
                                <option key={1} value="pix">PIX</option>
                                <option key={2} value="boleto">Boleto</option>
                                <option key={3} value="cartao">Cartão</option>
                                <option key={4} value="transferencia">Transfêrencia bancária</option>
                            </Select>
                        )}
                    />
                    {errors.paymentMethod && <Text color="red.500">{errors.paymentMethod.message}</Text>}
                </FormControl>
                <FormControl gridColumn="span 2">
                    <FormLabel>Data de envio</FormLabel>
                    <Input {...register("sendDate")} type="date" />
                    {errors.sendDate && <Text color="red.500">{errors.sendDate.message}</Text>}
                </FormControl>
                <FormControl gridColumn="span 2">
                    <FormLabel>Data de pagamento</FormLabel>
                    <Input {...register("paymentDate")} type="date" />
                    {errors.paymentDate && <Text color="red.500">{errors.paymentDate.message}</Text>}
                </FormControl>
                <FormControl gridColumn="span 2">
                    <FormLabel>Observação</FormLabel>
                    <Input {...register("observation")} placeholder="Digite aqui a observação" />
                    {errors.observation && <Text color="red.500">{errors.observation.message}</Text>}
                </FormControl>
            </Grid>
        </DrawerComponent>
    )
}

export default EditDiaryItem