import { CheckIcon } from "@chakra-ui/icons";
import { Box, Flex, Divider, Text } from "@chakra-ui/react";

interface SidebarProps {
    children: React.ReactNode
}

interface ItemProps {
    label: string
    icon: React.ReactNode
    isActive?: boolean
}

const Item = ({ label, icon, isActive }: ItemProps) => {

    return (
        <Flex
            bg={isActive ? 'primary-100' : 'transparent'}
            color="black"
            p={4}
            cursor="pointer"
            alignItems='center'
            borderRadius='md'
            mb={2}
            transition='all 0.2s ease-in-out'
        >
            <Flex
                mr={2}
                alignItems='center'
                justifyContent='center'
                w={6}
                h={6}
                borderRadius='md'
                bg="primary-500"
                color='primary-400'
                transition='all 0.2s ease-in-out'
            >
                {icon}
            </Flex>
            <Box
                fontSize='md'
                color="#555"
                fontFamily="Poppins-Medium"
            >
                {label}
            </Box>
        </Flex>
    );
}

const Sidebar = ({ children }: SidebarProps) => {
    return (
        <Flex>
            <Box bg="#f5f7f7" w="64" p="6" color="white" h='100vh'>
                <Flex
                    p={4}
                    textAlign='center'
                    fontSize='2xl'
                    fontWeight='bold'
                    justifyContent="center"
                    alignItems="center"
                >
                    <Text fontFamily="Poppins-Light" fontSize="36px" color="black">Ligare</Text>
                </Flex>
                <Divider />
                <Flex direction="column">
                    <Item label="Menu item" icon={<CheckIcon />} />
                    <Item label="Menu item" icon={<CheckIcon />} />
                    <Item label="Menu item" icon={<CheckIcon />} />
                </Flex>
            </Box >
            <Flex
                p={4}
                w="100%"
                h="100%"
                
            >
                {children}
            </Flex>
        </Flex >
    );
}

export default Sidebar;