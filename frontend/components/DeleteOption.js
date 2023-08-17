import { DeleteIcon } from '@chakra-ui/icons'
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogHeader, AlertDialogOverlay, HStack, useDisclosure, useToast as Toast } from '@chakra-ui/react'
import React from 'react'
import { deleteByRef } from '@/data/evaluations'
import CustomButton from '@/styles/customButton'

const DeleteOption = ({ refe, id, reload, isEditable }) => {
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
            <CustomButton colorScheme='red' hidden={isEditable} onClick={onOpen}> <DeleteIcon /> </CustomButton>
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
                            Esta acción no puede deshacerse.
                        </AlertDialogBody>
                        <HStack justifyContent="space-between" paddingInline="10" paddingBlock="5">
                            <CustomButton colorScheme='green' borderRadius="17" h="9" onClick={() => handleDelete()}>
                                Borrar
                            </CustomButton>
                            <CustomButton colorScheme='red' borderRadius="17" h="9" onClick={onClose}>
                                Cancelar
                            </CustomButton>
                        </HStack>

                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}

export default DeleteOption