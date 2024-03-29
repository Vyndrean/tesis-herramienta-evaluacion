import React, { useEffect as effect, useState as state } from 'react'
import router from 'next/router'
import { checkToken } from '@/data/login'
import Navbar from '@/components/Navbar'
import { Container, HStack, Input, Card, CardHeader, CardBody, Stack, Box, Text, Textarea } from '@chakra-ui/react'
import { getQuestions, updateQuestion } from '@/data/question'
import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons'
import CreateQuestion from '@/components/CreateQuestion'
import DeleteOption from '@/components/DeleteOption'
import UpdateQuestion from '@/components/UpdateQuestion'
import CanEditQuestion from '@/components/CanEditQuestion'
import { getEvaluation } from '@/data/evaluations'
import CustomButton from '@/styles/customButton'

export const getServerSideProps = async (context) => {
  try {
    const check = await checkToken(context.req.headers.cookie)
    if (check.status == 200) {
      return {
        props: {
          id: context.query.id
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

const questions = ({ id }) => {
  const [questions, setQuestions] = state([])
  const [evaluation, setEvaluation] = state([])
  const [hideContent, setHideContent] = state(false)
  const contentReload = async () => {
    try {
      const response = await getQuestions(id);
      handleSortQuestions(response.data);
    } catch (error) {
      console.error("Error al obtener las preguntas:", error);
    }
  }

  const handleSortQuestions = (questions) => {
    const sortedQuestions = [...questions].sort((a, b) => a.questionPosition - b.questionPosition);
    setQuestions(sortedQuestions);
  }

  const handleUpPosition = (newPosition, oldPosition) => {
    if (oldPosition > 0 && newPosition > 0) {
      //console.log("NEW POSITION: ", newPosition, "\nOLD POSITION: ", oldPosition)
      const question1 = questions.find((question) => question.questionPosition == oldPosition)
      const question2 = questions.find((question) => question.questionPosition == newPosition)

      updateQuestion(question1._id, { questionPosition: newPosition }).then(res => {
        if (res.status == 200 ) {
          updateQuestion(question2._id, { questionPosition: oldPosition }).then(res => {
            if (res.status == 200) {
              contentReload()
            }
          })
        } else {
          updateQuestion(question1._id, { questionPosition: oldPosition })
        }
      })
    }
  }

  const handleDownPosition = (newPosition, oldPosition) => {
    if (oldPosition < questions.length && newPosition <= questions.length) {
      //console.log("NEW POSITION: ", newPosition, "\nOLD POSITION: ", oldPosition)
      const question1 = questions.find((question) => question.questionPosition == oldPosition)
      const question2 = questions.find((question) => question.questionPosition == newPosition)
      updateQuestion(question1._id, { questionPosition: newPosition }).then(res => {
        if (res.status == 200) {
          updateQuestion(question2._id, { questionPosition: oldPosition }).then(res => {
            if (res.status == 200) {
              contentReload()
            }
          })
        } else {
          updateQuestion(question1._id, { questionPosition: oldPosition })
        }
      })
    }
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
          <CreateQuestion id={id} reload={contentReload} length={questions?.length + 1} isEditable={evaluation?.isEditable} />
          <CanEditQuestion id={id} />
          <CustomButton colorScheme="#000080" onClick={() => setHideContent(!hideContent)}>Ocultar respuestas</CustomButton>
          <CustomButton colorScheme="#000080" onClick={() => router.push(`/evaluacion/resultados/${id}`)} isDisabled={!evaluation?.isEditable}>Resultados</CustomButton>
        </HStack>
        {questions.map(((question, index) => (
          <Card key={question._id} mb="5" border='1px solid #000080'>
            <HStack>
              <Stack flex="80%">
                <CardHeader >
                  <Text fontSize='xl'>
                    Pregunta {(index + 1)}: {question?.questionContext}, {question?.questionName}
                  </Text>
                </CardHeader>
                <hr />
                <CardBody hidden={hideContent} >
                  <Stack>
                    <Box fontSize="md" minH="100px">
                      <form id='form'>
                        {question?.questionOptions.map((res, i) => (
                          <div key={'answer' + i}>
                            {question.questionType === 'radio' && (
                              <>
                                <input type="radio" id={res.name} value={res.value} name='answer' />
                                <label htmlFor={res.name}> {res.value}</label>
                              </>
                            )}
                            {question.questionType === 'checkbox' && (
                              <div>
                                <input type="checkbox" id={res.name} value={res.value} name='answer' />
                                <label htmlFor={res.name}> {res.value} </label>
                              </div>
                            )}
                            {question.questionType === 'radio-matriz' && (
                              <>
                                {res.row.map((row) => (
                                  <div key={row.value}>
                                    <HStack>
                                      <Text>{row.value.toString()} </Text>
                                      <Stack marginInline="2"></Stack>
                                      {res.col.map((col, icol) => (
                                        <HStack key={col.value + icol}>
                                          <input type="radio" id={icol} value={col.value} name={row.value} onClick={() => console.log(col.value)} />
                                          <label htmlFor={icol}>{col.value.toString()}</label>
                                        </HStack>
                                      ))}
                                    </HStack>
                                  </div>
                                ))}
                              </>
                            )}
                            {question.questionType === 'checkbox-matriz' && (
                              <>
                                {res.row.map((row) => (
                                  <div key={row.value}>
                                    <HStack>
                                      <Text>{row.value.toString()} </Text>
                                      <Stack marginInline="2"></Stack>
                                      {res.col.map((col, icol) => (
                                        <HStack key={col.value}>
                                          <input type="checkbox" id={icol} value={col.value} name={row.value} />
                                          <label htmlFor={icol}>{col.value.toString()}</label>
                                        </HStack>
                                      ))}
                                    </HStack>
                                  </div>
                                ))}
                              </>
                            )}
                          </div>
                        ))}

                      </form>
                    </Box>
                  </Stack>
                </CardBody>
              </Stack>
              <Stack paddingRight="25">
                <Stack hidden={hideContent}>
                  <UpdateQuestion id={question._id} reload={contentReload} isEditable={evaluation?.isEditable} position={questions?.length + 1} />
                  <DeleteOption refe='question' id={question._id} reload={contentReload} isEditable={evaluation?.isEditable} />
                </Stack>
                <Stack hidden={evaluation?.isEditable}>
                  <CustomButton colorScheme='blue' onClick={() => handleUpPosition(question.questionPosition - 1, question.questionPosition)} isDisabled={evaluation?.isEditable}> <ArrowUpIcon /> </CustomButton>
                  <CustomButton colorScheme='blue' onClick={() => handleDownPosition(question.questionPosition + 1, question.questionPosition)} isDisabled={evaluation?.isEditable}> <ArrowDownIcon /> </CustomButton>
                </Stack>
              </Stack>
            </HStack>
          </Card>
        )))}

      </Container>
    </>
  )
}

export default questions