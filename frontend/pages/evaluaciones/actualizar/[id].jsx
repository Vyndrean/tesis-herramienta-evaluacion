import React, { useState as state } from 'react'
import router from 'next/router'
import { checkToken } from '@/data/login'
import Navbar from '@/components/Navbar'
import { Container, FormControl, FormLabel, HStack, Heading, Stack, Textarea, useToast as Toast } from '@chakra-ui/react'
import { getEvaluation, updateEvaluation } from '@/data/evaluations'
import InputForm from '@/components/InputForm'
import CustomButton from '@/styles/customButton'

export const getServerSideProps = async (context) => {
    const res = await getEvaluation(context.query.id)
    try {
        const check = await checkToken(context.req.headers.cookie)
        if (check.status == 200) {
            return {
                props: {
                    data: res.data
                }
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

const actualizar = ({ data }) => {
    const [evaluation, setEvaluation] = state(data)
    const toast = Toast()
    const handleChange = (e) => {
        const { name, value } = e.target
        setEvaluation({
            ...evaluation,
            [name]: value
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        updateEvaluation(data._id, evaluation).then(res => {
            if (res.status == 200) {
                router.back()
                toast({
                    title: 'Evaluacion actualizada',
                    duration: 3000,
                    isClosable: true,
                    status: 'success'
                })
            }
        })
    }
    return (
        <>
            <Navbar />
            <Container maxW="container.md">
                <form id='form' onSubmit={handleSubmit}>
                    <Stack h="100"></Stack>
                    <Stack h="35" paddingBlock="2" borderTopRadius="10" bgColor='#000080'>
                        <Heading size='sm' textAlign='center' color='white'>Editando </Heading>
                    </Stack>
                    <Stack spacing={4} justify={"center"} border="1px solid black" paddingInline="50" py="10">
                        <InputForm name="title" type="text" placeholder="Ingrese el titulo para la evaluación" handleChange={handleChange} label="Título" isRequired={true} value={evaluation.title} />
                        <FormControl>
                            <FormLabel>Descripción</FormLabel>
                            <Textarea h="200" name='introduction' placeholder='Ingrese la descripción aquí' onChange={handleChange} value={evaluation.introduction}></Textarea>
                        </FormControl>
                    </Stack>
                    <HStack justifyContent="space-between" paddingInline="5" paddingBlock="2" borderBottomRadius="10" bgColor='#000080'>
                        <CustomButton borderRadius="17" h="9" type='submit'>Confirmar</CustomButton>
                        <CustomButton borderRadius="17" h="9" onClick={() => router.back()}>Cancelar</CustomButton>
                    </HStack>
                </form>
            </Container>
        </>
    )
}

export default actualizar