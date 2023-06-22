import React from 'react'
import router from 'next/router'
import { checkToken } from '@/data/login'
import Navbar from '@/components/Navbar'
import { Container, Text } from '@chakra-ui/react'

export const getServerSideProps = async (context) => {
    try {
        const check = await checkToken(context.req.headers.cookie)
        if (check.status == 200) {
            return {
                props: {
                    id: context.query.id
                }
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

const actualizar = ({ id }) => {
    return (
        <>
            <Navbar />
            <Container>
                <Text textAlign={"center"}>Bienvenido</Text>
            </Container>
        </>
    )
}

export default actualizar