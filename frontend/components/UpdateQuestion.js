import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalOverlay, useDisclosure, useToast as Toast, Stack, FormControl, FormLabel, Select, HStack, Input, Textarea } from '@chakra-ui/react'
import React, { useState as state, useEffect as effect } from 'react'
import InputForm from '@/components/InputForm'
import { updateQuestion, searchQuestion, searchOptions } from '@/data/question'
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'
import CustomButton from '@/styles/customButton'


const UpdateQuestion = ({ id, reload, isEditable }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [addOption, setAddOption] = state(false)
  const toast = Toast()
  const [answer, setAnswer] = state([])
  const [answerCol, setAnswerCol] = state([])
  const [answerRow, setAnswerRow] = state([])
  const [question, setQuestion] = state([])

  const handleChangeAnswer = (e, i) => {
    const { value } = e.target
    const updatedAnswer = [...answer]
    updatedAnswer[i] = { value }
    setAnswer(updatedAnswer)
    setQuestion(prevQuestion => ({
      ...prevQuestion,
      questionOptions: updatedAnswer
    }))
  }

  const handleChangeAnswerCol = (e, i) => {
    const { value } = e.target
    const updatedAnswer = [...answerCol]
    updatedAnswer[i] = { value }
    setAnswerCol(updatedAnswer)
    updateActualQuestion(answerRow, updatedAnswer)
  }

  const handleChangeAnswerRow = (e, i) => {
    const { value } = e.target
    const updatedAnswer = [...answerRow]
    updatedAnswer[i] = { value }
    setAnswerRow(updatedAnswer)
    updateActualQuestion(updatedAnswer, answerCol)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setAddOption(false)
    setQuestion(prevQuestion => ({
      ...prevQuestion,
      [name]: value,
      questionOptions: answer
    })
    )
  }

  const handleAdd = (val) => {
    if (val == 0) {
      const newAnswer = [...answer, {
        value: ''
      }]
      setAnswer(newAnswer)
    } else if (val == 1) {
      const newAnswer = [...answerRow, {
        value: ''
      }]
      setAnswerRow(newAnswer)
    } else if (val == 2) {
      const newAnswer = [...answerCol, {
        value: ''
      }]
      setAnswerCol(newAnswer)
    }
  }

  const addButton = () => {
    if (question?.questionType != 'radio-matriz' && question?.questionType != 'checkbox-matriz') {
      return (
        <CustomButton ml="80%" my="3" onClick={() => handleAdd(0)} hidden={isEditable} isDisabled={isEditable}> <AddIcon /></CustomButton>
      )
    } else {
      return (
        <HStack justifyContent="space-between">
          <CustomButton ml="50%" my="3" onClick={() => handleAdd(1)} hidden={isEditable} isDisabled={isEditable}> <AddIcon mr="2" /> Fila</CustomButton>
          <CustomButton ml="100%" my="3" onClick={() => handleAdd(2)} hidden={isEditable} isDisabled={isEditable}> <AddIcon mr="2" /> Columna</CustomButton>
        </HStack>
      )
    }
  }

  const handleDelete = (e) => {
    const updatedAnswer = [...answer];
    updatedAnswer.splice(e, 1);
    setAnswer(updatedAnswer);
    setQuestion(prevQuestion => ({
      ...prevQuestion,
      questionOptions: updatedAnswer
    }))
  }

  const handleDeleteRow = (e) => {
    const updatedAnswer = answerRow
    updatedAnswer.splice(e, 1)
    setAnswerRow(updatedAnswer)
    updateActualQuestion(updatedAnswer, answerCol)
  }

  const handleDeleteCol = (e) => {
    const updatedAnswer = answerCol
    updatedAnswer.splice(e, 1)
    setAnswerCol(updatedAnswer)
    updateActualQuestion(answerRow, updatedAnswer)
  }

  const updateActualQuestion = (row, col) => {
    setQuestion({
      ...question,
      questionOptions: [
        {
          'row': row,
          'col': col
        }
      ]
    })
  }


  const handleSubmit = (e) => {
    e.preventDefault()
    updateQuestion(id, question).then(res => {
      reload()
      if (res.status == '200') {
        onClose()
        toast({
          title: 'Pregunta actualizada',
          status: 'success',
          duration: 4000,
          isClosable: true
        })

      }
    })
  }

  effect(() => {
    searchQuestion(id).then(res => {
      setQuestion(res.data)
    })
    searchOptions(id).then(res => {
      setAnswerRow(res?.data[0]?.row)
      setAnswerCol(res?.data[0]?.col)
      setAnswer(res.data)
    })
  }, [])

  return (
    <>
      <CustomButton onClick={onOpen} colorScheme='yellow'> <EditIcon /> </CustomButton>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW={"container.md"}>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit} id='form'>
              <Stack spacing={4} my={5} justify={"center"}>
                <HStack>
                  <InputForm name="questionName" type="text" placeholder="Escribe la pregunta aqui" handleChange={handleChange} label="Pregunta" isRequired={true} value={question.questionName} />
                  <FormControl isDisabled={isEditable}>
                    <FormLabel>Tipo de pregunta</FormLabel>
                    <Select name='questionType' onChange={handleChange} placeholder='...' required value={question.questionType}>
                      <option value='radio'>Opción múltiple</option>
                      <option value='checkbox'>Casillas de verificación</option>

                      <option value='radio-matriz'>Cuadrícula de opción múltiple</option>
                      <option value='checkbox-matriz'>Cuadrícula de casillas de verificación</option>
                    </Select>
                  </FormControl>
                </HStack>
                <FormControl>
                  <FormLabel>Contexto</FormLabel>
                  <Textarea name='questionContext' placeholder='Proporciona el contexto de la pregunta' onChange={handleChange} value={question.questionContext} minH="200"></Textarea>
                </FormControl>


                <FormControl hidden={addOption} isDisabled={addOption}>
                  <HStack>
                    <FormLabel>Respuestas</FormLabel>
                    {addButton()}
                  </HStack>
                  <HStack>
                    <div>
                      {question.questionType == 'radio' || question.questionType == 'checkbox' ? (
                        answer.map((data, i) => {
                          const toDelete = (i) => {
                            if (!i == 0 && question.questionType != 'text' && question.questionType != 'textarea') {
                              return (
                                <Button onClick={() => handleDelete(i)} hidden={isEditable} isDisabled={isEditable}> <DeleteIcon /> </Button>
                              )
                            }
                          }

                          return (
                            <HStack key={i} mb="2">
                              <Input w="640px" value={data.value} name={'answer' + i} onChange={(e) => handleChangeAnswer(e, i)}></Input>
                              {toDelete(i)}
                            </HStack>
                          )
                        })
                      ) : (
                        null
                      )
                      }
                      <HStack>
                        <Stack>
                          {question.questionType == 'radio-matriz' || question.questionType == 'checkbox-matriz' ? (
                            answerRow.map((row, i) => {
                              const toDelete = (i) => {
                                if (!i == 0 && question.questionType != 'text' && question.questionType != 'textarea') {
                                  return (
                                    <Button onClick={() => handleDeleteRow(i)} hidden={isEditable} isDisabled={isEditable}> <DeleteIcon /> </Button>
                                  )
                                }
                              }

                              return (
                                <HStack key={i} spacing={2} mb="2">
                                  <Input w="300px" value={row.value} name={'row' + i} onChange={(e) => handleChangeAnswerRow(e, i)}></Input>
                                  {toDelete(i)}
                                </HStack>
                              )
                            })
                          ) : (null)}
                        </Stack>
                        <Stack>
                          {question.questionType == 'radio-matriz' || question.questionType == 'checkbox-matriz' ? (
                            answerCol.map((col, i) => {
                              const toDelete = (i) => {
                                if (!i == 0 && question.questionType != 'text' && question.questionType != 'textarea') {
                                  return (
                                    <Button onClick={() => handleDeleteCol(i)} hidden={isEditable} isDisabled={isEditable}> <DeleteIcon /> </Button>
                                  )
                                }
                              }

                              return (
                                <HStack key={i} spacing={2} mb="2">
                                  <Input w="300px" value={col.value} name={'col' + i} onChange={(e) => handleChangeAnswerCol(e, i)}></Input>
                                  {toDelete(i)}
                                </HStack>
                              )
                            })
                          ) : (null)}
                        </Stack>
                      </HStack>
                    </div>
                  </HStack>
                </FormControl>

              </Stack>
              <HStack justifyContent="space-between">
                <CustomButton borderRadius="17" h="9" colorScheme="green" type='submit'>Confirmar</CustomButton>
                <CustomButton borderRadius="17" h="9" colorScheme="red" onClick={onClose}>Cancelar</CustomButton>
              </HStack>
            </form>
          </ModalBody>

          <ModalFooter>

          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateQuestion