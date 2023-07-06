import { Box, Flex, Button, Stack, Show, HStack, useDisclosure, IconButton, Heading, Text } from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import router from "next/router";
import axios from "axios";
import Cookies from 'js-cookie'
import Link from "next/link";
import ToPDF from "@/util/ToPDF";

const Navbar = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const Links = ['INICIO', 'EVALUACIONES', 'PRODUCTO', 'USUARIOS'];
    return (
        <>
            <Box>
                <Flex h={12} alignItems={"center"} justifyContent={"space-between"} bgColor='#000080' paddingInline="10" borderBottomRadius="20">
                    <IconButton
                        size={'md'}
                        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                        aria-label={'Open Menu'}
                        display={{ md: 'none' }}
                        colorScheme="#000080"
                        onClick={isOpen ? onClose : onOpen}
                    />
                    <HStack w="10%">
                        <Show breakpoint="(min-width: 1000px)">
                            <Heading as={'h1'} fontSize="30" fontFamily="serif" onClick={() => router.push('/')} className="pointer" color={"white"}></Heading>
                        </Show>
                    </HStack>
                    <HStack spacing={8} alignItems={'center'}>
                        <HStack
                            as={'nav'}
                            spacing={8}
                            color="white"
                            display={{ base: 'none', md: 'flex' }}>
                            {Links.map((link) => (
                                <Link key={link} href={`/${link.toLowerCase()}`}>{link}</Link>
                            ))}
                        </HStack>
                    </HStack>
                    <HStack as={"nav"} id="myDIV" display={{ base: "none", md: "flex" }} color={"white"}>
                        <Link color='teal.500' href='/' onClick={() => {
                            Cookies.remove("token")
                            axios.post(`${process.env.SERVIDOR}/logout`)
                        }}>
                            Cerrar Sesión
                        </Link>
                    </HStack>


                </Flex>
                {isOpen ? (
                    <Box
                        display={{ md: 'none' }}
                        py="3"
                        zIndex="1"
                        color="white"
                        bgColor="#000080"
                        pl="15%"
                        marginInline="4"
                        borderBottomRadius="20"
                    >
                        <Stack as={'nav'} spacing={4}>
                            {Links.map((link) => (
                                <Link key={link} href={`/${link.toLowerCase()}`}>{link}</Link>
                            ))}
                        </Stack>
                    </Box>
                ) : null}
            </Box>
        </>
    );
}
export default Navbar