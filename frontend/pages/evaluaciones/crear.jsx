import React, { useState as state } from 'react'
import router from 'next/router'
import { checkToken } from '@/data/login'
import Navbar from '@/components/Navbar'
import InputForm from '@/components/InputForm'
import { Container, Text } from '@chakra-ui/react'


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

const crear = () => {
    const [evaluation, setEvaluation] = state([])
    return (
        <>
            <Navbar />
            <Container>
                <Text textAlign={"center"}>Funcion no disponible</Text>
            </Container>
        </>
    )
}

export default crear