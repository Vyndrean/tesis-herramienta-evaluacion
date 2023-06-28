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

    const bringThoseChosen = (e) => {
        e.preventDefault()
        getAnswersByProduct(theChosenOne).then(res => {
            setAnswers(res.data)
        })
    }

    const contentReload = async () => {
        await getQuestions(id).then(res => {
            handleSortQuestions(res.data)
        })
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

    effect(() => {
        getQuestions(id).then(res => {
            handleSortQuestions(res.data)
        })
        getProducts().then(res => {
            setProduct(res.data)
        })
    }, [])
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
                                            <option value={res._id} key={res._id}>{res.name}</option>
                                        ))
                                    }
                                </Select>
                                <CustomButton colorScheme="#000080" type="submit">Resultados</CustomButton>
                            </HStack>
                        </form>
                    </FormControl>
                    <CustomButton colorScheme="#000080" onClick={() => router.back()}>Regresar</CustomButton>
                </HStack>

                {answers.map(((answer, index) => (
                    <Card key={answer._id} mb="5" border='1px solid #000080'>
                        {console.log(answer)}
                        <HStack>
                            <Stack flex="80%">
                                <CardHeader >
                                    <Text fontSize='xl'>Pregunta {(index + 1)}: {answer.question.questionName} </Text>
                                </CardHeader>
                                <hr />
                                <CardBody >
                                    <Stack>
                                        <Box fontSize="md">

                                        </Box>
                                    </Stack>
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