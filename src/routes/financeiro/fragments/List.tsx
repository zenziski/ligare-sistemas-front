import { AddIcon, EditIcon, CloseIcon } from "@chakra-ui/icons"
import { Flex, FormControl, FormLabel, Input, Table, Thead, Tr, Th, Tbody, Td, IconButton, Text } from "@chakra-ui/react"
import DrawerComponent from "../../../components/Drawer"

export type Type = "group" | "subgroup" | "category"
export type TabType = "receita" | "despesa" | "custo"

export const List = ({ type, tab }: { type: Type, tab: TabType }) => {
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
                    >
                        <Flex direction="column" p={5} gap={4}>
                            {type === "group" && (
                                <FormControl id="group">
                                    <FormLabel>Nome</FormLabel>
                                    <Input type="text" />
                                </FormControl>
                            )}
                            {type === "subgroup" && (
                                <FormControl id="subgroup">
                                    <FormLabel>Grupo</FormLabel>
                                    <Input type="text" />
                                    <FormLabel>Nome</FormLabel>
                                    <Input type="text" />
                                </FormControl>
                            )}
                            {type === "category" && (
                                <FormControl id="category">
                                    <FormLabel>Grupo</FormLabel>
                                    <Input type="text" />
                                    <FormLabel>Subgrupo</FormLabel>
                                    <Input type="text" />
                                    <FormLabel>Nome</FormLabel>
                                    <Input type="text" />
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