import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  InputGroup,
  InputLeftElement,
  Input,
  Card,
  CardBody,
} from "@chakra-ui/react";

import DrawerComponent from "../../components/Drawer";
import Sidebar from "../../components/Sidebar";
import { useDiaryBookManager } from "./hooks/useDiaryBookManager";
import { DiaryBookForm } from "./components/DiaryBookForm";
import { DiaryBookTable } from "./components/DiaryBookTable";

const Livro = () => {
  const {
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
    formMethods,
    clearForm,
    createDiaryBook,
    updateDiaryBook,
    deleteDiaryBook,
  } = useDiaryBookManager();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = formMethods;

  const handleDrawerClose = () => {
    setCurrentDiaryBook({} as any);
    clearForm();
  };

  const handleFormSubmit = currentDiaryBook._id
    ? updateDiaryBook
    : createDiaryBook;

  return (
    <Sidebar>
      {loading ? (
        <Flex justifyContent="center" alignItems="center" height="100vh">
          <Text fontSize="2xl">Carregando...</Text>
        </Flex>
      ) : (
        <Flex
          w="100%"
          h="100%"
          p={10}
          direction="column"
          fontFamily="Poppins-Regular"
        >
          <Tabs variant="enclosed">
            <TabList>
              <Tab>Livro Diário</Tab>
              <Tab>Contas a Pagar</Tab>
              <Tab>Contas a Receber</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Flex direction="column" gap={6}>
                  <Card>
                    <CardBody>
                      <Flex
                        direction="row"
                        justify="space-between"
                        align="center"
                        mb={4}
                      >
                        <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                          Livro Diário
                        </Text>
                        <DrawerComponent
                          headerText={
                            currentDiaryBook._id
                              ? "Editar Entrada"
                              : "Nova Entrada"
                          }
                          buttonText={
                            currentDiaryBook._id ? "Editar" : "Adicionar"
                          }
                          buttonIcon={<AddIcon />}
                          onAction={handleSubmit(handleFormSubmit)}
                          isLoading={isSubmitting}
                          onCloseHook={handleDrawerClose}
                        >
                          <DiaryBookForm
                            control={control}
                            register={register}
                            errors={errors}
                            setValue={setValue}
                            accountPlanData={accountPlanData}
                            users={users}
                            constructions={constructions}
                            selectedType={selectedType}
                            setSelectedType={setSelectedType}
                            selectedGroup={selectedGroup}
                            setSelectedGroup={setSelectedGroup}
                            selectedSubgroup={selectedSubgroup}
                            setSelectedSubgroup={setSelectedSubgroup}
                          />
                        </DrawerComponent>
                      </Flex>
                      <InputGroup>
                        <InputLeftElement>
                          <SearchIcon color="gray.400" />
                        </InputLeftElement>
                        <Input
                          placeholder="Buscar por tipo, grupo, subgrupo, funcionário, obra, observação ou conta..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          focusBorderColor="blue.400"
                        />
                      </InputGroup>
                    </CardBody>
                  </Card>
                  <DiaryBookTable
                    diaryBooks={diaryBooks}
                    loading={loading}
                    searchTerm={searchTerm}
                    accountPlanData={accountPlanData}
                    users={users}
                    constructions={constructions}
                    onEdit={setCurrentDiaryBook}
                    onDelete={deleteDiaryBook}
                  />
                </Flex>
              </TabPanel>
              <TabPanel>
                <Text fontSize="2xl">Contas a Pagar - Em desenvolvimento</Text>
              </TabPanel>
              <TabPanel>
                <Text fontSize="2xl">
                  Contas a Receber - Em desenvolvimento
                </Text>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
      )}
    </Sidebar>
  );
};

export default Livro;
