import React, { useEffect as effect, useState as state } from 'react'
import router from 'next/router'
import { checkToken } from '@/data/login'
import Navbar from '@/components/Navbar'
import { Container, HStack, useToast as Toast, Input, Card, CardHeader, Heading, CardBody, Stack, Box, Text, Radio } from '@chakra-ui/react'
import { getQuestions, updateQuestion } from '@/data/question'
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from '@chakra-ui/icons'
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
  const contentReload = async () => {
    await getQuestions(id).then(res => {
      handleSortQuestions(res.data)
    })
  }

  const handleSortQuestions = (questions) => {
    const sortedQuestions = [...questions].sort((a, b) => a.questionPosition - b.questionPosition)
    setQuestions(sortedQuestions)
  }

  const handleUpPosition = (newPosition, oldPosition) => {
    if (oldPosition > 0 && newPosition > 0) {
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
  const handleDownPosition = (newPosition, oldPosition) => {
    if (oldPosition < questions.length) {
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
        </HStack>
        {questions.map(((question, index) => (
          <>
            <Card key={question._id} bg='#f4efd7' mb="5" border='1px solid black'>
              <Heading ml="5" size="sm">Pregunta {(index + 1)}</Heading>
              <HStack>
                <Stack flex="80%">
                  <CardHeader textAlign={'center'}>
                    <Text fontFamily='serif' fontSize='xl'>{question?.questionContext}</Text>
                    <Heading size='md' textAlign='center' mt="25" fontFamily='-moz-initial'>{question?.questionName}</Heading>
                  </CardHeader>
                  <hr />
                  <CardBody>
                    <Stack>
                      <Box>
                        <form id='form'>
                          {question.questionOptions.map((res) => (
                            <div key={res.name + res.value}>
                              {question.questionType === 'radio' && (
                                <>
                                  <input type="radio" id={res.name} value={res.value} name='answer' />
                                  <label htmlFor={res.name}> {res.value}</label>
                                </>
                              )}
                              {question.questionType === 'text' && (
                                <Input id={res?.name} type="text" />
                              )}
                              {question.questionType === 'checkbox' && (
                                <div>
                                  <input type="checkbox" id={res.name} value={res.value} name='answer' />
                                  <label htmlFor={res.name}> {res.value} </label>
                                </div>
                              )}
                            </div>
                          ))}
                        </form>
                      </Box>
                    </Stack>
                  </CardBody>
                </Stack>
                <Stack paddingRight="25">
                  <CustomButton colorScheme='blue' onClick={() => handleUpPosition(question.questionPosition - 1, question.questionPosition)} hidden={evaluation?.isEditable}> <ArrowUpIcon /> </CustomButton>
                  <CustomButton colorScheme='blue' onClick={() => router.push(`/preguntas/resultado/${question._id}`)}><ArrowRightIcon /></CustomButton>
                  <UpdateQuestion id={question._id} reload={contentReload} isEditable={evaluation?.isEditable} />
                  <DeleteOption refe='question' id={question._id} reload={contentReload} isEditable={evaluation?.isEditable} />
                  <CustomButton colorScheme='blue' onClick={() => handleDownPosition(question.questionPosition + 1, question.questionPosition)} hidden={evaluation?.isEditable}> <ArrowDownIcon /> </CustomButton>
                </Stack>
              </HStack>
            </Card>
          </>
        )))}

      </Container>
    </>
  )
}

export default questions