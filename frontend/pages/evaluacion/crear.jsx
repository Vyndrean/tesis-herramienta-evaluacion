import React, { useState as state } from 'react'
import router from 'next/router'
import { checkToken } from '@/data/login'
import Navbar from '@/components/Navbar'
import InputForm from '@/components/InputForm'
import { Container, FormControl, FormLabel, HStack, Stack, Textarea, useToast as Toast } from '@chakra-ui/react'
import { createEvaluation } from '@/data/evaluations'
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
    const [evaluation, setEvaluation] = state([])
    const toast = Toast()
    const handleChange = (e) => {
        setEvaluation({
            ...evaluation,
            [e.target.name]: e.target.value
        })
    }
    const submitEvaluation = (e) => {
        e.preventDefault()
        createEvaluation(evaluation).then(res => {
            if (res.status == '200') {
                router.push('/evaluacion')
                toast({
                    title: "Evaluacion creada",
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
            <Container maxW="container.md">
                <form onSubmit={submitEvaluation} id='form'>
                    <Stack h="100"></Stack>
                    <Stack h="35" pl="5%" paddingBlock="2" borderTopRadius="10" bgColor='#000080'></Stack>
                    <Stack spacing={4} justify={"center"} border="1px solid black" paddingInline="50" py="10">
                        <InputForm name="title" type="text" placeholder="Ingrese el titulo para la evaluación" handleChange={handleChange} label="Título" isRequired={true} />
                        <FormControl>
                            <FormLabel>Descripción</FormLabel>
                            <Textarea name='introduction' placeholder='Ingrese la descripción aquí' onChange={handleChange}></Textarea>
                        </FormControl>
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