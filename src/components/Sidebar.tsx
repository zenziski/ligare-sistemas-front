import { CheckIcon, CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import { Box, Flex, useDisclosure, Divider, Icon, IconButton, Text } from "@chakra-ui/react";
import { useRef, useState } from "react";

interface SidebarProps {
    children: React.ReactNode
}

interface ItemProps {
    children: React.ReactNode
    icon: React.ReactNode
}

const Item = ({ children, icon }: ItemProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isHover, setIsHover] = useState(false);
    const [isActive, setIsActive] = useState(false)
    const ref = useRef<HTMLDivElement>(null);

    return (
        <Box
            ref={ref}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            onClick={() => {
                setIsActive(!isActive);
                if (ref.current?.contains(document.activeElement)) {
                    onClose();
                } else {
                    onOpen();
                }
            }}
            bg={isHover ? "#fff" : "#f9f9f9"}
            color="black"
            p={4}
            cursor="pointer"
            _focus={{
                outline: "none",
            }}
            display={'flex'}
            alignItems={'center'}
            borderRadius={'md'}
            mb={2}
            _active={{
                bg: 'primary-700'
            }}
            transition={'all 0.2s ease-in-out'}
        >
            <Box
                mr={2}
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
                w={6}
                h={6}
                borderRadius={'md'}
                bg="primary-500"
                color='primary-400'
                transition={'all 0.2s ease-in-out'}
            >
                {icon}
            </Box>
            <Box
                fontSize={'md'}
                color="#555"
                fontFamily="Poppins-Medium"
            >
                {children}
            </Box>
        </Box>
    );
}

const Sidebar = ({ children }: SidebarProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Flex>
            <Box
                bg="#f5f7f7"
                w="64"
                p="6"
                color="white"
                display={{ base: isOpen ? "block" : "none", md: "block" }}
                h={'100vh'}
            >
                <Box
                    p={4}
                    textAlign={'center'}
                    fontSize={'2xl'}
                    fontWeight={'bold'}
                >
                    <Text fontFamily="Poppins-Light" fontSize="36px" color="black">Ligare</Text>
                </Box>
                <Divider />
                <Box
                    mt={4}
                    display={'flex'}
                    flexDirection={'column'}
                >
                    <Item
                        icon={<CheckIcon />}
                    >
                        Item 1
                    </Item>
                    <Item
                        icon={<Icon />}
                    >
                        Item 2
                    </Item>
                    <Item
                        icon={<Icon />}
                    >
                        Item 3
                    </Item>
                </Box>
            </Box>
            <Box
                flex="1"
            >
                <Box
                    p={4}
                    color={'white'}
                    h={'64px'}
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'flex-end'}
                >
                    {
                        isOpen ? (
                            <IconButton
                                aria-label="Close Menu"
                                size="lg"
                                mr={2}
                                icon={<CloseIcon />}
                                onClick={onClose}
                                display={{ base: "block", md: "none" }}
                            />) : (
                            <IconButton
                                aria-label="Open Menu"
                                size="lg"
                                mr={2}
                                icon={<HamburgerIcon />}
                                onClick={onOpen}
                                display={{ base: "block", md: "none" }}
                            />
                        )
                    }
                </Box>
                <Box
                    p={4}
                >
                    {children}
                </Box>
            </Box>
        </Flex>
    );
}

export default Sidebar;