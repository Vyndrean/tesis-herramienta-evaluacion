import React, { useEffect as effect, useState as state } from 'react'
import router from 'next/router'
import { checkToken } from '@/data/login'
import Navbar from '@/components/Navbar'
import { Button, Container, HStack, useToast as Toast, Input, Card, CardHeader, Heading, CardBody, Stack, Box, Text } from '@chakra-ui/react'
import { getQuestions } from '@/data/question'
import { ArrowRightIcon, EditIcon } from '@chakra-ui/icons'
import CreateQuestion from '@/components/CreateQuestion'
import DeleteOption from '@/components/DeleteOption'
import UpdateQuestion from '@/components/UpdateQuestion'
import CanEditQuestion from '@/components/CanEditQuestion'
import { getEvaluation } from '@/data/evaluations'

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
      setQuestions(res.data)
    })
  }


  effect(() => {
    getQuestions(id).then(res => {
      setQuestions(res.data)
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
        <HStack justifyContent="space-between" bgColor="#000080" borderTopRadius="20px" paddingInline="10" mb="2">
          <CreateQuestion id={id} reload={contentReload} />
          <CanEditQuestion id={id} />
        </HStack>
        {questions.map((question => (
          <Card key={question._id} bg='#f4efd7' mb="5" border='1px solid black'>
            <HStack>
              <Stack flex="80%">
                <CardHeader textAlign={'center'}>
                  <Text fontFamily='serif' fontSize='xl'>{question?.questionContext}</Text>
                  <Heading size='md' textAlign='center' mt="50" fontFamily='-moz-initial'>{question?.questionName}</Heading>
                </CardHeader>
                <hr />
                <CardBody>
                  <Stack>
                    <Box>
                      <form>
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
              <Stack paddingRight={"25"}>
                <Button colorScheme='blue' onClick={() => router.push(`/preguntas/resultado/${question._id}`)}><ArrowRightIcon /></Button>
                <UpdateQuestion id={question._id} reload={contentReload} isEditable={evaluation?.isEditable} />
                <DeleteOption refe='question' id={question._id} reload={contentReload} isEditable={evaluation?.isEditable} />
              </Stack>
            </HStack>
          </Card>
        )))}
        <hr />
      </Container>
    </>
  )
}

export default questions