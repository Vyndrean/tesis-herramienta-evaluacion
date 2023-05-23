import React, { useState as state } from 'react'
import router from 'next/router'
import { checkToken } from '@/data/login'
import Navbar from '@/components/Navbar'
import { Button, Container, FormLabel, HStack, Select, Stack, useToast as Toast } from '@chakra-ui/react'
import InputForm from '@/components/InputForm'
import { createQuestion } from '@/data/evaluations'

export const getServerSideProps = async (context) => {
    try {
        const check = await checkToken(context.req.headers.cookie)
        if (check.status == 200) {
            return {
                props: {
                    id: context.query
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

const crearPreguntas = ({ id }) => {
    const [question, setQuestion] = state({
        name: "",
        evaluation: id.crear
    })
    const toast = Toast()
    console.log(question)
    const handleChange = (e) => {
        setQuestion({
            ...question,
            [e.target.name]: e.target.value
        })
    }

    const submitQuestion = (e) => {
        e.preventDefault()
        createQuestion(question).then(res => {
            toast({
                title: "Pregunta creada!",
                status: "success",
                isClosable: true,
                duration: 4000
            })
            router.push(`/preguntas/${id.crear}`)
        })
    }

    return (
        <>
            <Navbar />
            {
                //Nota: Añadir formik
            }
            <Container maxW="container.sm">
                <form onSubmit={submitQuestion} id='form'>
                    <Stack spacing={4} my={20} justify={"center"}>
                        <FormLabel>Tipo de pregunta</FormLabel>
                        <Select name='type' placeholder='Seleccione...' onChange={handleChange}>
                            <option value='multiple'>Opcion multiple</option>
                            <option value='trueFalse'>Verdadero/Falso</option>
                            <option value='resProb'>Resolucion de problema</option>
                            <option value='ansOpen'>Pregunta abierta</option>
                        </Select>
                        
                        <InputForm name="name" type="text" placeholder="Titulo de la evaluacion" handleChange={handleChange} label="Titulo" />
                    </Stack>
                    <HStack>
                        <Button colorScheme="green" type='submit'>Confirmar</Button>
                        <Button colorScheme="red" onClick={() => router.back()}>Cancelar</Button>
                    </HStack>
                </form>
            </Container>
        </>
    )
}

export default crearPreguntas