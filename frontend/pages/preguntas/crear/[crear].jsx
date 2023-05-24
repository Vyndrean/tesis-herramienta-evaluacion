import React, { useState as state } from 'react'
import router from 'next/router'
import { checkToken } from '@/data/login'
import Navbar from '@/components/Navbar'
import { Button, Container, FormLabel, HStack, Input, Select, Stack, useToast as Toast } from '@chakra-ui/react'
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
    const [counter, setCounter] = state(0)
    const toast = Toast()
    const handleChange = (e) => {
        setQuestion({
            ...question,
            [e.target.name]: e.target.value
        })
        console.log(question)
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

    const handleClick = () => {
        setCounter(counter + 1)
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
                        <HStack>
                            <Select name='type' placeholder='Seleccione...' onChange={handleChange} w="60">
                                <option value='checkbox'>Opcion multiple</option>
                                <option value='radio'>Alternativa</option>
                                <option value='text'>Abierta</option>
                            </Select>
                            <Button onClick={handleClick}>Añadir</Button>
                        </HStack>
                        <InputForm name="name" type="text" placeholder="Titulo de la evaluacion" handleChange={handleChange} label="Titulo" />
                        <FormLabel>Preguntas</FormLabel>
                        {Array.from(Array(counter)).map((index) => {
                            return (
                                <Input
                                    onChange={handleChange}
                                    key={index}
                                    className={index}
                                    type="text"
                                ></Input>
                            );
                        })}
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