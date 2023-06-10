import { EmailIcon } from '@chakra-ui/icons'
import { Button, FormControl, FormLabel, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Textarea, useDisclosure, useToast as Toast } from '@chakra-ui/react'
import React, { useState as state } from 'react'
import { sendEmail } from '@/data/mail'
import { updateEvaluation } from '@/data/evaluations'

const EmailForm = ({ data }) => {
  const [email, setEmail] = state({
    subject: data.title,
    content: "Estimado,\n" + data.introduction + "\nAccesible mediante el siguiente enlace " + `http://localhost:3000/responder/${data._id}`
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
    console.log(email)

    sendEmail(email).then(res => {
      { res.status === 200 } {
        updateEvaluation(data._id, { status: 'send' })
        onClose()
        toast({
          title: 'Enviado correctamente',
          status: 'success',
          duration: 5000,
          isClosable: true
        })

      }
    })
  }

  return (
    <>
      <Button onClick={onOpen} colorScheme='blue'> <EmailIcon /> </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="container.sm">
          <ModalHeader>Envio</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <FormControl>
                <FormLabel>Destinatario</FormLabel>
                <Textarea name='destinatary' onChange={handleChange} isRequired></Textarea>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <HStack>
                <Button colorScheme='green' type='submit'>Confirmar</Button>
                <Button colorScheme='blue' mr={3} onClick={onClose}>
                  Cancelar
                </Button>
              </HStack>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}

export default EmailForm