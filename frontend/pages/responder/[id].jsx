import React, { useEffect as effect, useState as state } from 'react'
import { getQuestions, getEvaluation } from '@/data/evaluations'
import { Text, Container, Card, HStack, Stack, CardHeader, Heading, CardBody, Box, Button, useToast as Toast, Input } from '@chakra-ui/react'
import { createAnswer } from '@/data/respond'

export const getServerSideProps = async (context) => {
  try {
    return {
      props: {
        id: context.query.id
      }
    }
  } catch (error) {
    console.log(error)
  }
}

const index = ({ id }) => {
  const [questions, setQuestions] = state([])
  const [evaluation, setEvaluation] = state([])
  const [answer, setAnswer] = state([])
  const toast = Toast()

  const handleAnswer = (e, idQuestion) => {
    const { value } = e.target;
    setAnswer((prevAnswer) => ({
      ...prevAnswer,
      answerUser: {
        ...prevAnswer.answerUser,
        [idQuestion]: value,
      },
    }));
  };

  const handleSubmit = () => {
    createAnswer(answer).then(res => {
      if (res.status === 200) {
        toast({
          title: "Respuesta enviada!",
          description: "Se agradece su tiempo para responder",
          status: "success",
          isClosable: true,
          duration: 2500
        })
      }
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
    <Container maxW={"container.md"}>
      <Stack textAlign="center" mb="10">
        <Heading>{evaluation.title}</Heading>
        <Heading size="sm">{evaluation.introduction}</Heading>
      </Stack>
      {questions.map((question => (
        <Card key={question._id} bg='blackAlpha.50' mb="5">
          <HStack spacing={'auto'}>
            <Stack>
              <CardHeader>
                <Heading size={"md"}>{question?.questionName}</Heading>
                <Text>{question?.questionContext}</Text>
              </CardHeader>
              <CardBody>
                <Stack>
                  <Box>
                    <form>
                      {question.questionOptions.map((res) => (
                        <div key={res._id + res.name}>
                          {question.questionType === 'radio' && (
                            <>
                              <input type="radio" id={res.name} value={res.value} name='answer' onChange={(e) => handleAnswer(e, question._id)} />
                              <label htmlFor={res.name}> {res.value}</label>
                            </>
                          )}
                          {question.questionType === 'text' && (
                            <Input value={res?.value} id={res?.name} type="text" onChange={(e) => handleAnswer(e, question._id)} />
                          )}
                          {question.questionType === 'checkbox' && (
                            <div>
                              <input type="checkbox" id={res.name} value={res.value} name='answer' onChange={(e) => handleAnswer(e, question._id)} />
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
          </HStack>
        </Card>
      )))}
      <Button colorScheme='green' onClick={handleSubmit}>Enviar</Button>
    </Container>
  )
}

export default index