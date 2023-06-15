import { DeleteIcon } from '@chakra-ui/icons'
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogHeader, AlertDialogOverlay, Button, HStack, useDisclosure, useToast as Toast } from '@chakra-ui/react'
import React from 'react'
import { deleteByRef } from '@/data/evaluations'

const DeleteOption = ({ refe, id, reload }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef()
    const toast = Toast()
    const handleDelete = () => {
        deleteByRef(id, refe).then(res => {
            if (res.status == 200) {
                reload()
                onClose()
                toast({
                    title: "Eliminado",
                    status: "success",
                    isClosable: true,
                    duration: 5000
                })
            } else {
                toast({
                    title: "Ocurrio un error al realizar la peticion, intentelo mas tarde...",
                    status: "warning",
                    isClosable: true,
                    duration: 3000
                })
            }
        })
    }
    return (
        <>
            <Button onClick={onOpen} colorScheme='red'> <DeleteIcon /> </Button>

            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent textAlign='center'>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Borrar
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            ¿Esta seguro de eliminarlo?<br />
                            Esta accion no puede deshacerse.
                        </AlertDialogBody>


                        <HStack spacing='auto' paddingInline="10" paddingBlock="5">
                            <Button colorScheme='green' onClick={() => handleDelete()}>
                                Borrar
                            </Button>
                            <Button colorScheme='red' onClick={onClose}>
                                Cancelar
                            </Button>
                        </HStack>

                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}

export default DeleteOption