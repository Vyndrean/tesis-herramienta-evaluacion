import React from 'react'

const FormUserData = () => {
    return (
        <>
            <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign="center">Datos de usuario</ModalHeader>

                    <form>
                        <ModalBody>
                            <FormControl>
                                <FormLabel>Nombre y Apellido</FormLabel>
                                <Input onChange={handleUserData} name='participantName' isRequired></Input>
                            </FormControl>
                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme='green' mr={3} type='submit' >
                                Confirmar
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </>
    )
}

export default FormUserData