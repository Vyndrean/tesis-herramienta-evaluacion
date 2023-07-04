import React, { useEffect as effect, useState as state } from 'react'
import router from 'next/router'
import { checkToken } from '@/data/login'
import Navbar from '@/components/Navbar'
import { Container, HStack, Heading, List, ListItem, Text } from '@chakra-ui/react'
import DataTable from 'react-data-table-component'
import { getProducts } from '@/data/product'
import { EditIcon } from '@chakra-ui/icons'
import DeleteOption from '@/components/DeleteOption'
import CustomButton from '@/styles/customButton'
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

    const ExpandedComponent = ({ data }) => (
        <List>
            <ListItem>
                <Heading size="sm">Descripción</Heading>
                <Text>{data?.description}</Text>
            </ListItem>
            <hr />
        </List>
    )

    const formatDate = (date) => {
        const newFormat = moment(date.substring(0, 10)).format(`DD-MM-YYYY`)
        return newFormat
    }

    return (
        <>
            <Navbar />
            <Container maxW="container.xl">
                <HStack mt="2">
                    <CustomButton colorScheme="green" onClick={() => router.push('/producto/crear')}>Crear producto</CustomButton>
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
                            selector: (data) => formatDate(data.created_at),
                            sortable: true
                        },
                        {
                            name: "TIPO",
                            selector: (data) => data.type,
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
                                    <CustomButton colorScheme='yellow' onClick={() => router.push(`/producto/actualizar/${data._id}`)}> <EditIcon /> </CustomButton>
                                    <DeleteOption refe='product' id={data._id} reload={contentReload} />
                                </HStack>
                            )
                        }
                    ]}
                    data={products}
                    pagination
                    expandableRows
                    expandableRowsComponent={ExpandedComponent}
                />
            </Container>
        </>
    )
}

export default producto