import React, { useState as state } from 'react'
import router from 'next/router'
import { checkToken } from '@/data/login'
import Navbar from '@/components/Navbar'
import { Container, FormControl, FormLabel, HStack, Input, Stack, Textarea, useToast as Toast } from '@chakra-ui/react'
import { getProduct, updateProduct } from '@/data/product'
import CustomButton from '@/styles/customButton'

export const getServerSideProps = async (context) => {
    const res = await getProduct(context.query.id)
    try {
        const check = await checkToken(context.req.headers.cookie)
        if (check.status == 200) {
            return {
                props: {
                    id: context.query.id,
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


const actualizar = ({ id , data}) => {
    const [product, setProduct] = state(data)
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
        updateProduct(id, product).then(res => {
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
                                <Input name='name' type='text' placeholder='Nombre del producto a evaluar' onChange={handleChange} value={product.name} isRequired />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Tipo</FormLabel>
                                <Input name='type' type='text' placeholder='Que tipo de producto es' onChange={handleChange} value={product.type} isRequired />
                            </FormControl>
                        </HStack>
                        <FormControl>
                            <FormLabel>Descripcion</FormLabel>
                            <Textarea h="200" name='description' type='text' placeholder='Descripcion sobre el producto' onChange={handleChange} value={product.description} isRequired />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Enlace</FormLabel>
                            <Input name='link' type='text' placeholder='Sitio oficial del producto a evaluar, por ejemplo https://www.google.cl/' onChange={handleChange} value={product.link} isRequired />
                        </FormControl>
                    </Stack>
                    <HStack justifyContent="space-between" paddingInline="5" paddingBlock="2" borderBottomRadius="10" bgColor='#000080'>
                        <CustomButton type='submit'>Confirmar</CustomButton>
                        <CustomButton onClick={() => router.back()}>Cancelar</CustomButton>
                    </HStack>
                </form>
            </Container>
        </>
    )
}

export default actualizar