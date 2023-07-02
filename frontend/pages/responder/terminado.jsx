import React from 'react'
import router from 'next/router'
import { checkToken } from '@/data/login'
import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Center, Container, Heading, Text } from '@chakra-ui/react'

export const getServerSideProps = async (context) => {
    try {
        return {
            props: {}
        }
    } catch (error) {
        return {
        }
    }
}

const evaluation_error = () => {
    return (
        <>
            <Container>
                <Center height="80vh">
                    <Box textAlign="center">
                        <Heading as="h1" size="xl" mb={4}>
                            ¡Gracias por tu tiempo!
                        </Heading>
                        <Text fontSize="lg" color="gray.600">
                            Agradecemos sinceramente que hayas respondido y dedicado tu tiempo. ¡Esperamos que hayas encontrado útil esta interacción!
                        </Text>
                    </Box>
                </Center>
            </Container>
        </>
    )
}

export default evaluation_error