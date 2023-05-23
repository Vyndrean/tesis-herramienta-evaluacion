import Navbar from '@/components/Navbar'
import React, { useState as state, useEffect, useMemo } from 'react'
import { checkToken } from '@/data/login'
import { Badge, Button, Container, HStack, Input, useToast as Toast, filter } from '@chakra-ui/react'
import { getEvaluations, deleteEvaluation } from '@/data/evaluations'
import DataTable from 'react-data-table-component'
import router from 'next/router'
import SearchBar from '@/components/SearchBar'

export const getServerSideProps = async (context) => {
  try {
    const check = await checkToken(context.req.headers.cookie)
    if (check.status == 200) {
      return {
        props: {
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

  const contentReload = async () => {
    await getEvaluations().then(res => {
      setEvaluation(res.data)
    })
  }

  useEffect(() => {
    getEvaluations().then(res => {
      setEvaluation(res.data)
    })
  }, [])

  const handleSearch = (e) => {
    let filtered = evaluation.filter(res => {
      return `${res?.title.toLowerCase()}`.includes(e.toLowerCase())
    })
    setEvaluation(filtered)
  }
  return (
    <>
      <Navbar />
      <Container maxW={"container.lg"}>
        <HStack mt="2" spacing={"auto"}>
          <SearchBar  onChange={handleSearch} placeholder="busqueda..." />
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
              selector: () => (
                <Badge colorScheme={"red"}>No disponible</Badge>
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
                  <Button colorScheme='yellow'> Editar</Button>
                  <Button colorScheme='red' onClick={() => deleva(data._id)}>Eliminar</Button>
                </HStack>
              )
            }
          ]}
          data={evaluation}
          pagination
        />
      </Container>
    </>
  )
}

export default evaluaciones