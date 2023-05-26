import { EmailIcon } from '@chakra-ui/icons'
import { Button, FormControl, FormLabel, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Textarea, useDisclosure } from '@chakra-ui/react'
import React, { useState as state } from 'react'

const EmailForm = ({ }) => {
  const [email, setEmail] = state()
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Button onClick={onOpen} colorScheme='blue'> <EmailIcon /> </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Envio</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Asunto</FormLabel>
              <Input></Input>
              <FormLabel>Mensaje</FormLabel>
              <Textarea></Textarea>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <HStack>
              <Button colorScheme='green'>Confirmar</Button>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Cancelar
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default EmailForm