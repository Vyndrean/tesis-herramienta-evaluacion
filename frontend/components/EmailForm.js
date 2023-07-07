import { EmailIcon } from '@chakra-ui/icons'
import { FormControl, FormLabel, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Textarea, useDisclosure, useToast as Toast, FormHelperText, Select, Input, Heading, Text, Stack, Divider, Center } from '@chakra-ui/react'
import React, { useState as state, useEffect as effect } from 'react'
import { sendEmail } from '@/data/mail'
import { updateEvaluation } from '@/data/evaluations'
import { getProducts } from '@/data/product'
import CustomButton from '@/styles/customButton'
import InputForm from './InputForm'
import moment from 'moment'
import { createEvaPro } from '@/data/evaPro'

const EmailForm = ({ data }) => {
  const [product, setProduct] = state([])
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = Toast()
  const currentDate = moment().format().substring(0, 16)
  const [email, setEmail] = state({
    subject: data.title,
    content: "Estimado/a,\n\n" + data?.introduction +
      "\n\nAccesible mediante el siguiente enlace "
  })
  const [toEvaluate, setToEvaluate] = state({
    evaluation: data._id
  })
  const handleChangeEmail = (e) => {
    const { value } = e.target
    const emailList = value.split(',').map((toWho) => toWho.trim())
    setEmail({
      ...email,
      'destinatary': emailList,
    })
    setToEvaluate({
      ...toEvaluate,
      'emails': emailList
    })
  }
  const handleChange = (e) => {
    const { name, value } = e.target
    setEmail({
      ...email,
      'link': `/responder/${data._id}?product=${value}`
    })
    setToEvaluate({
      ...toEvaluate,
      [name]: value
    })
  }

  const handleDateChanges = (e) => {
    const { name, value } = e.target
    setToEvaluate({
      ...toEvaluate,
      [name]: value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendEmail(email).then(eva => {
      if (eva.status == 200) {
        createEvaPro(toEvaluate).then(res => {
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
    })

  }

  const renderEndDate = () => {
    if (toEvaluate.start_date) {
      return (
        <FormControl>
          <FormLabel>Fecha de termino</FormLabel>
          <Input name='end_date' type='datetime-local' placeholder='Fecha de termino de la evaluación' onChange={handleDateChanges} required min={toEvaluate.start_date} />
        </FormControl>
      )
    }
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
      <CustomButton onClick={() => handleButton()} colorScheme='blue'> <EmailIcon /> </CustomButton>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="container.md">
          <ModalHeader textAlign="center">Envió de {data.title}</ModalHeader>

          <ModalCloseButton />
          <form onSubmit={handleSubmit} id='form'>
            <ModalBody>
              <FormControl>
                <FormLabel>Producto</FormLabel>
                <Select name='product' placeholder='Seleccione...' onChange={handleChange} isRequired>
                  {
                    product.map((res) => (
                      <option value={res._id} key={res._id}>{res.name}</option>
                    ))
                  }
                </Select>
              </FormControl>

              <HStack>
                <FormControl>
                  <FormLabel>Fecha de inicio</FormLabel>
                  <Input name='start_date' type='datetime-local' placeholder='Fecha de inicio de la evaluación' onChange={handleDateChanges} required min={currentDate} />
                </FormControl>
                {
                  renderEndDate()
                }
              </HStack>

              <FormControl>
                <FormLabel>Destinatario/os</FormLabel>
                <Textarea name='destinatary' type='email' onChange={handleChangeEmail} isRequired ></Textarea>
                <FormHelperText textAlign="center">Para ingresar múltiples correos estos deben ser separados por una coma</FormHelperText>
              </FormControl>
            </ModalBody>

            <HStack justifyContent="space-between" marginBlock="5" marginInline="10">
              <CustomButton borderRadius="17" h="9" colorScheme='green' type='submit'>Enviar</CustomButton>
              <CustomButton borderRadius="17" h="9" colorScheme='red' mr={3} onClick={onClose}>
                Cancelar
              </CustomButton>
            </HStack>

          </form>
        </ModalContent>
      </Modal>
    </>
  )
}

export default EmailForm