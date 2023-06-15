import React, { useEffect as effect, useState as state } from 'react'
import { getQuestions, getEvaluation } from '@/data/evaluations'
import { Text, Container, Card, HStack, Stack, CardHeader, Heading, CardBody, Box, Button, useToast as Toast, Input } from '@chakra-ui/react'
import { createAnswer } from '@/data/respond'
import { ArrowBackIcon, ArrowForwardIcon, ArrowRightIcon } from '@chakra-ui/icons'

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
  const [page, setPage] = state(-1)
  const toast = Toast()


  const handleChange = (e) => {
    setAnswer({
      ...answer,
      [e.target.name]: e.target.value
    })

  }
  console.log(answer)
  const backwardQuestion = () => {
    if (page > -1) {
      setPage(page - 1)
      setAnswer('')
    }
  }

  const forwardQuestion = () => {
    if (page < questions.length) {
      setPage(page + 1)
      setAnswer('')
    }
  }

  const handleSubmit = () => {
    setPage(page + 1)
    setAnswer('')
    /*createAnswer(answer).then(res => {
      if (res.status === 200) {
        toast({
          title: "Respuesta enviada!",
          description: "Se agradece su tiempo para responder",
          status: "success",
          isClosable: true,
          duration: 2500
        })
      }
    })*/
  }

  const showButton = () => {
    if (page <= 0 && page >= -1) {
      return <Button colorScheme='#FFD700' onClick={() => forwardQuestion()} ml="86.8%"><ArrowForwardIcon boxSize="8"/> </Button>
    }
    if (page >= -1 && page < questions.length) {
      return (
        <>
          <Button colorScheme="#FFD700" onClick={() => backwardQuestion()}> <ArrowBackIcon boxSize="8"/> </Button>
          <Button colorScheme='#FFD700' onClick={() => handleSubmit()}> <ArrowForwardIcon boxSize="8"/> </Button>
        </>
      )
    }
    if (page == questions.length) {
      return <Button colorScheme="#FFD700" onClick={() => backwardQuestion()}> <ArrowBackIcon boxSize="8"/> </Button>
    }
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
    <Container maxW={"container.lg"}>
      <Stack h="100"></Stack>
      <HStack h="25" pl="5%" paddingBlock="2" borderTopRadius="10" bgColor='#000080'>

      </HStack>
      <Card h="500" w="400" bgColor="white" border="1px solid black">
        {page == -1 && (
          <>
            <CardHeader>
              <Heading textAlign='center'>{evaluation?.title}</Heading>
            </CardHeader>
            <CardBody>
              <Text textAlign='center'>{evaluation?.introduction}</Text>
            </CardBody>
          </>
        )}
        {page >= 0 && page < questions.length && (
          <>
            <CardHeader minH="300">
              <Text textAlign={'center'}>{questions[page]?.questionContext}</Text>
              <Heading size='md' textAlign='center' mt="50">{questions[page]?.questionName}</Heading>
            </CardHeader>
            <CardBody>
              <Stack>
                <Box>
                  <form>
                    {questions[page]?.questionOptions.map((res, index) => (
                      <div key={questions[page]._id + res.value}>
                        {questions[page]?.questionType === 'radio' && (
                          <>
                            <label>{(index + 1) + ')'} </label>
                            <input type='radio' id={index} value={res.value} name='answer' onChange={handleChange}></input>
                            <label htmlFor={index}> {res.value}</label>
                          </>
                        )}
                        {questions[page]?.questionType === 'text' && (
                          <Input id={index} type='text' onChange={handleChange} />
                        )}
                        {questions[page]?.questionType === 'checkbox' && (
                          <>
                            <label>{(index + 1) + ')'} </label>
                            <input type='checkbox' id={index} value={res.value} name={'answer' + index} onChange={handleChange}></input>
                            <label htmlFor={index}> {res.value}</label>
                          </>
                        )}
                      </div>
                    ))}
                  </form>
                </Box>
              </Stack>
            </CardBody>
          </>
        )}
        {page == questions.length && (
          <>
            <Text>Listo</Text>
          </>
        )}
      </Card>
      <HStack spacing="80%" pl="5%" paddingBlock="2" borderBottomRadius="10" bgColor='#000080'>
        {showButton()}
      </HStack>
    </Container>
  )
}

export default index