import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalOverlay, useDisclosure, useToast as Toast, Stack, FormControl, FormLabel, Select, HStack, Input, Textarea } from '@chakra-ui/react'
import React, { useState as state, useEffect as effect } from 'react'
import InputForm from '@/components/InputForm'
import { updateQuestion, searchQuestion, searchOptions } from '@/data/question'
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'
import CustomButton from '@/styles/customButton'
import { Text } from '@chakra-ui/react'


const UpdateQuestion = ({ id, reload, isEditable }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [addOption, setAddOption] = state(false)
  const toast = Toast()
  const [answer, setAnswer] = state([])
  const [question, setQuestion] = state([])
  const handleChangeAnswer = (e, i) => {
    const { value } = e.target
    const updatedAnswer = [...answer]
    updatedAnswer[i] = { value }

    setAnswer(updatedAnswer)
    setQuestion(prevQuestion => ({
      ...prevQuestion,
      questionOptions: updatedAnswer
    }));
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

  const handleAdd = () => {
    const newAnswer = [...answer, {
      value: ''
    }]
    setAnswer(newAnswer)
  }

  const addButton = () => {
    if (question?.questionType != 'text' && question?.questionType != 'textarea') {
      return (
        <CustomButton ml="80%" my="3" onClick={() => handleAdd()} hidden={isEditable}> <AddIcon /></CustomButton>
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
    }));
  };

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

                      <option value='textarea'>Parrafo</option>
                      <option value='text'>Respuesta corta</option>
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
                      {
                        answer.map((data, i) => {
                          const toDelete = (i) => {
                            if (!i == 0 && question.questionType != 'text' && question.questionType != 'textarea') {
                              return (
                                <Button onClick={() => handleDelete(i)} hidden={isEditable}> <DeleteIcon /> </Button>
                              )
                            }
                          }
                          const renderInput = (i) => {
                            if (question.questionType == 'text' || question.questionType == 'textarea') {
                              return null
                            }

                            return (
                              <Input w="640px" value={data.value} name={'answer' + i} onChange={(e) => handleChangeAnswer(e, i)}></Input>
                            )
                          }

                          return (
                            <HStack key={i} spacing={8} mb="2">
                              {renderInput(i)}
                              {toDelete(i)}
                            </HStack>
                          )
                        })
                      }

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