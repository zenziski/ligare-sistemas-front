import { AddIcon, EditIcon, CloseIcon } from "@chakra-ui/icons"
import { Flex, FormControl, FormLabel, Input, Table, Thead, Tr, Th, Tbody, Td, IconButton, Text, Select } from "@chakra-ui/react"
import DrawerComponent from "../../../components/Drawer"
import { IAccountPlan } from "../../../stores/financeiro/financeiro.interface"
import { useState } from "react"
import { useToast } from "@chakra-ui/react"
import { createAccountPlanService } from "../../../stores/financeiro/financeiro.service"

export type Type = "group" | "subgroup" | "category"
export type TabType = "receita" | "despesa" | "custo" | "investimento"

interface ListProps {
    type: Type;
    tab: TabType;
    data: any;
}

export const List = ({ type, tab, data }: ListProps) => {
    const header = {
        group: {
            title: "Grupos",
            add: "Adicionar grupo"
        },
        subgroup: {
            title: "Subgrupos",
            add: "Adicionar subgrupo"
        },
        category: {
            title: "Categorias",
            add: "Adicionar categoria"
        }
    }

    const toast = useToast()

    const [loading, setLoading] = useState<boolean>(false)
    const [accountPlan, setAccountPlan] = useState<IAccountPlan>({
        name: "",
        planType: tab.toUpperCase(),
        type: type,
        parent: "",
        _id: ""
    })

    const handleCreate = async (data: IAccountPlan) => {
        setLoading(true)
        try {
            console.log(data);
            await createAccountPlanService(data)
            toast({
                title: "Grupo criado",
                description: "Grupo criado com sucesso",
                status: "success",
                duration: 9000,
                isClosable: true,
            })
            setAccountPlan({
                name: "",
                planType: tab.toUpperCase(),
                type: type,
                parent: "",
                _id: ""
            })
        } catch (error) {
            console.log(error)
            toast({
                title: "Erro ao criar",
                description: "Não foi possível criar o grupo",
                status: "error",
                duration: 9000,
                isClosable: true,
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Flex direction="row" mb="15px" justifyContent="space-between">
                <Text fontSize="2xl">
                    {
                        header[type].title
                    }
                </Text>
                <Flex>
                    <DrawerComponent
                        headerText={header[type].add}
                        buttonIcon={<AddIcon />}
                        onAction={() => handleCreate(accountPlan)}
                        isLoading={loading}
                    >
                        <Flex direction="column" p={5} gap={4}>
                            {type === "group" && (
                                <FormControl id="group">
                                    <FormLabel>Nome</FormLabel>
                                    <Input type="text"
                                        value={accountPlan.name}
                                        onChange={(e) => setAccountPlan({ ...accountPlan, name: e.target.value })} />
                                </FormControl>
                            )}
                            {type === "subgroup" && (
                                <FormControl id="subgroup">
                                    <FormLabel>Grupo</FormLabel>
                                    <Select placeholder="Selecione o grupo"
                                        value={accountPlan.parent}
                                        onChange={(e) => setAccountPlan({ ...accountPlan, parent: e.target.value })}>
                                        {
                                            data?.groups.map((group: any) => (
                                                <option key={group._id} value={group._id}>{group.name}</option>
                                            ))
                                        }
                                    </Select>
                                    <FormLabel>Nome</FormLabel>
                                    <Input type="text"
                                        value={accountPlan.name}
                                        onChange={(e) => setAccountPlan({ ...accountPlan, name: e.target.value })}
                                    />
                                </FormControl>
                            )}
                            {type === "category" && (
                                <FormControl id="category">
                                    <FormLabel>Grupo</FormLabel>
                                    <Select placeholder="Selecione o grupo"
                                        value={accountPlan.parent}
                                        onChange={(e) => setAccountPlan({ ...accountPlan, parent: e.target.value })}>
                                        {
                                            data?.groups.map((group: any) => (
                                                <option key={group._id} value={group._id}>{group.name}</option>
                                            ))
                                        }
                                    </Select>
                                    <FormLabel>Subgrupo</FormLabel>
                                    <Select placeholder="Selecione o subgrupo"
                                        value={accountPlan.parent}
                                        onChange={(e) => setAccountPlan({ ...accountPlan, parent: e.target.value })}>
                                        {
                                            data?.subgroups.map((subgroup: any) => (
                                                <option key={subgroup._id} value={subgroup._id}>{subgroup.name}</option>
                                            ))
                                        }
                                    </Select>
                                    <FormLabel>Nome</FormLabel>
                                    <Input type="text"
                                        value={accountPlan.name}
                                        onChange={(e) => setAccountPlan({ ...accountPlan, name: e.target.value })}
                                    />
                                </FormControl>
                            )}
                        </Flex>
                    </DrawerComponent>
                </Flex>
            </Flex>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Nome</Th>
                        <Th>Opções</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Td>Receita</Td>
                        <Td>
                            <IconButton aria-label="Editar" icon={<EditIcon />} mr={2} />
                            <IconButton aria-label="Excluir" icon={<CloseIcon />} />
                        </Td>
                    </Tr>
                </Tbody>
            </Table>
        </>
    )
}