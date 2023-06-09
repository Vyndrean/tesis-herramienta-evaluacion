import Navbar from '@/components/Navbar'
import React, { useState as state, useEffect as effect } from 'react'
import { checkToken } from '@/data/login'
import { Badge, Button, Container, HStack, Text, useToast as Toast, filter, useDisclosure } from '@chakra-ui/react'
import { getEvaluations, deleteEvaluation } from '@/data/evaluations'
import DataTable from 'react-data-table-component'
import router from 'next/router'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import EmailForm from '@/components/EmailForm'

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
  const toast = Toast()

  const deleva = (idEva) => {
    deleteEvaluation(idEva).then(res => {
      if (res.status == '200') {
        toast({
          title: "Eliminado",
          status: "success",
          isClosable: true,
          duration: 3000
        })
        contentReload()
      } else {
        toast({
          title: "Ocurrio un error al realizar la peticion, intentelo mas tarde...",
          status: "warning",
          isClosable: true,
          duration: 3000
        })
      }
    })
  }

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
    <Text>{data.introduction}</Text>
  )
  

  return (
    <>
      <Navbar />
      <Container maxW={"container.lg"}>
        <HStack mt="2" spacing={"auto"}>
          <Button colorScheme='green' onClick={() => router.push('/evaluaciones/crear')}>Crear Evaluacion</Button>
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
              selector: (data) => data.created_at.substring(0, 10),
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
                  <Button colorScheme='yellow'> <EditIcon /> </Button>
                  <Button colorScheme='red' onClick={() => deleva(data._id)}> <DeleteIcon /> </Button>
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