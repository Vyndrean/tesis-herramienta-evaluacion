import React, { useEffect as effect, useState as state } from 'react'
import { getQuestions } from '@/data/question'
import { getEvaluation } from '@/data/evaluations'
import { Text, Container, Card, HStack, Stack, CardHeader, Heading, CardBody, Box, Input, FormLabel, useDisclosure as Disc, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, FormControl, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react'
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import router from 'next/router'
import { createParticipant } from '@/data/participant'
import { createAnswer } from '@/data/answer'
import { getProduct } from '@/data/product'
import CustomButton from '@/styles/customButton'
import { validateEvaPro } from '@/data/evaPro'
import Cookie from "js-cookie"
import moment from 'moment'

export const getServerSideProps = async (context) => {
  try {
    const res = await getEvaluation(context.query.id)
    const product = await getProduct(context.query.product)
    const validate = await validateEvaPro({
      'evaluation': context.query.id,
      'product': context.query.product
    })
    if (validate.status == 200) {
      return {
        props: {
          id: context.query.id,
          data: res.data,
          product: product.data,
          end: validate.data.end_date
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
        destination: "/responder/error",
        permanent: false
      }
    }
  }
}

const index = ({ id, data, product, end }) => {
  const [questions, setQuestions] = state([])
  const [evaluation] = state(data)
  const [page, setPage] = state(-1)
  const [answer, setAnswer] = state([])
  const [userData, setUserData] = state([])
  const { isOpen, onClose } = Disc({ defaultIsOpen: true })

  //This is the most important part, this handle how the answer is send
  const handleChange = (e) => {
    const { id, type } = e.target
    if (type == 'radio') {
      setAnswer({
        ...answer,
        answerUser: [
          id
        ]
      })
    }
    if (type == 'checkbox') {
      const isSelected = answer.answerUser.includes(id)
      if (isSelected) {
        const updateOptions = answer.answerUser.filter(
          (selected) => selected !== id
        )
        setAnswer({
          ...answer,
          answerUser: updateOptions
        })
      } else {
        setAnswer({
          ...answer,
          answerUser: [
            ...answer.answerUser,
            id
          ]
        })
      }
    }
  }


  //
  const updateAnswer = () => {
    const idQuestion = questions[page + 1]?._id
    setAnswer({
      ...answer,
      answerUser: '',
      question: idQuestion
    })
  }
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
    createAnswer(answer).then(res => {
      if (res.status == 200) {
        updateAnswer()
        setPage(page + 1)
      }
    })
  }

  const formatDate = (date) => {
    const newFormat = moment(date.substring(0, 10)).format(`DD-MM-YYYY`)
    return newFormat
  }

  const handleEndEvaluation = () => {
    const end_date = formatDate(end);
    Cookie.set("evaluation", true, { expires: new Date(end_date) })
    router.push('/responder/terminado')
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
          "participant": res.data._id,
          "product": product._id
        })
      })
    }
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
    if (page == -1 && evaluation.isEditable) {
      return <CustomButton colorScheme='#FFD700' onClick={() => forwardQuestion()} ml="86.8%"><ArrowForwardIcon boxSize="8" /> </CustomButton>
    }
    if (page > -1 && page < questions.length) {
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

  const handleSortQuestions = (questions) => {
    const sortedQuestions = [...questions].sort((a, b) => a.questionPosition - b.questionPosition)
    setQuestions(sortedQuestions)
  }

  effect(() => {
    const alreadyHere = Cookie.get('evaluation')
    console.log(alreadyHere)
    if (alreadyHere) {
      console.log("HEY")
      router.replace('/responder/terminado')
    }
    getQuestions(id).then(res => {
      handleSortQuestions(res.data)
    })
  }, [])
  return (
    <Container maxW={"container.lg"} h="100%">
      {
        evaluation.isEditable == 'false' ? (
          <>
            <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalBody>
                  <Alert
                    status='warning'
                    variant='subtle'
                    flexDirection='column'
                    alignItems='center'
                    justifyContent='center'
                    textAlign='center'
                    height='200px'
                    bgColor="white"
                  >
                    <AlertIcon boxSize='40px' mr={0} />
                    <AlertTitle mt={4} mb={1} fontSize='lg'>
                      Evaluación no disponible
                    </AlertTitle>
                    <AlertDescription maxWidth='sm'>
                      Lamentablemente, en este momento no es posible acceder a la evaluación que buscas. Te pedimos disculpas por las molestias y te sugerimos intentarlo nuevamente en otro momento.
                    </AlertDescription>
                  </Alert>
                </ModalBody>
              </ModalContent>
            </Modal>
          </>
        ) : (
          formUserData()
        )
      }

      <Stack h="100"></Stack>
      <Stack h="35" pl="5%" paddingBlock="2" borderTopRadius="10" bgColor='#000080'>

      </Stack>
      <Card h="500" w="400" border='1px solid #000080' borderRadius="0">
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
                            <input type='checkbox' id={index} value={res.value} name='answer' onChange={handleChange}></input>
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
              <CustomButton colorScheme='yellow' mt="50" onClick={
                () => handleEndEvaluation()
              }>Enviar respuestas</CustomButton>
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