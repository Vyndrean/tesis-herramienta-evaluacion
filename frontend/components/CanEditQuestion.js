import React, { useState as state, useEffect as effect } from 'react'
import router from 'next/router'
import { checkToken } from '@/data/login'
import Navbar from '@/components/Navbar'
import { Container, Text, useDisclosure, useToast as Toast, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, ModalHeader, ModalContextProvider, ModalFooter, Stack, Button, HStack } from '@chakra-ui/react'
import CustomButton from '@/styles/customButton'
import { getEvaluation, updateEvaluation } from '@/data/evaluations'

export const getServerSideProps = async (context) => {
    try {
        const check = await checkToken(context.req.headers.cookie)
        if (check.status == 200) {
            return {
                props: {}
            }
        }
    } catch (error) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }
}

const CanEditQuestion = ({ id }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = Toast()
    const [evaluation, setEvaluation] = state([])

    const handleEditButton = () => {
        if (evaluation?.isEditable) {
            return (
                <CustomButton onClick={() => isDone()}>Edición finalizada</CustomButton>
            )
        } else {
            return (
                <CustomButton onClick={onOpen}>Finalizar edición</CustomButton>
            )
        }
    }

    const submitRespond = () => {
        updateEvaluation(id, { "isEditable": true }).then(res => {
            if (res.status == 200) {
                router.reload()
                toast({
                    title: "Evaluacion finalizada",
                    description: "Ahora puedes enviar la evaluacion",
                    status: "info",
                    isClosable: true,
                    duration: 3000
                })
            }
        })
    }

    const isDone = () => {
        toast({
            title: "Esta evaluacion ya finalizo la edicion",
            description: "Ahora solo puedes editar el texto de las preguntas y/o respuestas",
            status: "info",
            isClosable: true,
            duration: 3000
        })
    }

    effect(() => {
        getEvaluation(id).then(res => {
            setEvaluation(res.data)
        })
    }, [])


    return (
        <>
            {handleEditButton()}
            <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent maxW="container.md" w="100">
                    <ModalCloseButton />
                    <ModalBody>
                        <ModalHeader textAlign="center">
                            ¿Quieres finalizar al edicion de las preguntas?<br />

                        </ModalHeader>
                        <Text size="sm" textAlign="center">Esto limitara la edición de las preguntas a solo editar el texto, solo presione “confirmar” solo si ya finalizo, ya que es una acción irreversible.</Text>
                        <ModalFooter justifyContent="space-evenly">
                            <CustomButton colorScheme="green" type='submit' onClick={() => submitRespond()}>Confirmar</CustomButton>
                            <CustomButton colorScheme="red" onClick={onClose} >Cancelar</CustomButton>
                        </ModalFooter>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default CanEditQuestion