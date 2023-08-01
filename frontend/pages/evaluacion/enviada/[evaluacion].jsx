import React, { useState as state, useEffect as effect } from 'react'
import router from 'next/router'
import { checkToken } from '@/data/login'
import Navbar from '@/components/Navbar'
import { Badge, Container, HStack, Heading, List, ListItem, Stack, Text, UnorderedList } from '@chakra-ui/react'
import { getEvaProByID } from '@/data/evaPro'
import DataTable from 'react-data-table-component'
import moment from 'moment'
import DeleteOption from '@/components/DeleteOption'
import CustomButton from '@/styles/customButton'


export const getServerSideProps = async (context) => {
    try {
        const check = await checkToken(context.req.headers.cookie)
        if (check.status == 200) {
            return {
                props: {
                    id: context.query.evaluacion
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

const actualizar = ({ id }) => {
    const [evaluationProduct, setEvaluationProduct] = state([])
    const currentDate = moment().format('YYYY-MM-DDTHH:mm')
    effect(() => {
        getEvaProByID({
            "evaluation": id
        }).then(res => {
            setEvaluationProduct(res.data)
        })
    }, [])
    const contentReload = async () => {
        await getEvaProByID({
            "evaluation": id
        }).then(res => {
            setEvaluationProduct(res.data)
        })
    }

    const formatDate = (date) => {
        const newFormat = moment(date.substring(0, 10)).format(`DD-MM-YYYY`)
        return newFormat
    }

    const ExpandedComponent = ({ data }) => (
        <>
            <Heading size="sm">Correos</Heading>
            <UnorderedList>
                {data.emails.map((res, i) => (
                    <ListItem key={i}>
                        <Text>
                            {res}

                        </Text>
                        <hr />
                    </ListItem>
                ))}
            </UnorderedList>
        </>
    )

    const handleStatus = (data) => {
        const newStartDate = data.start_date.substring(0, 16)
        const newEndDate = data.end_date.substring(0, 16)
        if (currentDate < newStartDate) {
            console.log("HEy")
            return <Badge colorScheme='yellow'>Pendiente</Badge>
        }
        if (currentDate >= newStartDate && currentDate < newEndDate) {
            return <Badge colorScheme='orange'>En progreso</Badge>
        }
        if (currentDate > newEndDate) {
            return <Badge colorScheme='green'>Finalizado</Badge>
        }
        return <Badge colorScheme='yellow'>Pendiente</Badge>
    }

    return (
        <>
            <Navbar />
            <Container maxW="container.xl">
                <HStack my="5">

                </HStack>
                <Stack>
                    <DataTable
                        columns={[
                            {
                                name: "PRODUCTO",
                                selector: (data) => data.product.name,
                                sortable: true
                            },
                            {
                                name: "ESTADO",
                                selector: (data) => (
                                    handleStatus(data)
                                )
                            },
                            {
                                name: "FECHA DE INICIO",
                                selector: (data) => (
                                    <Text>El {formatDate(data.start_date)} a las {data?.start_date?.substring(11, 16)}</Text>
                                )
                            },
                            {
                                name: "FECHA DE TERMINO",
                                selector: (data) => (
                                    <Text>El {formatDate(data.end_date)} a las {data?.end_date?.substring(11, 16)}</Text>
                                )
                            },
                            {
                                name: "OPCIONES",
                                selector: (data) => (
                                    <DeleteOption refe='evaPro' id={data._id} reload={contentReload} />
                                )
                            }
                        ]}
                        data={evaluationProduct}
                        pagination
                        expandableRows
                        expandableRowsComponent={ExpandedComponent}
                    />
                </Stack>
            </Container>
        </>
    )
}

export default actualizar