import React, { useEffect as effect, useState as state } from 'react'
import router from 'next/router'
import { checkToken } from '@/data/login'
import Navbar from '@/components/Navbar'
import { Button, Container, HStack, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useToast as Toast, Select, FormLabel } from '@chakra-ui/react'
import { getQuestions, deleteQuestion } from '@/data/evaluations'

export const getServerSideProps = async (context) => {
  try {
    const check = await checkToken(context.req.headers.cookie)
    if (check.status == 200) {
      return {
        props: {
          id: context.query
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




const questions = ({ id }) => {
  const [questions, setQuestions] = state([])
  const [question, setQuestion] = state({
    evaluation: id
  })
  const toast = Toast()
  const delQuest = (idQuest, idEva) => {
    deleteQuestion(idQuest).then(res => {
      if (res.status == '200') {
        toast({
          title: "Eliminado",
          status: "success",
          isClosable: true,
          duration: 3000
        })
        contentReload(idEva)
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

  const contentReload = async (idEva) => {
    await getQuestions(idEva).then(res => {
      setQuestions(res.data)
    })
  }

  effect(() => {
    getQuestions(id).then(res => {
      setQuestions(res.data)
    })
  }, [])

  const handleChange = (e) => {
    console.log(e.target.value)
    setQuestion({
      ...question,
      [e.target.name]: e.target.value
    })
  }

  const submitQuestion = (e) => {
    console.log("hey")
  }

  return (
    <>
      <Navbar />
      <Container maxW={"container.lg"}>
        <Button mt="2" colorScheme='green' onClick={() => router.push(`/preguntas/crear/${id.id}`)}>Añadir preguntas</Button>
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>Preguntas</Th>
                <Th>Tipo</Th>
                <Th>Opciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {questions.map((question => (
                <Tr key={question._id}>
                  <Td>{question.name}</Td>
                  <Td>{question?.type || "No seleccionado"}</Td>
                  <Td>
                    <HStack>
                      <Button colorScheme='yellow'> Editar</Button>
                      <Button colorScheme='red' onClick={() => delQuest(question._id, id)}>Eliminar</Button>
                    </HStack>
                  </Td>
                </Tr>
              )
              ))
              }

            </Tbody>
          </Table>
        </TableContainer>
      </Container>
    </>
  )
}

export default questions