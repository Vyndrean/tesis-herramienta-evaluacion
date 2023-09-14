import React, { useEffect as effect, useState as state } from 'react'
import { getQuestions } from '@/data/question'
import { getEvaluation } from '@/data/evaluations'
import { Text, Container, Card, HStack, Stack, CardHeader, Heading, CardBody, Box, Input, FormLabel, useDisclosure as Disc, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, FormControl, Alert, AlertIcon, AlertTitle, AlertDescription, useToast as Toast, Link } from '@chakra-ui/react'
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import router from 'next/router'
import { createParticipant, getParticipant } from '@/data/participant'
import { createAnswer, getAnswerOfParticipant, updateAnswers } from '@/data/answer'
import { getProduct } from '@/data/product'
import CustomButton from '@/styles/customButton'
import { getEvaluationProduct } from '@/data/evaPro'
import Cookie from "js-cookie"
import moment from 'moment'

export const getServerSideProps = async (context) => {
  try {
    const res = await getEvaluation(context.query.id)
    const product = await getProduct(context.query.product)
    const evaPro = await getEvaluationProduct(context.query.eva)
    if (evaPro.status == '200') {
      return {
        props: {
          id: context.query.id,
          data: res.data,
          product: product.data,
          end: evaPro.data.end_date,
          start: evaPro.data.start_date
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

const index = ({ id, data, product, end, start }) => {
  const [questions, setQuestions] = state([])
  const [evaluation] = state(data)
  const [page, setPage] = state(-1)
  const [answer, setAnswer] = state([])
  const [userData, setUserData] = state({ answerUser: [] })
  const { isOpen, onClose } = Disc({ defaultIsOpen: true })
  const [alreadyHere, setAlreadyHere] = state(false)
  const [prevAnswer, setPrevAnswer] = state([])
  const toast = Toast()
  //This is the most important part, this handle how the answer is send. Do no touch
  const handleChange = (e, val) => {
    const { id, name } = e.target
    if (val == 'radio') {
      setAnswer({
        ...answer,
        answerUser: [
          id
        ]
      })
    }
    if (val == 'checkbox') {
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
    if (val === 'radio-matriz') {
      const existingAnswerIndex = answer.answerUser.findIndex(item => Object.keys(item)[0] === name)
      //console.log(name, ":", id)
      if (existingAnswerIndex !== -1) {
        const updatedAnswer = [...answer.answerUser]
        updatedAnswer[existingAnswerIndex] = { [name]: id }

        setAnswer({
          ...answer,
          answerUser: updatedAnswer
        })
      } else {
        setAnswer({
          ...answer,
          answerUser: [
            ...answer.answerUser,
            { [name]: id }
          ]
        })
      }
    }
    if (val === 'checkbox-matriz') {
      const existingAnswer = answer.answerUser.find(item => item.name === name)
      const newIdSet = new Set()

      if (existingAnswer) {
        existingAnswer.ids.forEach(existingId => newIdSet.add(existingId))
      }

      if (newIdSet.has(id)) {
        newIdSet.delete(id)
      } else {
        newIdSet.add(id)
      }

      const updatedAnswer = answer.answerUser.filter(item => item.name !== name)
      updatedAnswer.push({ name, ids: Array.from(newIdSet) })

      setAnswer({
        ...answer,
        answerUser: updatedAnswer
      })
    }
  }


  //This function update the answers after render next question
  const updateAnswer = async (pos) => {
    let idQuestion
    if (pos == 'forw') {
      idQuestion = questions[page + 1]?._id
    } else {
      idQuestion = questions[page - 1]?._id
    }
    getAnswerOfParticipant({
      "idQuestion": idQuestion,
      "idProduct": product._id,
      "idParticipant": userData._id
    }).then(res => {
      if (res.status == '200') {
        setPrevAnswer(res.data._id)
        setAnswer({
          ...answer,
          answerUser: res.data.answerUser,
          question: idQuestion
        })
      }
      if (res.data == "") {
        setAnswer({
          ...answer,
          answerUser: [],
          question: idQuestion
        })
      }
    })
  }

  const backwardQuestion = () => {
    if (page > -1) {
      setPage(page - 1)
      updateAnswer('back')
    }
  }

  const forwardQuestion = () => {
    if (page < questions.length) {
      setPage(page + 1)
      updateAnswer('forw')
    }
  }

  //Save answers and go forward to the next question
  const handleSubmit = () => {
    console.log(answer, prevAnswer)
    if (answer.answerUser) {
      if (prevAnswer) {
        updateAnswers(prevAnswer, answer).then(res => {
          if (res.status == '200') {
            updateAnswer('forw')
            setPage(page + 1)
          }
        })
      } else {
        createAnswer(answer).then(res => {
          if (res.status == 200) {
            updateAnswer('forw')
            setPage(page + 1)
          }
        })
      }
    } else {
      toast({
        title: "No ha registrado su respuesta",
        status: 'warning',
        duration: 2000
      })
    }
  }

  //New format to the date
  const formatDate = (date) => {
    const newFormat = moment(date.substring(0, 16)).format(`DD-MM-YYYYTHH:mm`)
    return newFormat
  }


  //Set cookie if you had been finalized the evaluation
  const handleEndEvaluation = () => {
    Cookie.set("evaluation", true, { expires: 100 })
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
      e.preventDefault()
      onClose()
      const end_date = formatDate(end)
      createParticipant(userData).then(res => {
        Cookie.set("user", res.data._id, { expires: new Date(end_date) })
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

  const currentDate = moment().format('DD-MM-YYYYTHH:mm')
  const end_date = formatDate(end)
  const start_date = formatDate(start)

  //Get questions 
  effect(() => {
    getQuestions(id).then(res => {
      handleSortQuestions(res.data)
    })
  }, [])
  //Check if you has been responder
  effect(() => {
    const alreadyRegister = Cookie.get('user')
    const alreadyHasRespond = Cookie.get('evaluation')
    if (alreadyHasRespond) {
      router.replace('/responder/terminado')
    }
    if (alreadyRegister) {
      setAlreadyHere(true)
      getParticipant(alreadyRegister).then(res => {
        setAnswer({
          ...answer,
          "participant": res.data._id,
          "product": product._id
        })
        setUserData(res.data)
      })
    }
    if (start_date > currentDate || end_date < currentDate) {
      router.replace('/responder/error')
    }
  }, [])

  return (
    <Container maxW={"container.lg"} h="100%">

      {!alreadyHere && (
        formUserData()
      )}
      <Stack h="100"></Stack>
      <Stack h="35" pl="5%" paddingBlock="2" borderTopRadius="10" bgColor='#000080'>
        <Text color="white" textAlign='center' mr="10">Evaluando a <Link href={product.link} textAlign='center'>{product.name}</Link></Text>
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
              <Text textAlign='center' fontFamily='serif' fontSize='xl' my="10">Producto en evaluación <Link href={product.link} textAlign='center'>{product.name}</Link></Text>
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
              <HStack>
                <Stack>
                  <Box>
                    <form>
                      {questions[page]?.questionOptions.map((res, index) => (
                        <div key={questions[page]._id + res.value}>
                          {questions[page]?.questionType === 'radio' && (
                            <>
                              <label>{(index + 1) + ')'} </label>
                              <input type='radio' id={index} value={res.value} name='radio' onChange={(e) => handleChange(e, 'radio')}></input>
                              <label htmlFor={index}> {res.value}</label>
                            </>
                          )}
                          {questions[page]?.questionType === 'checkbox' && (
                            <>
                              <label>{(index + 1) + ')'} </label>
                              <input type='checkbox' id={index} value={res.value} name='checkbox' onChange={(e) => handleChange(e, 'checkbox')}></input>
                              <label htmlFor={index}> {res.value}</label>
                            </>
                          )}
                          {questions[page]?.questionType === 'radio-matriz' && (
                            <>
                              {res.row.map((row, irow) => (
                                <div key={row.value}>
                                  <HStack>
                                    <Text>{row.value.toString()} </Text>
                                    <Stack marginInline="2"></Stack>
                                    {res.col.map((col, icol) => (
                                      <HStack key={col.value + icol}>
                                        <input type="radio" id={icol} value={col.value} name={irow} onChange={(e) => handleChange(e, 'radio-matriz')} />
                                        <label htmlFor={icol}>{col.value.toString()}</label>
                                      </HStack>
                                    ))}
                                  </HStack>
                                </div>
                              ))}
                            </>
                          )}
                          {questions[page]?.questionType === 'checkbox-matriz' && (
                            <>
                              {res.row.map((row, irow) => (
                                <div key={row.value}>
                                  <HStack>
                                    <Text>{row.value.toString()} </Text>
                                    <Stack marginInline="2"></Stack>
                                    {res.col.map((col, icol) => (
                                      <HStack key={col.value}>
                                        <input type="checkbox" id={icol} value={col.value} name={irow} onChange={(e) => handleChange(e, 'checkbox-matriz')} />
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
              </HStack>
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