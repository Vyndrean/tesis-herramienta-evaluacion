import { EmailIcon } from '@chakra-ui/icons'
import { Button, FormControl, FormLabel, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Textarea, useDisclosure, useToast as Toast, defineStyle, Heading, Text } from '@chakra-ui/react'
import React, { useState as state } from 'react'
import { sendEmail } from '@/data/mail'
import { updateEvaluation } from '@/data/evaluations'

const EmailForm = ({ data }) => {
  const [email, setEmail] = state({
    subject: data.title,
    content: "Estimado/a,\n" + data?.introduction + "\nAccesible mediante el siguiente enlace " + `http://localhost:3000/responder/${data._id}?validation=${123}`
  })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = Toast()
  const handleChange = (e) => {
    const { value } = e.target
    const emailList = value.split(',').map((toWho) => toWho.trim())
    setEmail({
      ...email,
      'destinatary': emailList
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendEmail(email).then(res => {
      if (res.status == 200) {
        updateEvaluation(data._id, { status: 'send' })
        toast({
          title: 'Enviado correctamente',
          status: 'success',
          duration: 5000,
          isClosable: true
        })
        onClose()
      }
    })
  }

  return (
    <>
      <Button onClick={onOpen} colorScheme='blue'> <EmailIcon /> </Button>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="container.sm">
          <ModalHeader textAlign="center">Envió</ModalHeader>

          <ModalCloseButton />
          <form onSubmit={handleSubmit} >
            <ModalBody>
              <Text size="sm">Para ingresar múltiples correos estos deben ser separados por una coma</Text>
              <br />
              <FormControl>
                <FormLabel>Destinatario/os</FormLabel>
                <Textarea name='destinatary' onChange={handleChange} isRequired></Textarea>
              </FormControl>
            </ModalBody>

            <HStack spacing='auto' marginBlock="5" marginInline="10">
              <Button colorScheme='green' type='submit'>Enviar</Button>
              <Button colorScheme='red' mr={3} onClick={onClose}>
                Cancelar
              </Button>
            </HStack>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}

export default EmailForm