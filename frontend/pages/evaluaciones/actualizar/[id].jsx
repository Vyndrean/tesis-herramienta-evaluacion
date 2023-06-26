import React, { useEffect as effect, useState as state } from 'react'
import router from 'next/router'
import { checkToken } from '@/data/login'
import Navbar from '@/components/Navbar'
import { Button, Container, FormControl, FormLabel, HStack, Heading, Input, Stack, Text, Textarea, useToast as Toast } from '@chakra-ui/react'
import { getEvaluation, updateEvaluation } from '@/data/evaluations'
import InputForm from '@/components/InputForm'
import moment from 'moment'

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
    const currentDate = moment().format().substring(0, 10)
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
                            <Textarea name='introduction' placeholder='Ingrese la descripción aquí' onChange={handleChange} value={evaluation.introduction}></Textarea>
                        </FormControl>
                        <HStack>
                            <InputForm name="start_date" type="date" placeholder="Fecha de inicio de la evaluacion" handleChange={handleChange} label="Fecha de inicio" isRequired={true} min={currentDate} value={evaluation.start_date.substring(0, 10)} />
                            <InputForm name="end_date" type="date" handleChange={handleChange} label="Fecha de termino" isRequired={true} min={evaluation?.start_date?.substring(0, 10)} value={evaluation.end_date.substring(0, 10)} />
                        </HStack>
                    </Stack>
                    <HStack justifyContent="space-between" paddingInline="5" paddingBlock="2" borderBottomRadius="10" bgColor='#000080'>
                        <Button borderRadius="17" h="9" type='submit'>Confirmar</Button>
                        <Button borderRadius="17" h="9" onClick={() => router.back()}>Cancelar</Button>
                    </HStack>
                </form>
            </Container>
        </>
    )
}

export default actualizar