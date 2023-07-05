import React, { useEffect as effect, useState as state } from 'react'
import router from 'next/router'
import { checkToken } from '@/data/login'
import Navbar from '@/components/Navbar'
import { Container, HStack, Card, CardHeader, CardBody, Stack, Box, Text, Select, FormLabel, FormControl } from '@chakra-ui/react'
import { getQuestions } from '@/data/question'
import CustomButton from '@/styles/customButton'
import { getProducts } from '@/data/product'
import { getAnswersByProduct } from '@/data/answer'

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
    const [product, setProduct] = state([])
    const [theChosenOne, setTheChosenOne] = state({
        idEvaluation: id,
        idProduct: ''
    })
    const [answers, setAnswers] = state([])
    const [scores, setScores] = state([])
    const bringThoseChosen = (e) => {
        e.preventDefault()
        getAnswersByProduct(theChosenOne).then(res => {
            const newAnswer = groupedData(res.data, 'question')
            setAnswers(newAnswer)
        })
    }

    //This function create a collection of answer by question id
    const groupedData = (data, key) => {
        return data.reduce((result, obj) => {
            const keyValue = obj[key]
            if (!result[keyValue]) {
                result[keyValue] = []
            }
            result[keyValue].push(obj)
            return result
        }, {})
    }

    const handleResult = (index, data) => {
        let score = 0
        if (data) {
            data.map(res => {
                res.answerUser.map(answer => {
                    if (answer == index) {
                        score += 1
                    }
                })
            })
            return score
        }
    }

    const handleSortQuestions = (questions) => {
        const sortedQuestions = [...questions].sort((a, b) => a.questionPosition - b.questionPosition)
        setQuestions(sortedQuestions)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setTheChosenOne({
            ...theChosenOne,
            [name]: value
        })
    }

    const handleAverage = (data, length, questionName, questionOptions) => {
        if (length == 0) {
            return 'Sin resultado'
        }
        let maxR = 0
        let maxP = 0
        if (data && length) {
            data.map((answer, index) => {
                const average = (answer / length) * 100
                const newAverage = Math.floor(average)
                if (newAverage > maxR) {
                    maxR = newAverage
                    maxP = index
                }
                return maxR
            })

            return (
                <Text>De acuerdo con los datos recopilados de todos los participantes, el {maxR}% ha elegido la respuesta {maxP + 1} como la opción preferida. Estos resultados sugieren que '{questionName}' se ha considerado {questionOptions[maxP].value}</Text>
            )
        }
    }

    effect(() => {
        getQuestions(id).then(res => {
            handleSortQuestions(res.data)
        })
        getProducts().then(res => {
            setProduct(res.data)
        })
    }, [])

    effect(() => {
        const newScores = questions.map(question => {
            const newScore = question.questionOptions.map((_res, i) => (
                handleResult(i, answers[question._id])
            ))
            return newScore
        })
        setScores({
            ...scores,
            newScores
        })
    }, [answers, questions])

    return (
        <>
            <Navbar />
            <Container maxW={"container.lg"}>
                <Stack h="2"></Stack>
                <HStack justifyContent="space-between" bgColor="#000080" borderTopRadius="20px" paddingInline="10" mb="2" h="12">
                    <FormControl>
                        <form id='form' onSubmit={bringThoseChosen}>
                            <HStack>
                                <FormLabel color='white' pt="2">Seleccione un producto</FormLabel>
                                <Select name='idProduct' placeholder='Seleccione...' isRequired bgColor='white' w="40" maxW="60" onChange={handleChange}>
                                    {
                                        product.map((res) => (
                                            <option value={res._id} key={res._id} onClick={bringThoseChosen}>{res.name}</option>
                                        ))
                                    }
                                </Select>
                            </HStack>
                        </form>
                    </FormControl>
                    <CustomButton colorScheme="#000080" onClick={() => router.back()}>Regresar</CustomButton>
                </HStack>
                                    
                {questions.map(((question, index) => (
                    <Card key={question._id} mb="5" border='1px solid #000080'>
                        <HStack>
                            <Stack flex="50%">
                                <CardHeader >
                                    <Text fontSize='xl'>Pregunta {(index + 1)}: {question.questionName} </Text>
                                </CardHeader>
                                <hr />
                                <CardBody >
                                    <HStack>
                                        <Stack flex="80%">
                                            <Text>Total de respuestas {answers[question._id]?.length || 'N/A'}</Text>
                                            <Box fontSize="md">
                                                {question.questionOptions.map((res, i) => {
                                                    return (
                                                        <div key={i}>
                                                            <HStack>
                                                                <Text>Respuesta {i + 1}: {res.value} - </Text>
                                                                <Text>{scores?.newScores[index]?.[i] || 0}</Text>
                                                            </HStack>
                                                        </div>
                                                    )
                                                })}
                                            </Box>
                                        </Stack>
                                        <Stack hidden={true}>
                                            <Text>{question._id}</Text>
                                            <CustomButton onClick={() => console.log(scores.newScores[question.questionPosition - 1])}>TEST</CustomButton>
                                        </Stack>
                                    </HStack>
                                </CardBody>
                            </Stack>
                            <Stack flex="50%">
                                <CardHeader>

                                </CardHeader>
                                <hr/>
                                <CardBody>
                                    {handleAverage(scores?.newScores[index], answers[question._id]?.length, question.questionName, question.questionOptions)}
                                </CardBody>
                            </Stack>
                        </HStack>
                    </Card>
                )))}
            </Container>
        </>
    )
}

export default resultados