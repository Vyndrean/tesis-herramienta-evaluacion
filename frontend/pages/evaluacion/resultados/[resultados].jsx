import React, { useEffect as effect, useState as state } from 'react'
import router from 'next/router'
import { checkToken } from '@/data/login'
import Navbar from '@/components/Navbar'
import { Container, HStack, Card, CardHeader, CardBody, Stack, Box, Text, Select, FormLabel, FormControl, OrderedList, ListItem } from '@chakra-ui/react'
import { getQuestions } from '@/data/question'
import CustomButton from '@/styles/customButton'
import { getProducts } from '@/data/product'
import { getAnswersByProduct } from '@/data/answer'
import BarChart from '@/components/BarChart'
import { CheckIcon, ChevronDownIcon, ChevronRightIcon, CloseIcon, InfoIcon, InfoOutlineIcon, Search2Icon, SearchIcon } from '@chakra-ui/icons'

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
    const [theOtherChosenOne, setTheOtherChosenOne] = state({
        idEvaluation: id,
        idProduct: ''
    })
    const [answers2, setAnswers2] = state([])
    const [scores2, setScores2] = state([])
    const [selectedProduct, setSelectedProduct] = state("")
    const [selectedProduct2, setSelectedProduct2] = state("")
    const [selected, setSelected] = state(true)

    //This function create a collection of answer by id from the question
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

    //This function calculate the score
    const handleResult = (index, data, questionTemp) => {
        let resultObj = []
        if (data && (questionTemp.questionType == 'radio' || questionTemp.questionType == 'checkbox')) {
            let score = 0
            data.map(res => {
                res.answerUser.map(answer => {
                    if (answer == index) {
                        score += 1
                    }
                })
            })
            return score
        } else if (data && questionTemp.questionType == 'radio-matriz') {
            questionTemp.questionOptions[0].row.map((row, irow) => {
                resultObj[irow] = []
                questionTemp.questionOptions[0].col.map((col, icol) => {
                    let score = 0
                    data.map(res => {
                        res.answerUser.map((answer, i) => {
                            if (answer[irow] == icol) {
                                score += 1
                            }
                        })
                    })
                    resultObj[irow][icol] = score
                })
            })
            return resultObj
        } else if (data && questionTemp.questionType == 'checkbox-matriz') {
            const merge = data.flatMap(item => item.answerUser)
            questionTemp.questionOptions[0].row.forEach((row, irow) => {
                resultObj[irow] = [];
                questionTemp.questionOptions[0].col.forEach((col, icol) => {
                    resultObj[irow][icol] = 0
                    merge.forEach(answer => {
                        if (answer.name == irow) {
                            answer.ids.map(res => {
                                if (icol == res) {
                                    resultObj[irow][icol] += 1
                                }
                            })
                        }
                    })
                })
            })
            return resultObj
        }
        return 0
    }

    const handleSortQuestions = (questions) => {
        const sortedQuestions = [...questions].sort((a, b) => a.questionPosition - b.questionPosition)
        setQuestions(sortedQuestions)
    }
    const handleChange = (e, pos) => {
        const { value, selectedIndex } = e.target
        if (pos == 0) {
            getAnswersByProduct({
                "idEvaluation": id,
                "idProduct": value
            }).then(res => {
                const newAnswer = groupedData(res.data, 'question')
                setAnswers(newAnswer)
                setSelectedProduct(product[selectedIndex - 1].name)

            })
            setSelected(false)
        } else {
            getAnswersByProduct({
                "idEvaluation": id,
                "idProduct": value
            }).then(res => {
                const newAnswer = groupedData(res.data, 'question')
                setAnswers2(newAnswer)
                setSelectedProduct2(product[selectedIndex - 1].name)
            })
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
    //Check the answers
    effect(() => {
        const newScores = questions.map(question => {
            const newScore = question.questionOptions.map((_res, i) => (
                handleResult(i, answers[question._id], question)
            ))
            return newScore
        })
        setScores({
            ...scores,
            newScores
        })
    }, [answers, questions, answers2])
    //Check the second answers and compare
    effect(() => {
        const newScores = questions.map(question => {
            const newScore = question.questionOptions.map((_res, i) => (
                handleResult(i, answers2[question._id], question)
            ))
            return newScore
        })
        setScores2({
            ...scores2,
            newScores
        })
    }, [answers2])
    const handleBar = (question) => {
        if (question.questionType == 'radio' || question.questionType == 'checkbox') {
            const barData = {
                labels: question?.questionOptions?.map((res) => res.value) || [],
                datasets: [
                    {
                        label: selectedProduct,
                        data: scores?.newScores[question.questionPosition - 1] || [],
                        borderWidth: 2,
                    },
                    {
                        label: selectedProduct2,
                        data: scores2?.newScores[question.questionPosition - 1] || [],
                        borderWidth: 2
                    }
                ]
            }
            return barData
        } else if (question.questionType == 'radio-matriz' || question.questionType == 'checkbox-matriz') {
            const barData = {
                labels: question?.questionOptions[0]?.col?.map((col) => col.value) || [],
                datasets: question.questionOptions[0]?.row?.map((row, irow) => (
                    {
                        label: row?.value + " - " + selectedProduct || '',
                        data: scores?.newScores[question.questionPosition - 1]?.[0]?.[irow] || []
                    }
                )),
            };
            const additionalDatasets = question.questionOptions[0]?.row?.map((row, irow) => ({
                label: row?.value + " - " + selectedProduct2 || '',
                data: scores2?.newScores[question.questionPosition - 1]?.[0]?.[irow] || []
            })
            )
            barData.datasets.push(...additionalDatasets);
            return barData
        } else {
            return null
        }
    }
    return (
        <>
            <Navbar />
            <Container maxW="container.xl">
                <Stack h="2"></Stack>
                <HStack justifyContent="space-between" bgColor="#000080" borderTopRadius="20px" paddingInline="10" mb="2" h="12">
                    <HStack>
                        <FormControl>
                            <form id='form'>
                                <HStack>
                                    <FormLabel color='white' pt="2">Seleccione un producto</FormLabel>
                                    <Select name='idProduct' placeholder='Seleccione...' isRequired bgColor='white' w="40" maxW="60" onChange={(e) => handleChange(e, 0)} borderRadius="17">
                                        {
                                            product.map((res) => (
                                                <option value={res._id} name={res.name} key={res._id}>{res.name}</option>
                                            ))

                                        }
                                    </Select>
                                </HStack>
                            </form>
                        </FormControl>
                        <FormControl hidden={selected}>
                            <form>
                                <HStack>
                                    <FormLabel color='white' pt="2">Comparar con</FormLabel>
                                    <Select name='idProduct' placeholder='Seleccione...' isRequired bgColor='white' w="40" maxW="60" onChange={(e) => handleChange(e, 1)} borderRadius="17">
                                        {
                                            product.map((res) => (
                                                <option value={res._id} name={res.name} key={res._id}>{res.name}</option>
                                            ))
                                        }
                                    </Select>
                                </HStack>
                            </form>
                        </FormControl>
                    </HStack>
                    <CustomButton colorScheme="#000080" onClick={() => router.back()}>Regresar</CustomButton>
                </HStack>
                {answers != '' && answers2 == '' ? (
                    questions.map(((question, index) => (
                        <Card key={question._id} mb="5" border='1px solid #000080'>
                            <Stack>
                                <CardHeader >
                                    <Text fontSize='xl'>Pregunta {(index + 1)}: {question.questionContext}, {question.questionName} </Text>
                                </CardHeader>
                                <hr />
                                <CardBody h="50">
                                    <Text textAlign="center">Total de respuestas: {answers[question._id]?.length || "N/A"}</Text>
                                    <BarChart data={handleBar(question)} chartId={question._id} />
                                </CardBody>
                            </Stack>
                        </Card>
                    )))
                ) : (
                    null
                )}
                {answers != '' && answers2 != '' ? (
                    questions.map(((question, index) => (
                        <Card key={question._id} mb="5" border='1px solid #000080'>
                            <Stack>
                                <CardHeader >
                                    <Text fontSize='xl'>Pregunta {(index + 1)}: {question.questionContext}, {question.questionName} </Text>
                                </CardHeader>
                                <hr />
                                <CardBody h="50">
                                    <Text textAlign="center">Total de respuestas {selectedProduct}: {answers[question._id]?.length || "N/A"} | {selectedProduct2}: {answers2[question._id]?.length || "N/A"}</Text>
                                    <BarChart data={handleBar(question)} chartId={question._id} />
                                </CardBody>
                            </Stack>
                        </Card>
                    )))
                ) : (
                    null
                )}
            </Container>
        </>
    )
}

export default resultados