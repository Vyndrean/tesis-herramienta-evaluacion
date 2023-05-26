import React, { useEffect as effect, useState as state } from 'react'
import router from 'next/router'
import { checkToken } from '@/data/login'
import Navbar from '@/components/Navbar'
import { Button, Container, HStack, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useToast as Toast, Select, FormLabel, OrderedList, ListItem, Input, Checkbox, Text, Card, CardHeader, Heading, CardBody, Stack, Box } from '@chakra-ui/react'
import { getQuestions, deleteQuestion } from '@/data/evaluations'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'

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
  const toast = Toast()
  //console.log(questions)
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

  return (
    <>
      <Navbar />

      <Container maxW={"container.lg"}>
        <Button mt="2" colorScheme='green' onClick={() => router.push(`/preguntas/crear/${id.id}`)}>Añadir preguntas</Button>

        {questions.map((question => (
          <Card>
            <HStack spacing={'auto'}>
              <Stack>
                <CardHeader>
                  <Heading size={"md"}>{question?.questionName}</Heading>
                </CardHeader>
                <CardBody>
                  <Stack>
                    <Box>
                        {question.questionOptions.map(res => {
                            <Text>{res.value}</Text>
                          })
                        }
                    </Box>
                  </Stack>
                </CardBody>
              </Stack>
              <Stack mr="5">
                <Button colorScheme='yellow'> <EditIcon /> </Button>
                <Button colorScheme='red' onClick={() => delQuest(question._id, id)}> <DeleteIcon /> </Button>
              </Stack>
            </HStack>
          </Card>
        )))}

        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>Preguntas</Th>
                <Th>Tipo</Th>
                <Th>Respuestas</Th>
                <Th>Opciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {questions.map((question => (
                <Tr key={question._id}>
                  <Td>{question.questionName}</Td>
                  <Td>{question?.questionType || "No seleccionado"}</Td>
                  <Td>{
                    question?.questionOptions.forEach(res => {
                      return (
                        <Text>{res.name}</Text>
                      )
                    })
                  }</Td>
                  <Td>
                    <HStack>
                      <Button colorScheme='yellow'> <EditIcon /> </Button>
                      <Button colorScheme='red' onClick={() => delQuest(question._id, id)}> <DeleteIcon /> </Button>
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