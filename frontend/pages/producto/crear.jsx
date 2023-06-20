import React from 'react'
import router from 'next/router'
import { checkToken } from '@/data/login'
import Navbar from '@/components/Navbar'
import { Button, Container, HStack, Stack, Text } from '@chakra-ui/react'
import DataTable from 'react-data-table-component'

export const getServerSideProps = async (context) => {
    try {
        const check = await checkToken(context.req.headers.cookie)
        if (check.status == 200) {
            return {
                props: {}
            }
        }
    } catch (error) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }
}


const createProduct = () => {
    return (
        <>
            <Container maxW="container.md">
                <Stack>

                </Stack>
                <HStack mt="2" spacing="auto">
                    <Button colorScheme="green">Confirmar</Button>
                    <Button colorScheme='red' onClick={() => router.back()}>Cancelar</Button>
                </HStack>
            </Container>
        </>
    )
}

export default createProduct