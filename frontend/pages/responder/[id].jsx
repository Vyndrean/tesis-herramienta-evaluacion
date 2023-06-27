import React, { useEffect as effect, useState as state } from 'react'
import { getQuestions } from '@/data/question'
import { getEvaluation } from '@/data/evaluations'
import { Text, Container, Card, HStack, Stack, CardHeader, Heading, CardBody, Box, Button, useToast as Toast, Input, FormLabel, useDisclosure as Disc, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl } from '@chakra-ui/react'
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import router from 'next/router'
import { createParticipant } from '@/data/participant'
import { createAnswer } from '@/data/answer'
import CustomButton from '@/styles/customButton'

export const getServerSideProps = async (context) => {
  try {
    const val = context.query.validation
    if (val == 123) {
      return {
        props: {
          id: context.query.id
        }
      }
    } else {
      return {
        redirect: {
          destination: "/error",
          permanent: false
        }
      }
    }
  } catch (error) {
    return {
      redirect: {
        destination: "/error",
        permanent: false
      }
    }
  }
}

const index = ({ id }) => {
  const [questions, setQuestions] = state([])
  const [evaluation, setEvaluation] = state([])
  const [page, setPage] = state(-1)
  const [answer, setAnswer] = state([])
  const [userData, setUserData] = state([])
  const toast = Toast()
  const { isOpen, onClose } = Disc({ defaultIsOpen: true })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnswer({
      ...answer,
      answerUser: {
        ...answer.answerUser,
        [name]: value
      }
    })
  };

  const updateAnswer = () => {
    const idQuestion = questions[page + 1]?._id
    setAnswer({
      ...answer,
      answerUser: '',
      question: idQuestion
    })
  }
  console.log(answer)
  const backwardQuestion = () => {
    if (page > -1) {
      setPage(page - 1)
      updateAnswer()
    }
  }

  const forwardQuestion = () => {
    if (page < questions.length) {
      setPage(page + 1)
      updateAnswer()
    }
  }

  const handleSubmit = () => {
    console.log(answer)
    createAnswer(answer).then(res => {
      if (res.status == 200) {
        updateAnswer()
        setPage(page + 1)
      }
    })
  }

  //Who want to respond
  const formUserData = () => {
    const handleUserData = (e) => {
      setUserData({
        ...userData,
        [e.target.name]: e.target.value
      })
    }

    const submitUserData = (e) => {
      e.preventDefault();
      onClose()
      createParticipant(userData).then(res => {
        setAnswer({
          ...answer,
          ["participant"]: res.data._id
        })
      })
    };
    return (
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">Datos de usuario</ModalHeader>

          <form onSubmit={submitUserData} id='form'>
            <ModalBody>
              <FormControl>
                <FormLabel>Nombre y Apellido</FormLabel>
                <Input onChange={handleUserData} name='name' id='name' type='text' isRequired></Input>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <CustomButton colorScheme='green' mr={3} type='submit' >
                Confirmar
              </CustomButton>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    )
  }

  //Navegation
  const showButton = () => {
    if (page == -1) {
      return <CustomButton colorScheme='#FFD700' onClick={() => forwardQuestion()} ml="86.8%"><ArrowForwardIcon boxSize="8" /> </CustomButton>
    }
    if (page >= -1 && page < questions.length) {
      return (
        <>
          <CustomButton colorScheme="#FFD700" onClick={() => backwardQuestion()}> <ArrowBackIcon boxSize="8" /> </CustomButton>
          <CustomButton colorScheme='#FFD700' onClick={() => handleSubmit()}> <ArrowForwardIcon boxSize="8" /> </CustomButton>
        </>
      )
    }
    if (page == questions.length) {
      return <CustomButton colorScheme="#FFD700" onClick={() => backwardQuestion()}> <ArrowBackIcon boxSize="8" /> </CustomButton>
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
      {formUserData()}
      <Stack h="100"></Stack>
      <Stack h="35" pl="5%" paddingBlock="2" borderTopRadius="10" bgColor='#000080'>

      </Stack>
      <Card h="500" w="400" bgColor="#f4efd7" border="1px solid black" borderRadius="0">
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
                            <Input w="70%" ml="15%" id={index} type='text' name='answer' onChange={handleChange} />
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
              <CustomButton colorScheme='yellow' mt="50">Enviar respuestas</CustomButton>
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