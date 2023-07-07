import React, { useState as state } from 'react'
import router from 'next/router'
import { checkToken, createUser } from '@/data/login'
import Navbar from '@/components/Navbar'
import InputForm from '@/components/InputForm'
import { Container,  HStack, Stack, useToast as Toast } from '@chakra-ui/react'
import CustomButton from '@/styles/customButton'

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
    const [user, setUser] = state({
        rol: 'assistant'
    })
    const toast = Toast()
    const handleChange = (e) => {
        const {name, value} = e.target
        setUser({
            ...user,
            [name]: value
        })
    }
    const submitEvaluation = (e) => {
        e.preventDefault()
        createUser(user).then(res => {
            if (res.status == '201') {
                router.push('/usuarios')
                toast({
                    title: "Usuario creado",
                    status: "success",
                    isClosable: true,
                    duration: 4000
                })
            }
        })
    }

    return (
        <>
            <Navbar />
            <Container >
                <form onSubmit={submitEvaluation} id='form'>
                    <Stack h="100"></Stack>
                    <Stack h="35" pl="5%" paddingBlock="2" borderTopRadius="10" bgColor='#000080'></Stack>
                    <Stack spacing={4} justify={"center"} border="1px solid black" paddingInline="50" py="10">
                        <InputForm name="username" type="text" placeholder="Ingrese nombre de usuario" handleChange={handleChange} label="Nombre de usuario" isRequired={true} />
                        <InputForm name="password" type="password" placeholder="Ingrese contraseña" handleChange={handleChange} label="Contraseña" isRequired={true} minLength="6" />
                    </Stack>
                    <HStack paddingInline="5" paddingBlock="2" borderBottomRadius="10" bgColor='#000080' justifyContent="space-between">
                        <CustomButton type='submit'>Confirmar</CustomButton>
                        <CustomButton onClick={() => router.back()}>Cancelar</CustomButton>
                    </HStack>
                </form>
            </Container>
        </>
    )
}

export default crear