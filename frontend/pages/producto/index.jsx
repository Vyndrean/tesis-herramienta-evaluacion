import React, { useEffect as effect, useState as state } from 'react'
import router from 'next/router'
import { checkToken } from '@/data/login'
import Navbar from '@/components/Navbar'
import { Button, Container, HStack, IconButton, Text } from '@chakra-ui/react'
import DataTable from 'react-data-table-component'
import { getProducts } from '@/data/product'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import DeleteOption from '@/components/DeleteOption'

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


const producto = () => {
    const [products, setProducts] = state([])
    effect(() => {
        getProducts().then(res => {
            setProducts(res.data)
        })
    }, [])

    const contentReload = async () => {
        await getProducts().then(res => {
            setProducts(res.data)
        })
    }

    return (
        <>
            <Navbar />
            <Container maxW="container.xl">
                <HStack mt="2">
                    <Button colorScheme="green" onClick={() => router.push('/producto/crear')}>Crear producto</Button>
                </HStack>
                <DataTable
                    columns={[
                        {
                            name: "NOMBRE",
                            selector: (data) => data.name,
                            sortable: true
                        },
                        {
                            name: "CREADO",
                            selector: (data) => data.created_at,
                            sortable: true
                        },
                        {
                            name: "TIPO",
                            selector: (data) => data.type,
                            sortable: true
                        },
                        {
                            name: "DESCRIPCION",
                            selector: (data) => data.description,
                            sortable: true
                        },
                        {
                            name: "ENLACE",
                            selector: (data) => data.link,
                            sortable: true
                        },
                        {
                            name: "OPCIONES",
                            selector: (data) => (
                                <HStack>
                                    <IconButton
                                        icon={<EditIcon />}
                                        colorScheme='yellow'
                                        onClick={() => console.log("HEY")}
                                    />
                                    <DeleteOption refe='product' id={data._id} reload={contentReload} />
                                </HStack>
                            )
                        }
                    ]}
                    data={products}
                    pagination
                />
            </Container>
        </>
    )
}

export default producto