import React, { useState as state } from 'react'
import router from 'next/router'
import { checkToken } from '@/data/login'
import Navbar from '@/components/Navbar'
import InputForm from '@/components/InputForm'
import { Button, Container, FormControl, FormLabel, HStack, Stack, Textarea, useToast as Toast } from '@chakra-ui/react'
import { createEvaluation } from '@/data/evaluations'

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
    const [evaluation, setEvaluation] = state({
        status: "pending"
    })
    const toast = Toast()
    const handleChange = (e) => {
        setEvaluation({
            ...evaluation,
            [e.target.name]: e.target.value
        })
    }
    const currentDate = new Date("dd-mm-aaaa");
    const submitEvaluation = (e) => {
        e.preventDefault()
        createEvaluation(evaluation).then(res => {
            if (res.status == '200') {
                router.push('/evaluaciones')
                toast({
                    title: "Evaluacion creada",
                    status: "success",
                    isClosable: true,
                    duration: 4000
                })
            }
        })
    }
    console.log(currentDate)
    return (
        <>
            <Navbar />
            {
                //Nota: Añadir formik
            }
            <Container maxW="container.sm">
                <form onSubmit={submitEvaluation} id='form'>
                    <Stack spacing={4} my={20} justify={"center"}>
                        <InputForm name="title" type="text" placeholder="Titulo de la evaluacion" handleChange={handleChange} label="Titulo" isRequired={true} />
                        <FormControl>
                            <FormLabel>Descripcion</FormLabel>
                            <Textarea name='introduction' placeholder='Descripcion de la evaluacion' onChange={handleChange}></Textarea>
                        </FormControl>
                        <InputForm name="start_date" type="date" placeholder="Fecha de inicio de la evaluacion" handleChange={handleChange} label="Inicio" isRequired={true} minLength={new Date()}/>
                        <InputForm name="end_date" type="date" placeholder="Fecha de termino de la evaluacion" handleChange={handleChange} label="Termino" isRequired={true} />
                    </Stack>
                    <HStack>
                        <Button colorScheme="green" type='submit'>Confirmar</Button>
                    </HStack>
                </form>
            </Container>
        </>
    )
}

export default crear