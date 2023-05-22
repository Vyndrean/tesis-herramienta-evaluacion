import Navbar from '@/components/Navbar'
import React, { useState } from 'react'
import { checkToken } from '@/data/login'
import { Button, Container, HStack, Heading, Stack, Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { getEvaluations } from '@/data/evaluations'
import DataTable from 'react-data-table-component'
import router from 'next/router'

export const getServerSideProps = async (context) => {
  const res = await getEvaluations()
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

const evaluaciones = ({ data }) => {
  const [evaluation, setEvaluation] = useState(data)
  console.log(evaluation)
  return (
    <>
      <Navbar />
      <Container maxW={"container.md"}>
        <DataTable
          columns={[
            {
              name: "TITULO",
              selector: (data) => data.title,
              sortable: true
            },
            {
              name: "CREADO",
              selector: (data) => data.created_at.substring(0, 10),
              sortable: true
            },
            {
              name: "PREGUNTAS",
              selector: (data) => (
                <Button colorScheme='blue' onClick={() => router.push(`/preguntas/${data._id}`)}>Ver</Button>
              )
            },
            {
              name: "OPCIONES",
              selector: (data) => (
                <HStack>
                  <Button colorScheme='yellow'> Editar</Button>
                  <Button colorScheme='red'>Eliminar</Button>
                </HStack>
              )
            }
          ]}
          data={evaluation}
        />
      </Container>
    </>
  )
}

export default evaluaciones