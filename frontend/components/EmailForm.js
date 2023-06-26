import { EmailIcon, InfoIcon } from '@chakra-ui/icons'
import { Button, FormControl, FormLabel, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Textarea, useDisclosure, useToast as Toast, defineStyle, Heading, Text, IconButton, FormHelperText, Select } from '@chakra-ui/react'
import React, { useState as state, useEffect as effect } from 'react'
import { sendEmail } from '@/data/mail'
import { updateEvaluation } from '@/data/evaluations'
import { getProducts } from '@/data/product'

const EmailForm = ({ data }) => {
  const [email, setEmail] = state({
    subject: data.title,
    content: "Estimado/a,\n" + data?.introduction + "\nAccesible mediante el siguiente enlace " + `http://localhost:3000/responder/${data._id}?validation=${123}`
  })
  const [product, setProduct] = state([])
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = Toast()
  const handleChangeEmail = (e) => {
    const { value } = e.target
    const emailList = value.split(',').map((toWho) => toWho.trim())
    setEmail({
      ...email,
      'destinatary': emailList
    })
  }

  const handleChange = (e) => {
    console.log("Bueno no hace nada")
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

  effect(() => {
    getProducts().then(res => {
      setProduct(res.data)
    })
  }, [])


  const handleButton = () => {
    if (!data?.isEditable) {
      toast({
        title: "Acción pendiente",
        description: "Se debe finalizar la edicion de la evaluacion, antes de poder enviar",
        status: "info",
        isClosable: true,
        duration: 3000
      })
    } else {
      onOpen()
    }
  }

  return (
    <>
      <Button onClick={() => handleButton()} colorScheme='blue'> <EmailIcon /> </Button>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="container.md">
          <ModalHeader textAlign="center">Envió de {data.title}</ModalHeader>

          <ModalCloseButton />
          <form onSubmit={handleSubmit} >
            <ModalBody>
              <FormControl>
                <FormLabel>Producto</FormLabel>
                <Select name='prodser' placeholder='Seleccione...' onChange={handleChange} isRequired>
                  {
                    product.map((res) => (
                      <option value={res._id} key={res._id}>{res.name}</option>
                    ))
                  }
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Destinatario/os</FormLabel>
                <Textarea name='destinatary' onChange={handleChangeEmail} isRequired></Textarea>
                <FormHelperText textAlign="center">Para ingresar múltiples correos estos deben ser separados por una coma</FormHelperText>
              </FormControl>
            </ModalBody>
            <HStack justifyContent="space-between" marginBlock="5" marginInline="10">
              <Button borderRadius="17" h="9" colorScheme='green' type='submit'>Enviar</Button>
              <Button borderRadius="17" h="9" colorScheme='red' mr={3} onClick={onClose}>
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