import React, { useEffect as effect, useState as state } from 'react'
import router from 'next/router'
import { checkToken, getUsers } from '@/data/login'
import Navbar from '@/components/Navbar'
import { Container, HStack, Stack, Text } from '@chakra-ui/react'
import DataTable from 'react-data-table-component'
import CustomButton from '@/styles/customButton'
import DeleteOption from '@/components/DeleteOption'
import { EditIcon } from '@chakra-ui/icons'


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



const usuarios = () => {
    const [user, setUser] = state([])

    const contentReload = async () => {
        await getUsers().then(res => {
            setUser(res.data)
        })
    }

    effect(() => {
        getUsers().then(res => {
            setUser(res.data)
        })
    }, [])
    return (
        <>
            <Navbar />
            <Container maxW="container.sm">
                <HStack mt="2" spacing={"auto"}>
                    <CustomButton colorScheme="green" onClick={() => router.push('/usuarios/crear')}>Crear usuario</CustomButton>
                </HStack>
                <Stack>
                    <DataTable
                        columns={[
                            {
                                name: "NOMBRE DE USUARIO",
                                selector: (data) => data.username,
                                sortable: true
                            },
                            {
                                name: "OPCIONES",
                                selector: (data) => (
                                    <HStack>
                                        <DeleteOption refe='user' id={data._id} reload={contentReload} />
                                    </HStack>
                                )
                            }
                        ]}
                        data={user}
                        pagination
                    />
                </Stack>
            </Container>
        </>
    )
}

export default usuarios