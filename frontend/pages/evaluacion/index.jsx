import Navbar from '@/components/Navbar'
import React, { useState as state, useEffect as effect } from 'react'
import { checkToken } from '@/data/login'
import { Badge, Container, HStack, Heading, List, ListItem, Stack, Text } from '@chakra-ui/react'
import { getEvaluations } from '@/data/evaluations'
import DataTable from 'react-data-table-component';
import router from 'next/router'
import { ChevronRightIcon, EditIcon } from '@chakra-ui/icons'
import EmailForm from '@/components/EmailForm'
import DeleteOption from '@/components/DeleteOption'
import moment from 'moment'
import CustomButton from '@/styles/customButton'

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

const evaluaciones = () => {
  const [evaluation, setEvaluation] = state([])
  const handleStatus = (status) => {
    if (!status) {
      return <Badge colorScheme='yellow'>En preparación</Badge>
    } else {
      return <Badge colorScheme='green'>Listo para enviar</Badge>
    }
  }

  const contentReload = async () => {
    await getEvaluations().then(res => {
      setEvaluation(res.data)
    })
  }

  effect(() => {
    getEvaluations().then(res => {
      setEvaluation(res.data)
    })
  }, [])

  const ExpandedComponent = ({ data }) => (
    <List>
      <ListItem>
        <Heading size="sm">Título</Heading>
        <Text>{data?.title}</Text>
      </ListItem>
      <hr />
      <ListItem>
        <Heading size="sm">Descripción</Heading>
        <Text>{data?.introduction}</Text>
      </ListItem>
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
        <HStack mt="2" spacing={"auto"}>
          <CustomButton colorScheme="green" onClick={() => router.push('/evaluacion/crear')}>Crear Evaluación</CustomButton>
        </HStack>
        <Stack>
          <DataTable
            columns={[
              {
                name: "TÍTULO",
                selector: (data) => data.title,
                sortable: true,
                width: '400px'
              },
              {
                name: "CREADO",
                selector: (data) => formatDate(data.created_at),
                sortable: true,
                width: '100px'
              },
              {
                name: "ESTADO",
                selector: (data) => (
                  handleStatus(data.isEditable)
                ),
                width: '150px'
              },
              {
                name: "PREGUNTAS",
                selector: (data) => (
                  <CustomButton colorScheme="blue" onClick={() => router.push(`/evaluacion/preguntas/${data._id}`)}> <ChevronRightIcon boxSize="6" /> </CustomButton>
                ),
                center: true,
                width: '100px'
              },
              {
                name: "ESTADO DE ENVIO",
                selector: (data) => (
                  <CustomButton colorScheme='blue' onClick={() => router.push(`/evaluacion/enviada/${data._id}`)} isDisabled={!data.isEditable}> <ChevronRightIcon boxSize="6" /></CustomButton>
                ),
                center: true,
                width: '130px'
              },
              {
                name: "RESULTADOS",
                selector: (data) => (
                  <CustomButton colorScheme='blue' onClick={() => router.push(`/evaluacion/resultados/${data._id}`)} isDisabled={!data.isEditable}> <ChevronRightIcon boxSize="6" /></CustomButton>
                ),
                center: true,
                width: '100px'
              },
              {
                name: "OPCIONES",
                selector: (data) => (
                  <HStack>
                    <EmailForm data={data} />
                    <CustomButton colorScheme="yellow" onClick={() => router.push(`/evaluacion/actualizar/${data._id}`)}> <EditIcon /> </CustomButton>
                    <DeleteOption refe='evaluation' id={data._id} reload={contentReload} />
                  </HStack>
                ),
                center: true
              }
            ]}
            data={evaluation}
            pagination
            expandableRows
            expandableRowsComponent={ExpandedComponent}
          />
        </Stack>
      </Container>
    </>
  )
}

export default evaluaciones