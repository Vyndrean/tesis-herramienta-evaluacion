import React, { useState as state } from 'react'
import router from 'next/router'
import { checkToken } from '@/data/login'
import Navbar from '@/components/Navbar'
import InputForm from '@/components/InputForm'
import { Button, Container, FormControl, FormLabel, HStack, Input, Stack, Textarea, useToast as Toast } from '@chakra-ui/react'
import { createEvaluation } from '@/data/evaluations'
import moment from 'moment'

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

const crear = () => {
    const [evaluation, setEvaluation] = state({
        status: "pending"
    })
    const toast = Toast()
    const handleChange = (e) => {
        setEvaluation({
            ...evaluation,
            [e.target.name]: e.target.value
        })
    }
    const currentDate = moment().format().substring(0, 10)
    const submitEvaluation = (e) => {
        e.preventDefault()
        createEvaluation(evaluation).then(res => {
            if (res.status == '200') {
                router.push('/evaluaciones')
                toast({
                    title: "Evaluacion creada",
                    status: "success",
                    isClosable: true,
                    duration: 4000
                })
            }
        })
    }

    const startDateStatus = () => {
        if (evaluation.start_date) {
            return <InputForm name="end_date" type="date" handleChange={handleChange} label="Fecha de termino" isRequired={true} min={evaluation?.start_date?.substring(0, 10)} />
        }
    }

    return (
        <>
            <Navbar />
            <Container maxW="container.md">
                <form onSubmit={submitEvaluation} id='form'>
                    <Stack h="100"></Stack>
                    <Stack h="35" pl="5%" paddingBlock="2" borderTopRadius="10" bgColor='#000080'></Stack>
                    <Stack spacing={4} justify={"center"} border="1px solid black" paddingInline="50" py="10">
                        <InputForm name="title" type="text" placeholder="Ingrese el titulo para la evaluación" handleChange={handleChange} label="Título" isRequired={true} />
                        <FormControl>
                            <FormLabel>Descripción</FormLabel>
                            <Textarea name='introduction' placeholder='Ingrese la descripción aquí' onChange={handleChange}></Textarea>
                        </FormControl>
                        <HStack>
                            <InputForm name="start_date" type="date" placeholder="Fecha de inicio de la evaluacion" handleChange={handleChange} label="Fecha de inicio" isRequired={true} min={currentDate} />
                            {startDateStatus()}
                        </HStack>
                    </Stack>
                    <HStack paddingInline="5" paddingBlock="2" borderBottomRadius="10" bgColor='#000080' justifyContent="space-between">
                        <Button type='submit' left='0'>Confirmar</Button>
                        <Button onClick={() => router.back()}>Cancelar</Button>
                    </HStack>
                </form>
            </Container>
        </>
    )
}

export default crear