import Navbar from '@/components/Navbar'
import React, { useState as state, useEffect as effect } from 'react'
import { checkToken } from '@/data/login'
import { Badge, Button, Container, HStack, Heading, Icon, IconButton, List, ListItem, Text, useToast as Toast, filter, useDisclosure } from '@chakra-ui/react'
import { getEvaluations, deleteEvaluation } from '@/data/evaluations'
import DataTable from 'react-data-table-component'
import router from 'next/router'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import EmailForm from '@/components/EmailForm'
import DeleteOption from '@/components/DeleteOption'
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

const evaluaciones = () => {
  const [evaluation, setEvaluation] = state([])
  const handleStatus = (status) => {
    switch (status) {
      case "pending":
        return <Badge colorScheme='orange'>Pendiente</Badge>

      case "send":
        return <Badge colorScheme='yellow'>Enviado</Badge>

      case "finished":
        return <Badge colorScheme='green'>Finalizado</Badge>
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
        <Heading size="sm">Fecha</Heading>
        <Text>Desde {formatDate(data.start_date)} hasta {formatDate(data.end_date)}</Text>
      </ListItem>
      <hr />
      <ListItem>
        <Heading size="sm">Descripcion</Heading>
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
      <Container maxW={"container.xl"}>
        <HStack mt="2" spacing={"auto"}>
          <Button colorScheme='green' onClick={() => router.push('/evaluaciones/crear')}>Crear Evaluación</Button>
        </HStack>
        <DataTable
          columns={[
            {
              name: "TITULO",
              selector: (data) => data.title,
              sortable: true,
            },
            {
              name: "CREADO",
              selector: (data) => formatDate(data.created_at),
              sortable: true
            },
            {
              name: "ESTADO",
              selector: (data) => (
                handleStatus(data.status)
              )
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
                  <EmailForm data={data} />
                  <IconButton
                    icon={<EditIcon />}
                    colorScheme='yellow'
                    onClick={() => router.push(`/evaluaciones/actualizar/${data._id}`)}
                  />
                  <DeleteOption refe='evaluation' id={data._id} reload={contentReload} />
                </HStack>
              )
            }
          ]}
          data={evaluation}
          pagination
          expandableRows
          expandableRowsComponent={ExpandedComponent}
        />
      </Container>
    </>
  )
}

export default evaluaciones