import { Button, Modal, ModalBody, FormHelperText, ModalCloseButton, ModalContent, ModalOverlay, useDisclosure, useToast as Toast, Stack, FormControl, FormLabel, Select, HStack, Input, Textarea, Text } from '@chakra-ui/react'
import React, { useState as state } from 'react'
import InputForm from '@/components/InputForm'
import { createQuestion } from '@/data/question'
import { AddIcon, DeleteIcon } from '@chakra-ui/icons'
import CustomButton from '@/styles/customButton'

const CreateQuestion = ({ id, reload, length, isEditable }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [addOption, setAddOption] = state(false)
  const toast = Toast()
  const [answer, setAnswer] = state([])
  const [question, setQuestion] = state({
    evaluation: id
  })

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
  const handleChange = (e) => {
    const { name, value } = e.target
    if ((value == 'text' || value == 'textarea') && name == "questionType") {
      setAddOption(true)
      setQuestion(prevQuestion => ({
        ...prevQuestion,
        [name]: value,
        questionOptions: "",
        "questionPosition": length
      })
      )
    } else {
      setAddOption(false)
      setQuestion(prevQuestion => ({
        ...prevQuestion,
        [name]: value,
        questionOptions: answer,
        "questionPosition": length
      })
      )
    }
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
        <CustomButton ml="80%" my="3" onClick={() => handleAdd()} > <AddIcon /></CustomButton>
      )
    }
  }
  const handleDelete = (e) => {
    const updatedAnswer = [...answer]
    updatedAnswer.splice(e, 1)
    setAnswer(updatedAnswer)
    setQuestion(prevQuestion => ({
      ...prevQuestion,
      questionOptions: updatedAnswer
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    createQuestion(question).then(res => {
      reload()
      if (res.status == '200') {
        onClose()
        toast({
          title: 'Pregunta creada',
          status: 'success',
          duration: 4000,
          isClosable: true
        })
        setAnswer([''])
      }
    })
  }
  return (
    <>
      <CustomButton colorScheme="#000080" onClick={onOpen} my={"2"} isDisabled={isEditable}> Añadir pregunta </CustomButton>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="container.md">
          <ModalCloseButton />
          <ModalBody>
            <Text>Pregunta {length}</Text>
            <form onSubmit={handleSubmit} id='form'>
              <Stack spacing={4} my={5} justify={"center"}>
                <HStack>

                  <InputForm name="questionName" type="text" placeholder="Escribe la pregunta aqui" handleChange={handleChange} label="Pregunta" isRequired={true} />

                  <FormControl>
                    <FormLabel>Tipo de pregunta</FormLabel>
                    <Select name='questionType' onChange={handleChange} placeholder='...' isRequired={true}>
                      <option value='radio'>Opción múltiple</option>
                      <option value='checkbox'>Casillas de verificación</option>

                      <option value='textarea'>Parrafo</option>
                      <option value='text'>Respuesta corta</option>
                    </Select>
                  </FormControl>
                </HStack>

                <FormControl>
                  <FormLabel>Contexto</FormLabel>
                  <Textarea name='questionContext' placeholder='Proporciona el contexto de la pregunta' onChange={handleChange}></Textarea>
                  <FormHelperText textAlign="center">La pregunta y el tipo de pregunta son requeridos</FormHelperText>
                </FormControl>

                <FormControl>
                  <HStack>
                    <FormLabel hidden={addOption} isDisabled={addOption}>Respuestas</FormLabel>
                    {addButton()}
                  </HStack>
                  <HStack>
                    <div>
                      {
                        answer.map((data, i) => {
                          const toDelete = (i) => {
                            if (!i == 0 && question.questionType != 'text' && question.questionType != 'textarea') {
                              return (
                                <Button onClick={() => handleDelete(i)}> <DeleteIcon /> </Button>
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
                <CustomButton colorScheme="green" type='submit'>Confirmar</CustomButton>
                <CustomButton colorScheme="red" onClick={onClose}>Cancelar</CustomButton>
              </HStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreateQuestion