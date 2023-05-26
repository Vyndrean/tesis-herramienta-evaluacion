import React, { useState as state } from 'react'
import router from 'next/router'
import { checkToken } from '@/data/login'
import Navbar from '@/components/Navbar'
import { Button, Container, FormControl, FormLabel, HStack, Input, Select, Stack, useToast as Toast } from '@chakra-ui/react'
import InputForm from '@/components/InputForm'
import { createQuestion } from '@/data/evaluations'
import { CloseIcon } from '@chakra-ui/icons'

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
    const toast = Toast()
    const [answer, setAnswer] = state([
        {
            name: '',
            value: ''
        }
    ])
    const [question, setQuestion] = state({
        evaluation: id.crear
    })

    const handleChangeAnswer = (e, i) => {
        const { name, value } = e.target;
        const updatedAnswer = [...answer];
        updatedAnswer[i] = { name, value };

        setAnswer(updatedAnswer);
        setQuestion(prevQuestion => ({
            ...prevQuestion,
            questionOptions: updatedAnswer
        }));
    };



    const handleChange = (e) => {
        const { name, value } = e.target
        setQuestion(prevQuestion => ({
            ...prevQuestion,
            [name]: value,
            questionOptions: answer
        })
        )
    }

    const handleAdd = () => {
        const newAnswer = [...answer, {
            name: '', value: ''
        }]
        setAnswer(newAnswer)
    }

    const handleDelete = (e) => {
        const updatedAnswer = [...answer];
        updatedAnswer.splice(e, 1);
        setAnswer(updatedAnswer);
        setQuestion(prevQuestion => ({
            ...prevQuestion,
            questionOptions: updatedAnswer
        }));
    };


    const handleSubmit = (e) => {
        e.preventDefault()
        createQuestion(question).then(res => {
            if (res.status == '200') {
                router.push(`/preguntas/${id.crear}`)
                toast({
                    title: 'Pregunta creada',
                    status: 'success',
                    duration: 4000,
                    isClosable: true
                })

            }
        })
    }
    return (
        <>
            <Navbar />
            {
                //Nota: Añadir formik
            }
            <Container maxW="container.sm">
                <form onSubmit={handleSubmit} id='form'>
                    <Stack spacing={4} my={20} justify={"center"}>
                        <FormControl>
                            <FormLabel>Tipo de pregunta</FormLabel>
                            <Select name='questionType' defaultValue={'default'} onChange={handleChange}>
                                <option value='default' disabled>Seleccione...</option>
                                <option value='checkbox'>Opcion multiple</option>
                                <option value='radio'>Alternativas</option>
                                <option value='text'>Pregunta simple</option>
                            </Select>
                        </FormControl>
                        <InputForm name="questionName" type="text" placeholder="¿Que es lo que quieres preguntar?" handleChange={handleChange} label="Pregunta" />

                        <FormLabel>Respuestas</FormLabel>
                        {answer.map((data, i) => {
                            return (
                                <HStack key={i}>
                                    <Input value={data.value} name={'answer' + i} onChange={(e) => handleChangeAnswer(e, i)}></Input>
                                    <Button onClick={() => handleDelete(i)}> <CloseIcon /> </Button>
                                </HStack>
                            )
                        })}
                        <Button onClick={() => handleAdd()} w="18">Añadir respuesta</Button>
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