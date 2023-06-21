import React, { useEffect as effect, useState as state } from 'react'
import router from 'next/router'
import { checkToken } from '@/data/login'
import Navbar from '@/components/Navbar'
import { Button, Container, HStack, Stack, Text } from '@chakra-ui/react'
import { getQuestionAnswer } from '@/data/answer'
import { searchQuestion } from '@/data/question'

export const getServerSideProps = async (context) => {
    try {
        const check = await checkToken(context.req.headers.cookie)
        if (check.status == 200) {
            return {
                props: {
                    id: context.query.resultado
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

const resultados = ({ id }) => {
    const [result, setResult] = state([])
    const [question, setQuestion] = state([])
    const [option, setOption] = state(0)
    effect(() => {
        getQuestionAnswer(id).then(res => {
            setResult(res.data)
        })
        searchQuestion(id).then(res => {
            setQuestion(res.data)
        })

    }, [])

    const evaluarRespuesta = (respuesta, value) => {
        let puntaje = 0;
      
        respuesta.forEach((res) => {
          res.answerUser.forEach((answer, i) => {
            if (answer && (answer.answer === value || answer.answer === value + `${i}`)) {
              puntaje += 1;
            }
          });
        });
        console.log(puntaje)
        return (
            <Text>{puntaje}</Text>
        );
      };

    return (
        <>
            <Navbar />
            <Container maxW="container.md">
                <HStack mt="2">
                    <Button onClick={() => router.back()}>Regresar</Button>
                </HStack>
                <Stack mt="10">
                    {
                        question.map((res, i) => {
                            return (
                                <HStack key={i}>
                                    <Text>
                                        {res.value}
                                    </Text>
                                    {evaluarRespuesta(result, res.value)}
                                </HStack>
                            )
                        })
                    }
                </Stack>
            </Container>
        </>
    )
}

export default resultados