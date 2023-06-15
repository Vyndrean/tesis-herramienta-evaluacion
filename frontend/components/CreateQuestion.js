import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, useToast as Toast, Stack, FormControl, FormLabel, Select, HStack, Input, Textarea } from '@chakra-ui/react'
import React, { useState as state } from 'react'
import InputForm from '@/components/InputForm'
import { createQuestion } from '@/data/evaluations'
import { AddIcon, CloseIcon, DeleteIcon } from '@chakra-ui/icons'
import router from 'next/router'

const CreateQuestion = ({ id }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = Toast()
  const [answer, setAnswer] = state([
    {
      value: ''
    }
  ])
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
    }));
  }
  const handleChange = (e) => {
    const { name, value } = e.target
    setQuestion(prevQuestion => ({
      ...prevQuestion,
      [name]: value,
      questionOptions: answer
    })
    )
    console.log(question)
  }

  const handleAdd = () => {
    const newAnswer = [...answer, {
      value: ''
    }]
    setAnswer(newAnswer)
  }

  const addButton = () => {
    if (question?.questionType != 'text') {
      return (
        <Button ml="50%" mt="3" onClick={() => handleAdd()}> <AddIcon /></Button>
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
    createQuestion(question).then(res => {
      router.reload()
      if (res.status == '200') {
        onClose()
        toast({
          title: 'Pregunta creada',
          status: 'success',
          duration: 4000,
          isClosable: true
        })

      }
    })
  }
  return (
    <>
      <Button onClick={onOpen} colorScheme='green' my={"2"}> Añadir pregunta </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW={"container.md"}>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit} id='form'>
              <Stack spacing={4} my={5} justify={"center"}>
                <HStack>
                  <InputForm name="questionName" type="text" placeholder="Escribe la pregunta aqui" handleChange={handleChange} label="Pregunta" isRequired={true} />
                  <FormControl>
                    <FormLabel>Tipo de pregunta</FormLabel>
                    <Select name='questionType' onChange={handleChange} placeholder='...' required>
                      <option value='radio'>Opcion multiple</option>
                      <option value='checkbox'>Casillas de verificacion</option>
                      <option value='text'>Respuesta simple</option>
                    </Select>
                  </FormControl>
                </HStack>
                <FormControl>
                  <FormLabel>Contexto</FormLabel>
                  <Textarea name='questionContext' placeholder='Proporciona el contexto de la pregunta' onChange={handleChange}></Textarea>
                </FormControl>


                <FormControl>
                  <FormLabel>Respuestas</FormLabel>
                  <HStack>
                    <div>
                      {answer.map((data, i) => {
                        const toDelete = (i) => {
                          if (!i == 0 && question.questionType != 'text') {
                            return (
                              <Button onClick={() => handleDelete(i)}> <DeleteIcon /> </Button>
                            )
                          }

                        }
                        return (
                          <HStack key={i} spacing={8} mb="2">
                            <Input w="640px" value={data.value} name={'answer' + i} onChange={(e) => handleChangeAnswer(e, i)}></Input>
                            {toDelete(i)}
                          </HStack>
                        )
                      })}
                    </div>
                  </HStack>
                </FormControl>

                {addButton()}
              </Stack>
              <HStack spacing="auto">
                <Button colorScheme="green" type='submit'>Confirmar</Button>
                <Button colorScheme="red" onClick={onClose}>Cancelar</Button>
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

export default CreateQuestion