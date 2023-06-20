import React, { useState as state } from 'react'
import router from 'next/router'
import { checkToken } from '@/data/login'
import Navbar from '@/components/Navbar'
import { Alert, AlertIcon, Button, Container, FormControl, FormHelperText, FormLabel, HStack, Input, Stack, Text, Textarea, useToast as Toast } from '@chakra-ui/react'
import { createProduct } from '@/data/product'

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
    const [product, setProduct] = state([])
    const toast = Toast()
    const handleChange = (e) => {
        const { name, value } = e.target
        setProduct({
            ...product,
            [name]: value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(product)
        createProduct(product).then(res => {
            if (res.status == 200) {
                router.back()
                toast({
                    title: 'Producto creado',
                    status: 'success',
                    isClosable: true,
                    duration: 3000
                })
            }
        })
    }

    return (
        <>
            <Navbar />
            <Container maxW="container.md">
                <form onSubmit={handleSubmit} id='form'>
                    <Stack h="100"></Stack>
                    <Stack h="35" pl="5%" paddingBlock="2" borderTopRadius="10" bgColor='#000080'></Stack>
                    <Stack spacing={4} justify={"center"} border="1px solid black" paddingInline="50" py="10">
                        <HStack>
                            <FormControl>
                                <FormLabel>Nombre</FormLabel>
                                <Input name='name' type='text' placeholder='Nombre del producto o servicio a evaluar' onChange={handleChange} isRequired />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Tipo</FormLabel>
                                <Input name='type' type='text' placeholder='Que tipo de producto o servicio es' onChange={handleChange} isRequired />
                            </FormControl>
                        </HStack>
                        <FormControl>
                            <FormLabel>Descripcion</FormLabel>
                            <Textarea name='description' type='text' placeholder='Descripcion sobre el producto o servicio' onChange={handleChange} isRequired />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Enlace</FormLabel>
                            <Input name='link' type='text' placeholder='Sitio oficial del producto o servicio a evaluar, por ejemplo https://www.google.cl/' onChange={handleChange} isRequired />
                        </FormControl>
                    </Stack>
                    <HStack spacing='auto' paddingInline="5" paddingBlock="2" borderBottomRadius="10" bgColor='#000080'>
                        <Button type='submit'>Confirmar</Button>
                        <Button onClick={() => router.back()}>Cancelar</Button>
                    </HStack>
                </form>
            </Container>
        </>
    )
}

export default crear