import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, useToast as Toast, Stack, FormControl, FormLabel, Select, HStack, Input, Textarea } from '@chakra-ui/react'
import React, { useState as state } from 'react'
import InputForm from '@/components/InputForm'
import { createQuestion } from '@/data/evaluations'
import { CloseIcon } from '@chakra-ui/icons'
import router from 'next/router'

const CreateQuestion = ({ id }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = Toast()
  const [answer, setAnswer] = state([
    {
      name: '',
      value: ''
    }
  ])
  const [question, setQuestion] = state({
    evaluation: id
  })

  const handleChangeAnswer = (e, i) => {
    const { name, value } = e.target
    const updatedAnswer = [...answer]
    updatedAnswer[i] = { name, value }

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
      name: '', value: ''
    }]
    setAnswer(newAnswer)
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
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit} id='form'>
              <Stack spacing={4} my={5} justify={"center"}>
                <FormControl>
                  <FormLabel>Tipo de pregunta</FormLabel>
                  <Select name='questionType' defaultValue={'default'} onChange={handleChange}>
                    <option value='default' disabled>Seleccione...</option>
                    <option value='checkbox'>Opcion multiple</option>
                    <option value='radio'>Alternativas</option>
                    <option value='text'>Pregunta simple</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Contexto</FormLabel>
                  <Textarea name='questionContext' placeholder='Contexto en el cual se basa la pregunta' onChange={handleChange}></Textarea>
                </FormControl>
                <InputForm name="questionName" type="text" placeholder="¿Que es lo que quieres preguntar?" handleChange={handleChange} label="Pregunta" />

                <FormLabel>Respuestas</FormLabel>
                {answer.map((data, i) => {
                  return (
                    <HStack key={i}>
                      <Input value={data.value} name={'answer' + i} onChange={(e) => handleChangeAnswer(e, i)}></Input>
                      <Button onClick={() => handleDelete(i)}> <CloseIcon /> </Button>
                    </HStack>
                  )
                })}
                <Button onClick={() => handleAdd()} w="18">Añadir respuesta</Button>
              </Stack>
              <HStack>
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