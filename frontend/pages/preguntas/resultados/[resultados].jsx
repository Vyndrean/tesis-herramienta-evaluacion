import React, { useEffect as effect, useState as state } from 'react'
import router from 'next/router'
import { checkToken } from '@/data/login'
import Navbar from '@/components/Navbar'
import { Container, HStack, useToast as Toast, Input, Card, CardHeader, Heading, CardBody, Stack, Box, Text, Radio } from '@chakra-ui/react'
import { getQuestions, updateQuestion } from '@/data/question'
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from '@chakra-ui/icons'
import DeleteOption from '@/components/DeleteOption'
import UpdateQuestion from '@/components/UpdateQuestion'
import { getEvaluation } from '@/data/evaluations'
import CustomButton from '@/styles/customButton'
import { getQuestionAnswer } from '@/data/answer'

export const getServerSideProps = async (context) => {
    try {
        const check = await checkToken(context.req.headers.cookie)
        if (check.status == 200) {
            return {
                props: {
                    id: context.query.resultados
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
    const [questions, setQuestions] = state([])
    const [evaluation, setEvaluation] = state([])
    const [hideContent, setHideContent] = state(false)
    const [result, setResult] = state([])
    const contentReload = async () => {
        await getQuestions(id).then(res => {
            handleSortQuestions(res.data)
        })
    }

    const handleSortQuestions = (questions) => {
        const sortedQuestions = [...questions].sort((a, b) => a.questionPosition - b.questionPosition)
        setQuestions(sortedQuestions)
    }

    const handleAnswer = (id) => {
        getQuestionAnswer(id).then(res => {
            setResult(res.data)
        })
    }

    effect(() => {
        getQuestions(id).then(res => {
            handleSortQuestions(res.data)
        })
        getEvaluation(id).then(res => {
            setEvaluation(res.data)
        })
    }, [])
    return (
        <>
            <Navbar />
            <Container maxW={"container.lg"}>
                <Stack h="2"></Stack>
                <HStack justifyContent="space-between" bgColor="#000080" borderTopRadius="20px" paddingInline="10" mb="2" h="12">
                    <CustomButton colorScheme="#000080" onClick={() => router.back()}>Regresar</CustomButton>
                </HStack>

                {questions.map(((question, index) => (
                    <>
                        <Card key={question._id} mb="5" border='1px solid #000080'>
                            <HStack>
                                <Stack flex="80%">
                                    <CardHeader >
                                        <Text fontSize='xl'>Pregunta {(index + 1)}: {question?.questionContext} {question?.questionName}</Text>
                                    </CardHeader>
                                    <hr />
                                    <CardBody hidden={hideContent} >
                                        <Stack>
                                            <Box fontSize="md">

                                            </Box>
                                        </Stack>
                                    </CardBody>
                                </Stack>
                            </HStack>
                        </Card>
                    </>
                )))}

            </Container>
        </>
    )
}

export default resultados