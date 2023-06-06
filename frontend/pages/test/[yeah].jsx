import React, { useEffect as effect, useState as state } from 'react'
import { getQuestions, getEvaluation } from '@/data/evaluations'
import { Text, Container, Card, HStack, Stack, CardHeader, Heading, CardBody, Box, Button } from '@chakra-ui/react'

export const getServerSideProps = async (context) => {
  try {
    return {
      props: {
        id: context.query.yeah
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

  const handleAnswer = (e, idQuestion) => {
    setAnswer({
      ...answer,
      "answerUser": e.target.value, "question": idQuestion
    })
    
    //console.log("IdQuestion: "+idQuestion + "\nIdEvaluation: "+ id + "\n Value:"+value )
  }
  console.log(answer)
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
                        <div key={res.name + res.value}>
                          {question.questionType === 'radio' && (
                            <>
                              <input type="radio" id={res.name} value={res.value} name='answer' onChange={(e) => handleAnswer(e, question._id)} />
                              <label htmlFor={res.name}> {res.value}</label>
                            </>
                          )}
                          {question.questionType === 'text' && (
                            <Input value={res?.value} id={res?.name} type="text" onChange={handleAnswer} />
                          )}
                          {question.questionType === 'checkbox' && (
                            <div>
                              <input type="checkbox" id={res.name} value={res.value} name='answer' onChange={handleAnswer} />
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
      <Button>Enviar</Button>
    </Container>
  )
}

export default index