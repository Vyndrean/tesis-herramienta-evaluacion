import React, { useEffect as effect, useState as state } from 'react'
import { getQuestions, getEvaluation } from '@/data/evaluations'
import { Text, Container, Card, HStack, Stack, CardHeader, Heading, CardBody, Box, Button, useToast as Toast, Input, FormLabel } from '@chakra-ui/react'
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import router from 'next/router'

export const getServerSideProps = async (context) => {
  try {
    const vali = await context.query.validation
    if (vali === '123') {
      return {
        props: {
          id: context.query.id
        }
      }
    } else {
      return {
        redirect: {
          destination: "/responder/error",
          permanent: false
        }
      }
    }

  } catch (error) {
    return {
      redirect: {
        destination: "/responder/no",
        permanent: false
      }
    }
  }
}

const index = ({ id }) => {
  const [questions, setQuestions] = state([])
  const [evaluation, setEvaluation] = state([])
  const [answer, setAnswer] = state([])
  const [page, setPage] = state(-1)
  const toast = Toast()
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnswer((prevAnswer) => ({
      ...prevAnswer,
      answerUser: {
        ...prevAnswer.answerUser,
        [name]: value,
      },
    }));
  };



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
    setAnswer('')
    setPage(page + 1)
    /*
    createAnswer(answer).then(res => {
      if (res.status === 200) {
        setAnswer('')
        setPage(page + 1)
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
    if (page == -1) {
      return <Button colorScheme='#FFD700' onClick={() => forwardQuestion()} ml="86.8%"><ArrowForwardIcon boxSize="8" /> </Button>
    }
    if (page >= -1 && page < questions.length) {
      return (
        <>
          <Button colorScheme="#FFD700" onClick={() => backwardQuestion()}> <ArrowBackIcon boxSize="8" /> </Button>
          <Button colorScheme='#FFD700' onClick={() => handleSubmit()}> <ArrowForwardIcon boxSize="8" /> </Button>
        </>
      )
    }
    if (page == questions.length) {
      return <Button colorScheme="#FFD700" onClick={() => backwardQuestion()}> <ArrowBackIcon boxSize="8" /> </Button>
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
    <Container maxW={"container.lg"} h="100%">
      <Stack h="100"></Stack>
      <Stack h="35" pl="5%" paddingBlock="2" borderTopRadius="10" bgColor='#000080'>

      </Stack>
      <Card h="500" w="400" bgColor="white" border="1px solid black" borderRadius="0">
        {page == -1 && (
          <>
            <CardHeader>
              <Heading textAlign='center' fontFamily='-moz-initial'>{evaluation?.title}</Heading>
            </CardHeader>
            <hr />
            <CardBody>
              <Text textAlign='center' fontFamily='serif' fontSize='xl'>{evaluation?.introduction}</Text>
            </CardBody>
          </>
        )}
        {page >= 0 && page < questions.length && (
          <>
            <CardHeader minH="300">
              <Text textAlign={'center'} fontFamily='serif' fontSize='xl'>{questions[page]?.questionContext}</Text>
              <Heading size='md' textAlign='center' mt="50" fontFamily='-moz-initial'>{questions[page]?.questionName}</Heading>
            </CardHeader>
            <hr />
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
                          <>
                            <FormLabel textAlign='center'>Respuesta</FormLabel>
                            <Input w="70%" ml="15%" id={index} type='text' onChange={handleChange} />
                          </>
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
            <CardHeader>
              <Heading textAlign='center' fontFamily='-moz-initial'>Resumen y Cierre</Heading>
            </CardHeader>
            <CardBody textAlign='center' >
              <Heading size='sm' fontFamily='serif' fontSize='xl'>¡Gracias por su participacíon!<br />Esperamos verte pronto en futuras evaluaciones y no olvide enviar su respuesta</Heading>
              <Button colorScheme='yellow' mt="50">Enviar respuestas</Button>
            </CardBody>
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