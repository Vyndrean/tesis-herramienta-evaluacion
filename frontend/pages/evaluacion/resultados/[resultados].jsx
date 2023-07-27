import React, { useEffect as effect, useState as state } from 'react'
import router from 'next/router'
import { checkToken } from '@/data/login'
import Navbar from '@/components/Navbar'
import { Container, HStack, Card, CardHeader, CardBody, Stack, Box, Text, Select, FormLabel, FormControl, OrderedList, ListItem } from '@chakra-ui/react'
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
    const [theOtherChosenOne, setTheOtherChosenOne] = state({
        idEvaluation: id,
        idProduct: ''
    })
    const [answers2, setAnswers2] = state([])
    const [scores2, setScores2] = state([])
    const [selectedProduct, setSelectedProduct] = state([])
    const [selectedProduct2, setSelectedProduct2] = state([])
    const [selected, setSelected] = state(true)
    const bringThoseChosen = (e) => {
        e.preventDefault()
        setSelectedProduct(e.target.attributes.name.value)
        getAnswersByProduct(theChosenOne).then(res => {
            const newAnswer = groupedData(res.data, 'question')
            setAnswers(newAnswer)
            setTheChosenOne({
                ...theChosenOne,
                'idProduct': ''
            })
        })
    }

    const brinTheOtherChosenOne = (e) => {
        e.preventDefault()
        setSelectedProduct2(e.target.attributes.name.value)
        getAnswersByProduct(theOtherChosenOne).then(res => {
            const newAnswer = groupedData(res.data, 'question')
            setAnswers2(newAnswer)
        })
    }

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
        const { name, value } = e.target
        if (pos == 0) {
            setTheChosenOne({
                ...theChosenOne,
                [name]: value
            })
        } else {
            setTheOtherChosenOne({
                ...theChosenOne,
                [name]: value
            })
        }
        setSelected(false)
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
                <Text>De acuerdo con los datos recopilados de todos los participantes, el {maxR}% ha elegido la respuesta {maxP + 1} como la opción preferida. Estos resultados sugieren que {questionName} se ha considerado {questionOptions[maxP].value}</Text>
            )
        }
    }

    const handleComparison = (data, data2, length, length2, questionName, questionOptions) => {
        if (length == 0) {
            return (
                <Text>No es posible realizar la comparacion</Text>
            )
        }
        let maxR = 0
        let maxP = 0
        let maxR2 = 0
        let maxP2 = 0

        let name
        let maxRF
        let maxPF
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
        }
        if (data2 && length2) {
            data2.map((answer, index) => {
                const average = (answer / length2) * 100
                const newAverage = Math.floor(average)
                if (newAverage > maxR2) {
                    maxR2 = newAverage
                    maxP2 = index
                }
                return maxR2
            })
        }

        if (maxR < maxR2) {
            maxRF = maxR2
            maxPF = maxP2
            name = selectedProduct2
        } else if (maxR == maxR2) {
            return (
                <Text>Basándonos en los resultados, podemos concluir que tanto el {selectedProduct} como {selectedProduct2} presentan un número significativo de usuarios similares. Sin embargo, el producto B muestra un promedio ligeramente mayor en comparacion</Text>
            )
        } else {
            maxRF = maxR
            maxPF = maxP
            name = selectedProduct
        }

        if (maxRF == 0) {
            return (
                <Text>No existe informacion suficiente para dar un resultado.</Text>
            )
        } else {
            return (
                <Text>Segun los datos proporcionados, se obtuvo como resultado que: <br />{selectedProduct} un {maxR}% a elegido {questionOptions[maxP].value} <br />  {selectedProduct2} un {maxR2}% a elegido {questionOptions[maxP2].value} <br /> Comparando los resultados, se observa que {name}, con un {maxRF}% en {questionOptions[maxPF].value} presento una mayor metrica evaluada en comparacion con el otro producto</Text>
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
    }, [answers, questions])
    //Check the second answers and compare
    effect(() => {
        const newScores = questions.map(question => {
            const newScore = question.questionOptions.map((_res, i) => (
                handleResult(i, answers2[question._id])
            ))
            return newScore
        })
        setScores2({
            ...scores2,
            newScores
        })
    }, [answers2])

    return (
        <>
            <Navbar />
            <Container maxW="container.xl">
                <Stack h="2"></Stack>
                <HStack justifyContent="space-between" bgColor="#000080" borderTopRadius="20px" paddingInline="10" mb="2" h="12">
                    <HStack>
                        <FormControl>
                            <form id='form' onSubmit={bringThoseChosen}>
                                <HStack>
                                    <FormLabel color='white' pt="2">Seleccione un producto</FormLabel>
                                    <Select name='idProduct' placeholder='Seleccione...' isRequired bgColor='white' w="40" maxW="60" onChange={(e) => handleChange(e, 0)}>
                                        {
                                            product.map((res) => (
                                                <option value={res._id} name={res.name} key={res._id} onClick={bringThoseChosen}>{res.name}</option>
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
                                    <Select name='idProduct' placeholder='Seleccione...' isRequired bgColor='white' w="40" maxW="60" onChange={(e) => handleChange(e, 1)}>
                                        {
                                            product.map((res) => (
                                                <option value={res._id} name={res.name} key={res._id} onClick={brinTheOtherChosenOne}>{res.name}</option>
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
                            <HStack>
                                <Stack>
                                    <CardHeader >
                                        <Text fontSize='xl'>Pregunta {(index + 1)}: {question.questionName} </Text>
                                    </CardHeader>
                                    <hr />
                                    <CardBody>
                                        <HStack>
                                            <Stack flex="50%">
                                                <Text>Total de respuestas {answers[question._id]?.length || 'N/A'}</Text>
                                                <Box fontSize="md">
                                                    {question.questionType == 'radio' && (
                                                        question.questionOptions.map((res, i) => {
                                                            return (
                                                                <div key={i}>
                                                                    <HStack>
                                                                        <Text>{i + 1}{')'} {res.value} - </Text>
                                                                        <Text>{scores?.newScores[index]?.[i] || 0}</Text>
                                                                    </HStack>
                                                                </div>
                                                            )
                                                        })
                                                    )}
                                                    {question.questionType == 'checkbox' && (
                                                        question.questionOptions.map((res, i) => {
                                                            return (
                                                                <div key={i}>
                                                                    <HStack>
                                                                        <Text>{i + 1}{')'} {res.value} - </Text>
                                                                        <Text>{scores?.newScores[index]?.[i] || 0}</Text>
                                                                    </HStack>
                                                                </div>
                                                            )
                                                        })
                                                    )}
                                                    {question.questionType == 'radio-matriz' && (
                                                        question.questionOptions[0].row.map((row, irow) => {
                                                            return (
                                                                <HStack key={irow}>
                                                                    <Text>{irow + 1}{')'} {row.value}</Text>
                                                                    <Stack marginInline="2"></Stack>
                                                                    {question.questionOptions[0].col.map((col, icol) => (
                                                                        <HStack key={icol}>
                                                                            <Text>{col.value} - </Text>
                                                                            <Text>{scores?.newScores[index]?.[0]?.[irow]?.[icol]}</Text>
                                                                        </HStack>
                                                                    ))}
                                                                </HStack>
                                                            )
                                                        })
                                                    )}
                                                    {question.questionType == 'checkbox-matriz' && (
                                                        question.questionOptions[0].row.map((row, irow) => {
                                                            return (
                                                                <HStack key={irow}>
                                                                    <Text>{irow + 1}{')'} {row.value}</Text>
                                                                    <Stack marginInline="2"></Stack>
                                                                    {question.questionOptions[0].col.map((col, icol) => (
                                                                        <HStack key={icol}>
                                                                            <Text>{col.value} - </Text>
                                                                            <Text>{scores?.newScores[index]?.[0]?.[irow]?.[icol]}</Text>
                                                                        </HStack>
                                                                    ))}
                                                                </HStack>
                                                            )
                                                        })
                                                    )}
                                                </Box>
                                            </Stack>
                                            <Stack flex="50%">
                                                {handleAverage(scores?.newScores[index], answers[question._id]?.length, question.questionName, question.questionOptions)}
                                            </Stack>
                                        </HStack>
                                    </CardBody>
                                </Stack>
                            </HStack>
                        </Card>
                    )))
                ) : (
                    null
                )}
                {answers != '' && answers2 != '' && (
                    questions.map(((question, index) => (
                        <Card key={question._id} mb="5" border='1px solid #000080'>
                            <HStack>
                                <Stack>
                                    <CardHeader >
                                        <Text fontSize='xl'>Pregunta {(index + 1)}: {question.questionName} </Text>
                                    </CardHeader>
                                    <hr />
                                    <CardBody>
                                        <HStack>
                                            <Stack flex="25%">
                                                <Text>Total de respuestas {answers[question._id]?.length || 'N/A'}</Text>
                                                <Box fontSize="md">
                                                    {question.questionOptions.map((res, i) => {
                                                        return (
                                                            <div key={i}>
                                                                <HStack>
                                                                    <Text>{i + 1}{')'} {res.value} - </Text>
                                                                    <Text>{scores?.newScores[index]?.[i] || 0}</Text>
                                                                </HStack>
                                                            </div>
                                                        )
                                                    })}
                                                </Box>
                                            </Stack>
                                            <Stack flex="25%">
                                                <Text>Total de respuestas {answers2[question._id]?.length || 'N/A'}</Text>
                                                <Box fontSize="md">
                                                    {question.questionOptions.map((res, i) => {
                                                        return (
                                                            <div key={i}>
                                                                <HStack>
                                                                    <Text>{i + 1}{')'} {res.value} - </Text>
                                                                    <Text>{scores2?.newScores[index]?.[i] || 0}</Text>
                                                                </HStack>
                                                            </div>
                                                        )
                                                    })}
                                                </Box>
                                            </Stack>
                                            <Stack flex="50%">
                                                {
                                                    handleComparison(scores?.newScores[index], scores2?.newScores[index], answers[question._id]?.length, answers2[question._id]?.length, question.questionName, question.questionOptions)
                                                }
                                            </Stack>
                                        </HStack>
                                    </CardBody>
                                </Stack>
                            </HStack>
                        </Card>
                    )))
                )}

            </Container>

        </>
    )
}

export default resultados