import { Box, Flex, Button, Stack, Show, HStack, useDisclosure, IconButton, Heading, Text } from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import router from "next/router";
import axios from "axios";
import Cookies from 'js-cookie'
import Link from "next/link";

const Navbar = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    
    return (
        <Stack id="navFix">
            <Box width={["100%"]}>
                <Flex h={12} alignItems={"center"} justifyContent={"space-between"} bgGradient={'linear(to-r, #000080, #412080,  #000080)'} paddingInline="10" borderBottomRadius="20">
                    <HStack w="10%">
                        <Show breakpoint="(min-width: 1000px)">
                            <Heading as={'h1'} fontSize="30" fontFamily="serif" onClick={() => router.push('/')} className="pointer" color={"white"}></Heading>
                        </Show>
                    </HStack>
                    <Flex alignItems={"center"} justifyContent={"space-between"} >

                        <HStack spacing={8} alignItems={"center"}  >
                            <HStack
                                as={"nav"}
                                spacing={10}
                                display={{ base: "none", md: "flex" }}
                                id="myDIV"
                            >
                                <Text className="btnRes pointer" color={"white"} onClick={() => router.push('/inicio')}>
                                    INICIO
                                </Text>
                                <Text className="btnRes pointer" color={"white"} onClick={() => router.push('/evaluaciones')}>
                                    EVALUACIONES
                                </Text>
                                <Text className="btnRes pointer" color={"white"} onClick={() => router.push('/producto')}>
                                    PRODUCTO
                                </Text>
                                <Text className="btnRes pointer" color={"white"} onClick={() => router.push('#')}>
                                    USUARIOS
                                </Text>
                            </HStack>
                        </HStack>
                    </Flex>
                    <HStack as={"nav"} id="myDIV" display={{ base: "none", md: "flex" }} color={"white"}>
                        <Link color='teal.500' href='/' onClick={() => {
                            Cookies.remove("token")
                            axios.post(`${process.env.SERVIDOR}/logout`)
                        }}>
                            Cerrar Sesión
                        </Link>
                    </HStack>

                    <HStack w="90%" display={{ md: "none" }} >
                        <Heading as={'h1'} fontSize="30" fontFamily="serif" onClick={() => router.push('/')} className="pointer" color={"white"}>Inicio</Heading>
                    </HStack>

                    <IconButton
                        size={"md"}
                        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                        aria-label={"Open Menu"}
                        display={{ md: "none" }}
                        onClick={isOpen ? onClose : onOpen}
                    />

                    {isOpen ? (

                        <Box paddingInline="3" paddingBlock="2" borderRadius={"15"} mt="300" display={{ md: "none" }} bgGradient={'linear(to-b, #000080, black, #000080)'}>
                            <Stack as={"nav"} spacing={4}>
                                <Button onClick={isOpen ? onClose : onOpen}
                                    _hover={{
                                        textShadow: "#FC0 1px 0 10px",
                                        transform: "scale(1.2)",
                                    }}>
                                    <Text onClick={() => router.push('/inicio')}>
                                        <b>Inicio</b>
                                    </Text>
                                </Button>
                                <Link color='teal.500' href='/' onClick={() => {
                                    Cookies.remove("token")
                                    axios.post(`${process.env.SERVIDOR}/logout`)
                                }}>
                                    Cerrar Sesion
                                </Link>
                            </Stack>
                        </Box>
                    ) : null}
                </Flex>
            </Box>
            <hr />
        </Stack>
    );
}
export default Navbar