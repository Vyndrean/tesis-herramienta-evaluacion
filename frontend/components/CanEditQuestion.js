import React, { useState as state, useEffect as effect } from 'react'
import router from 'next/router'
import { checkToken } from '@/data/login'
import { Text, useDisclosure, useToast as Toast, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, ModalHeader, ModalFooter } from '@chakra-ui/react'
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
    const [evaluation, setEvaluation] = state()

    const handleEditButton = () => {
        if (evaluation?.isEditable) {
            return (
                <CustomButton colorScheme="#000080" onClick={() => isDone()}>Edición finalizada</CustomButton>
            )
        } else {
            return (
                <CustomButton colorScheme="#000080" onClick={onOpen}>Finalizar edición</CustomButton>
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
            title: "Esta evaluación ya finalizo la edición",
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
                            ¿Deseas finalizar la edición de las preguntas?<br />

                        </ModalHeader>
                        <Text size="sm" textAlign="center">
                            Esto limitará la edición de las preguntas solo al texto. Solo debes presionar confirmar si has finalizado, ya que esta acción es irreversible.
                        </Text>
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