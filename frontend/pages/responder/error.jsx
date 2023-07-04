import React from 'react'
import { Box, Center, Container, Heading, Text } from '@chakra-ui/react'

const evaluation_error = () => {
    return (
        <>
            <Container>
                <Center height="80vh">
                    <Box textAlign="center">
                        <Heading as="h1" size="xl" mb={4}>
                            Evaluación no disponible
                        </Heading>
                        <Text fontSize="lg" color="gray.600">
                            Lamentablemente, en este momento no es posible acceder a la evaluación que buscas. Te pedimos disculpas por las molestias y te sugerimos intentarlo nuevamente en otro momento.
                        </Text>
                    </Box>
                </Center>
            </Container>
        </>
    )
}

export default evaluation_error