import { SettingsIcon } from "@chakra-ui/icons"
import DrawerComponent from "../../../components/Drawer"
import { AbsoluteCenter, Box, Divider, FormControl, FormLabel, Grid, Input, InputGroup, Select, Text, useToast } from "@chakra-ui/react"
import { Controller, useForm } from "react-hook-form"
import { obraSchema, IObrasTable } from "../../../stores/obras/interface"
import { zodResolver } from "@hookform/resolvers/zod"
import { IUserTable } from "../../../stores/clientes/interface"
import { useEffect, useState } from "react"
import { getAll } from "../../../stores/clientes/service"
import MoneyInput from "../../../components/MoneyInput"

interface ConfigurarObraProps {
    data: any
}

const ConfigurarObra = ({
    data
}: ConfigurarObraProps) => {

    console.log(data);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        control,
        setValue,
        watch,
    } = useForm<IObrasTable>({
        shouldFocusError: false,
        resolver: zodResolver(obraSchema)
    })

    const toast = useToast()
    const [clientes, setClientes] = useState<IUserTable[]>([])

    const contractValue = parseFloat(watch('contract.value')?.toString()?.replace("R$ ", "")?.replace(/\./g, "")?.replace(",", ".") || "0")
    const contractInstallments = parseFloat(watch('contract.installments')?.toString() || "0")

    const administrationValue = parseFloat(watch('administration.value')?.toString()?.replace("R$ ", "")?.replace(/\./g, "")?.replace(",", ".") || "0")
    const administrationInstallments = parseFloat(watch('administration.installments')?.toString() || "0")

    const contractMonthlyValue = (contractValue / contractInstallments).toFixed(2)
    const administrationMonthlyValue = (administrationValue / administrationInstallments).toFixed(2)

    useEffect(() => {
        const fetch = async () => {
            const clientes = await getAll()
            setClientes(clientes)
        }
        fetch()
    }, [])

    return (
        <>
            <DrawerComponent
                isButton
                buttonIcon={<SettingsIcon />}
                buttonText="Configurar"
                headerText="Configurar Obra"
                buttonColorScheme="blue"
                size="md"
            >
                <Grid
                    templateColumns="repeat(2, 1fr)"
                    gap={4}
                    p={4}
                    fontFamily={'Poppins-Regular'}
                >
                    <FormControl
                        gridColumn={'span 2'}
                    >
                        <FormLabel>Nome da Obra</FormLabel>
                        <Input
                            placeholder="Nome da Obra"
                            size="md"
                            variant="outline"
                            {...register('name')}
                        />
                        {errors.name && <Text color="red.500" fontSize="xs">{errors.name.message}</Text>}
                    </FormControl>
                    <FormControl
                        gridColumn={'span 2'}
                    >
                        <FormLabel>Endereço da Obra</FormLabel>
                        <Input
                            placeholder="Endereço da Obra"
                            size="md"
                            variant="outline"
                            {...register('constructionAddress')}
                        />
                        {errors.constructionAddress && <Text color="red.500" fontSize="xs">{errors.constructionAddress.message}</Text>}
                    </FormControl>
                    <FormControl
                        gridColumn={'span 2'}
                    >
                        <FormLabel>Cliente</FormLabel>
                        <Controller
                            name="customerId"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <Select {...field}>
                                    {clientes.map((cliente, index) => (
                                        <option key={index} value={cliente._id}>{cliente.name}</option>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.customerId && <Text color="red">{errors.customerId.message}</Text>}
                    </FormControl>
                    <Box position='relative' gridColumn="span 2" >
                        <Divider
                            borderColor={'gray.500'}
                        />
                        <AbsoluteCenter bg='white' px='4'>
                            Administração
                        </AbsoluteCenter>
                    </Box>
                    <FormControl gridColumn="span 2">
                        <FormLabel>Contrato</FormLabel>
                        <InputGroup>
                            <MoneyInput
                                control={control}
                                name="administration.value"
                                defaultValue={null}
                            />
                        </InputGroup>
                        {
                            errors.administration?.value && <Text color="red">{
                                errors.administration?.value.message}</Text>}
                    </FormControl>
                    <FormControl>
                        <FormLabel>Parcelas</FormLabel>
                        <Input {...register("administration.installments")} type="number" placeholder="Digite..." />
                        {
                            errors.administration?.installments && <Text color="red">{
                                errors.administration?.installments.message}</Text>}
                    </FormControl>
                    <FormControl>
                        <FormLabel>Valor Mensal</FormLabel>
                        <Input value={`R$ ${administrationMonthlyValue}`} placeholder="R$" readOnly={true} />
                        {
                            errors.administration?.installments && <Text color="red">{
                                errors.administration?.installments.message}</Text>}
                    </FormControl>
                    <Box position='relative' gridColumn="span 2" >
                        <Divider
                            borderColor={'gray.500'}
                        />
                        <AbsoluteCenter bg='white' px='4'>
                            Empreitada
                        </AbsoluteCenter>
                    </Box>
                    <FormControl gridColumn="span 2">
                        <FormLabel>Contrato</FormLabel>
                        <MoneyInput
                            control={control}
                            name="contract.value"
                            defaultValue={null}
                        />
                        {
                            errors.contract?.value && <Text color="red">{
                                errors.contract?.value.message}</Text>}
                    </FormControl>
                    <FormControl>
                        <FormLabel>Parcelas</FormLabel>
                        <Input {...register("contract.installments")} type="number" placeholder="Digite..." />
                        {
                            errors.contract?.installments && <Text color="red">{
                                errors.contract?.installments.message}</Text>}
                    </FormControl>
                    <FormControl>
                        <FormLabel>Valor Mensal</FormLabel>
                        <Input value={`R$ ${contractMonthlyValue}`} placeholder="R$" readOnly />
                        {
                            errors.contract?.installments && <Text color="red">{
                                errors.contract?.installments.message}</Text>}
                    </FormControl>
                    <Divider gridColumn="span 2" borderColor={'gray.500'} />
                    <FormControl>
                        <FormLabel>Extras (mão de obra)</FormLabel>
                        <Input {...register("extraLabor")} type="number" placeholder="Digite..." />
                        {
                            errors.extraLabor && <Text color="red">{
                                errors.extraLabor.message}</Text>}
                    </FormControl>
                    <FormControl>
                        <FormLabel>Extra (adm)</FormLabel>
                        <Input {...register("extraAdm")} placeholder="Digite..." />
                        {
                            errors.extraAdm && <Text color="red">{
                                errors.extraAdm.message}</Text>}
                    </FormControl>
                </Grid>
            </DrawerComponent>
        </>
    )
}

export default ConfigurarObra