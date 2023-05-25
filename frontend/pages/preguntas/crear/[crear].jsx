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
    const [answer, setAnswer] = state([])
    const [question, setQuestion] = state({
        evaluation: id.crear
    })
    const [answerList, setAnswerList] = state([]);
    const handleChange = (e) => {
      const { name, value } = e.target;
      if (name.includes('answer')) {
        setAnswerList(prevAnswerList => {
          const updatedAnswerList = [...prevAnswerList];
          const answerIndex = updatedAnswerList.findIndex(item => item.name === name);
          if (answerIndex !== -1) {
            updatedAnswerList[answerIndex].value = value;
          } else {
            updatedAnswerList.push({ name, value });
          }
          return updatedAnswerList;
        });
      } else {
        setQuestion(prevQuestion => ({
          ...prevQuestion,
          [name]: value
        }));
      }
      setQuestion(prevQuestion => ({ ...prevQuestion, questionOptions: answerList }));
    };
    
    console.log(question)
    const handleAdd = () => {
        const abc = [...answer, []]
        setAnswer(abc)
    }

    const handleDelete = (e) => {
        const delAnswer = [...answer]
        delAnswer.splice(e, 1)
        setAnswer(delAnswer)
    }

    const handleSubmit = (e) => {
        console.log(question)
        e.preventDefault()
        createQuestion(question).then(res => {
            if (res.status == '200') {
                router.push(`/preguntas`)
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
                                <option value='multiple'>Opcion multiple</option>
                                <option value='alternativa'>Alternativas</option>
                                <option value='simple'>Pregunta simple</option>
                            </Select>
                        </FormControl>
                        <InputForm name="questionName" type="text" placeholder="¿Que es lo que quieres preguntar?" handleChange={handleChange} label="Pregunta" />

                        <FormLabel>Respuestas</FormLabel>
                        {answer.map((data, i) => {
                            return (
                                <HStack key={i}>
                                    <Input name={'answer'+i} onChange={handleChange}></Input>
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