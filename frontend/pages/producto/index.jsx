import React from 'react'
import router from 'next/router'
import { checkToken } from '@/data/login'
import Navbar from '@/components/Navbar'
import { Button, Container, HStack, Text } from '@chakra-ui/react'
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


const producto = () => {
    return (
        <>
            <Navbar />
            <Container maxW="container.lg">
                <HStack mt="2">
                    <Button colorScheme="green" onClick={() => router.push('/producto/crear')}>Crear producto</Button>
                </HStack>
                <DataTable
                
                />
            </Container>
        </>
    )
}

export default producto